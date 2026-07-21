#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Reject Gate CLI X summaries that do not contain verifiable tweet-level URLs."""

import argparse
import json
import re
import sys
from pathlib import Path


X_STATUS_RE = re.compile(r"^https?://(?:(?:www|mobile)\.)?x\.com/[^/?#]+/status/(\d{15,})(?:[/?#].*)?$", re.I)
X_ARTICLE_RE = re.compile(r"^https?://(?:www\.)?x\.com/(?:i/article/(\d{15,})|[^/?#]+/article/(\d{15,}))(?:[/?#].*)?$", re.I)


def is_placeholder_id(url):
    match = re.search(r"/(?:status|article)/(\d+)(?:[/?#].*)?$", str(url or ""), re.I)
    if not match:
        return True
    value = match.group(1)
    if len(value) < 15 or len(set(value)) == 1:
        return True
    ascending = "".join(str(index % 10) for index in range(len(value)))
    descending = "".join(str(9 - (index % 10)) for index in range(len(value)))
    return value in {ascending, descending}


def valid_x_url(url):
    url = str(url or "").strip()
    if "example" in url.lower() or is_placeholder_id(url):
        return False
    return bool(X_STATUS_RE.match(url) or X_ARTICLE_RE.match(url))


def load_payload(path_value):
    if path_value == "-":
        return json.load(sys.stdin)
    return json.loads(Path(path_value).read_text(encoding="utf-8"))


def validate(payload):
    cited = payload.get("cited_tweets") or []
    items = payload.get("items") or []
    candidates = cited or items
    valid = [row for row in candidates if valid_x_url(row.get("url"))]
    rejected = len(candidates) - len(valid)
    summary_present = bool(str(payload.get("summary") or payload.get("content") or "").strip())

    print("[x-candidates] candidates=%d valid=%d rejected=%d summary_present=%s" % (
        len(candidates), len(valid), rejected, str(summary_present).lower()
    ))
    if not candidates:
        print("[x-candidates][error] cited_tweets/items 为空；忽略 summary/content，不得进入 digest")
        return 1
    if not valid:
        print("[x-candidates][error] 没有可验证的具体 X status/article URL")
        return 1
    if rejected:
        print("[x-candidates][warn] 已丢弃 %d 条 profile、占位或格式错误 URL" % rejected)
    print("[x-candidates] OK；下一步仍需用浏览器逐条打开核验作者、时间和正文")
    return 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("json_path", help="Gate CLI search-x JSON path, or - for stdin")
    args = parser.parse_args()
    try:
        payload = load_payload(args.json_path)
    except (OSError, json.JSONDecodeError) as exc:
        print("[x-candidates][error] 无法读取 JSON：%s" % exc)
        return 1
    return validate(payload)


if __name__ == "__main__":
    sys.exit(main())
