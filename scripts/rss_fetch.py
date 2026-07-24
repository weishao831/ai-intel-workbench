#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Collect configured RSS/Atom feeds into auditable daily evidence artifacts."""

import argparse
import datetime as dt
import email.utils
import hashlib
import html
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

from common import ROOT, load_workbench_config, normalize_date, write_text


USER_AGENT = "AI-Intel-Workbench/0.4 (+local RSS collector)"
TAG_RE = re.compile(r"<[^>]+>")
SPACE_RE = re.compile(r"\s+")


def local_name(tag):
    return str(tag or "").rsplit("}", 1)[-1].lower()


def clean_text(value):
    text = html.unescape(TAG_RE.sub(" ", str(value or "")))
    return SPACE_RE.sub(" ", text).strip()


def child_text(node, names):
    names = set(names)
    for child in list(node):
        if local_name(child.tag) in names:
            text = "".join(child.itertext())
            if clean_text(text):
                return clean_text(text)
    return ""


def entry_link(node):
    for child in list(node):
        if local_name(child.tag) != "link":
            continue
        href = str(child.attrib.get("href") or "").strip()
        rel = str(child.attrib.get("rel") or "alternate").strip()
        if href and rel in {"", "alternate"}:
            return href
        text = clean_text("".join(child.itertext()))
        if text.startswith(("http://", "https://")):
            return text
    guid = child_text(node, {"guid", "id"})
    return guid if guid.startswith(("http://", "https://")) else ""


def parse_date(value):
    raw = str(value or "").strip()
    if not raw:
        return None
    try:
        parsed = email.utils.parsedate_to_datetime(raw)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=dt.timezone.utc)
        return parsed
    except (TypeError, ValueError, OverflowError):
        pass
    try:
        parsed = dt.datetime.fromisoformat(raw.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=dt.timezone.utc)
        return parsed
    except ValueError:
        return None


def parse_feed(xml_bytes, run_date, lookback_days, max_items):
    root = ET.fromstring(xml_bytes)
    entries = [node for node in root.iter() if local_name(node.tag) in {"item", "entry"}]
    results = []
    for node in entries:
        title = child_text(node, {"title"})
        url = entry_link(node)
        published_raw = child_text(node, {"pubdate", "published", "updated", "date"})
        published = parse_date(published_raw)
        if not title or not url or not published:
            continue
        published_date = published.astimezone(dt.timezone.utc).date()
        age = (run_date - published_date).days
        if age < 0 or age > lookback_days:
            continue
        excerpt = child_text(node, {"description", "summary", "content", "encoded"})
        author = child_text(node, {"author", "creator"})
        if not author:
            for child in list(node):
                if local_name(child.tag) == "author":
                    author = child_text(child, {"name", "email"})
                    if author:
                        break
        results.append({
            "url": url,
            "title": title,
            "author": author,
            "published_at": published.isoformat(),
            "excerpt": excerpt[:1200],
        })
        if len(results) >= max_items:
            break
    return results


def fetch_bytes(url, timeout):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def safe_id(value):
    slug = re.sub(r"[^a-z0-9_-]+", "-", str(value or "").lower()).strip("-")
    if slug:
        return slug[:64]
    return hashlib.sha1(str(value).encode("utf-8")).hexdigest()[:12]


def record_trace(date_iso, feed, artifact, lookback_days, status):
    command = [
        sys.executable,
        str(ROOT / "scripts" / "research_trace.py"),
        "record",
        "--date", date_iso,
        "--id", "rss-%s" % safe_id(feed.get("id") or feed.get("name")),
        "--provider", "rss-feed",
        "--group", str(feed.get("query_group") or "community_hotspots"),
        "--query", "RSS feed: %s" % feed.get("name"),
        "--artifact", str(artifact),
        "--status", status,
        "--window-days", str(lookback_days),
    ]
    subprocess.run(command, cwd=str(ROOT), check=True)


def collect(date_value, selected_ids=None, should_record=False, fetcher=fetch_bytes):
    date_iso = normalize_date(date_value)
    run_date = dt.date.fromisoformat(date_iso)
    config = load_workbench_config()
    rss = config.get("rss") or {}
    if not rss.get("enabled", True):
        print("[rss] disabled")
        return []
    feeds = [feed for feed in rss.get("feeds") or [] if isinstance(feed, dict) and feed.get("enabled", True)]
    if selected_ids:
        feeds = [feed for feed in feeds if feed.get("id") in selected_ids]
    lookback_days = int(rss.get("lookback_days") or 7)
    max_items = int(rss.get("max_items_per_feed") or 20)
    timeout = int(rss.get("timeout_seconds") or 15)
    evidence_dir = ROOT / ".daily-intel" / "runs" / date_iso / "evidence"
    evidence_dir.mkdir(parents=True, exist_ok=True)
    summaries = []

    for feed in feeds:
        feed_id = safe_id(feed.get("id") or feed.get("name"))
        query = "RSS feed: %s" % feed.get("name")
        artifact = evidence_dir / ("rss-%s.json" % feed_id)
        status = "success"
        error = ""
        try:
            xml_bytes = fetcher(str(feed.get("url") or ""), timeout)
            results = parse_feed(xml_bytes, run_date, lookback_days, max_items)
            if not results:
                status = "empty"
        except (ET.ParseError, OSError, ValueError, urllib.error.URLError) as exc:
            results = []
            status = "error"
            error = "%s: %s" % (type(exc).__name__, exc)
        for row in results:
            row.update({
                "query": query,
                "feed_id": feed_id,
                "feed_name": feed.get("name"),
                "feed_url": feed.get("url"),
                "dimension": feed.get("dimension") or "lab",
                "query_group": feed.get("query_group") or "community_hotspots",
                "priority": feed.get("priority") or "normal",
            })
        payload = {
            "query": query,
            "feed": {
                "id": feed_id,
                "name": feed.get("name"),
                "url": feed.get("url"),
                "dimension": feed.get("dimension") or "lab",
                "query_group": feed.get("query_group") or "community_hotspots",
                "priority": feed.get("priority") or "normal",
            },
            "window_days": lookback_days,
            "status": status,
            "error": error,
            "count": len(results),
            "results": results,
        }
        write_text(artifact, json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
        if should_record:
            record_trace(date_iso, feed, artifact, lookback_days, status)
        summaries.append({
            "id": feed_id,
            "name": feed.get("name"),
            "status": status,
            "count": len(results),
            "artifact": str(artifact.relative_to(ROOT)),
        })
        print("[rss] %s status=%s items=%d" % (feed.get("name"), status, len(results)))
    return summaries


def main():
    parser = argparse.ArgumentParser(description="Collect configured RSS/Atom feeds")
    parser.add_argument("--date", default="today")
    parser.add_argument("--feed", action="append", dest="feeds", help="只采集指定 feed id，可重复")
    parser.add_argument("--record", action="store_true", help="同时登记到当日 research trace")
    parser.add_argument("--summary-json", action="store_true", help="输出机器可读汇总")
    args = parser.parse_args()
    summaries = collect(args.date, set(args.feeds or []), args.record)
    if args.summary_json:
        print(json.dumps({"feeds": summaries}, ensure_ascii=False))
    failed = [row for row in summaries if row["status"] == "error"]
    return 1 if summaries and len(failed) == len(summaries) else 0


if __name__ == "__main__":
    raise SystemExit(main())
