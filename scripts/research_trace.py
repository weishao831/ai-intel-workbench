#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Create and validate query-level evidence for a daily intelligence run."""

import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path

from common import ROOT, normalize_date, read_text, write_text


REQUIRED_GROUPS = {
    "community_hotspots",
    "access_and_quota",
    "chinese_frontier_models",
    "x_viewpoints",
    "domestic_lab_models",
    "domestic_lab_product_ops",
    "domestic_lab_research",
    "dynamic_kol_views",
}
CORE_LABS = {
    "qwen",
    "deepseek",
    "kimi",
    "zai",
    "bytedance_seed",
    "tencent_hunyuan",
    "baidu_ernie",
    "minimax",
}
LAB_TRACKS = {"model_release", "product_ops", "research"}
PROVIDERS = {
    "gate-search-x",
    "public-web-index",
    "x-browser",
    "official-web",
    "web-search",
    "github",
    "paper-index",
}
URL_RE = re.compile(r"https?://[^\s\"'<>]+", re.I)
X_POST_RE = re.compile(
    r"^https?://(?:(?:www|mobile)\.)?x\.com/[^/?#]+/(?:status|article)/(\d{15,})(?:[/?#].*)?$",
    re.I,
)


def run_dir(date_value):
    return ROOT / ".daily-intel" / "runs" / normalize_date(date_value)


def trace_path(date_value):
    return run_dir(date_value) / "research_trace.json"


def now_iso():
    return dt.datetime.now().astimezone().isoformat(timespec="seconds")


def relative_to_root(path):
    return str(Path(path).resolve().relative_to(ROOT.resolve()))


def safe_artifact_path(date_value, value):
    path = Path(value)
    if not path.is_absolute():
        path = ROOT / path
    resolved = path.resolve()
    expected = run_dir(date_value).resolve()
    if resolved != expected and expected not in resolved.parents:
        raise SystemExit("[trace] artifact 必须位于当日运行目录内: %s" % resolved)
    return resolved


def load_trace(date_value):
    path = trace_path(date_value)
    if not path.exists():
        raise SystemExit("[trace] 未找到 %s" % path)
    return json.loads(read_text(path))


def save_trace(date_value, payload):
    write_text(trace_path(date_value), json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


def collect_urls(value):
    urls = []

    def visit(node):
        if isinstance(node, dict):
            for child in node.values():
                visit(child)
        elif isinstance(node, list):
            for child in node:
                visit(child)
        elif isinstance(node, str):
            urls.extend(URL_RE.findall(node))

    visit(value)
    cleaned = []
    for url in urls:
        url = url.rstrip(".,);]}")
        if url not in cleaned:
            cleaned.append(url)
    return cleaned


def result_count(payload, urls):
    for key in ("count", "total"):
        value = payload.get(key) if isinstance(payload, dict) else None
        if isinstance(value, int) and value >= 0:
            return max(value, len(urls))
    for key in ("results", "items", "cited_tweets", "cited_sources"):
        value = payload.get(key) if isinstance(payload, dict) else None
        if isinstance(value, list):
            return max(len(value), len(urls))
    return len(urls)


def scope_payload_to_query(payload, query):
    """Return only rows belonging to query when an artifact combines searches."""
    if not isinstance(payload, dict) or not isinstance(payload.get("results"), list):
        return payload
    query_rows = [
        row for row in payload["results"]
        if isinstance(row, dict) and str(row.get("query") or "").strip()
    ]
    if not query_rows:
        return payload
    expected = str(query).strip()
    matched = [row for row in query_rows if str(row.get("query")).strip() == expected]
    if not matched:
        raise SystemExit("[trace] 合并 artifact 中找不到对应 query: %s" % expected)
    scoped = dict(payload)
    scoped["results"] = matched
    scoped.pop("count", None)
    scoped.pop("total", None)
    return scoped


def cmd_init(args):
    date_iso = normalize_date(args.date)
    target = run_dir(date_iso)
    (target / "evidence").mkdir(parents=True, exist_ok=True)
    payload = {
        "schema_version": 1,
        "date": date_iso,
        "mode": args.mode,
        "started_at": now_iso(),
        "completed_at": None,
        "runs": [],
    }
    save_trace(date_iso, payload)
    print("[trace] initialized", trace_path(date_iso))


def cmd_record(args):
    date_iso = normalize_date(args.date)
    payload = load_trace(date_iso)
    artifact = safe_artifact_path(date_iso, args.artifact)
    if not artifact.exists():
        raise SystemExit("[trace] artifact 不存在: %s" % artifact)
    try:
        raw = json.loads(read_text(artifact))
    except json.JSONDecodeError as exc:
        raise SystemExit("[trace] artifact 不是有效 JSON: %s" % exc)
    query = args.query or (raw.get("query") if isinstance(raw, dict) else "")
    if not str(query or "").strip():
        raise SystemExit("[trace] query 不能为空")
    scoped = scope_payload_to_query(raw, query)
    urls = collect_urls(scoped)
    x_urls = [url for url in urls if X_POST_RE.match(url)]
    run = {
        "id": args.id,
        "provider": args.provider,
        "query_group": args.group,
        "query": str(query).strip(),
        "executed_at": args.executed_at or now_iso(),
        "status": args.status,
        "result_count": result_count(scoped, urls),
        "candidate_urls": urls,
        "x_post_urls": x_urls,
        "artifact": relative_to_root(artifact),
    }
    if args.lab:
        run["lab"] = args.lab
    if args.track:
        run["track"] = args.track
    runs = [row for row in payload.get("runs", []) if row.get("id") != args.id]
    runs.append(run)
    payload["runs"] = runs
    save_trace(date_iso, payload)
    print("[trace] recorded id=%s provider=%s results=%d x_posts=%d" % (
        args.id, args.provider, run["result_count"], len(x_urls)
    ))


def validate_trace(date_value, require_complete=False):
    date_iso = normalize_date(date_value)
    payload = load_trace(date_iso)
    errors = []
    warnings = []
    runs = [row for row in payload.get("runs", []) if isinstance(row, dict)]
    if payload.get("date") != date_iso:
        errors.append("trace 日期不匹配")
    if payload.get("mode") not in {"scheduled", "interactive"}:
        errors.append("trace mode 必须是 scheduled 或 interactive")
    if require_complete and not payload.get("completed_at"):
        errors.append("trace 尚未 finalize")
    ids = [str(row.get("id") or "") for row in runs]
    if len(ids) != len(set(ids)) or any(not value for value in ids):
        errors.append("trace run id 缺失或重复")
    for row in runs:
        if row.get("provider") not in PROVIDERS:
            errors.append("未知 provider：%s" % row.get("provider"))
        if row.get("query_group") not in REQUIRED_GROUPS:
            errors.append("未知 query_group：%s" % row.get("query_group"))
        if not str(row.get("query") or "").strip():
            errors.append("run 没有实际 query：%s" % row.get("id"))
        artifact = row.get("artifact")
        if not artifact:
            errors.append("run 没有 artifact：%s" % row.get("id"))
        else:
            try:
                path = safe_artifact_path(date_iso, artifact)
            except SystemExit as exc:
                errors.append(str(exc))
            else:
                if not path.exists():
                    errors.append("artifact 不存在：%s" % artifact)
        if row.get("lab") and row.get("lab") not in CORE_LABS:
            errors.append("未知 lab：%s" % row.get("lab"))
        if row.get("track") and row.get("track") not in LAB_TRACKS:
            errors.append("未知 track：%s" % row.get("track"))
    groups = {row.get("query_group") for row in runs}
    missing_groups = sorted(REQUIRED_GROUPS - groups)
    if missing_groups:
        errors.append("缺少查询组 trace：%s" % ", ".join(missing_groups))
    gate_runs = [row for row in runs if row.get("provider") == "gate-search-x"]
    browser_runs = [row for row in runs if row.get("provider") == "x-browser"]
    public_runs = [row for row in runs if row.get("provider") == "public-web-index"]
    gate_posts = {url for row in gate_runs for url in row.get("x_post_urls") or []}
    if require_complete and len(gate_runs) < 3:
        errors.append("Gate X 实际查询少于 3 次")
    if require_complete and len(gate_posts) < 4 and len(public_runs) + len(browser_runs) < 4:
        errors.append("Gate 无足够逐帖引用时，公开索引/浏览器降级查询少于 4 次")
    lab_pairs = {(row.get("lab"), row.get("track")) for row in runs}
    missing_pairs = sorted((lab, track) for lab in CORE_LABS for track in LAB_TRACKS if (lab, track) not in lab_pairs)
    if require_complete and missing_pairs:
        errors.append("缺少国内厂商逐轨 trace：%s" % ", ".join("%s/%s" % pair for pair in missing_pairs))
    if not runs:
        errors.append("trace 没有任何实际运行记录")
    print("[trace] runs=%d groups=%d/%d gate_queries=%d gate_posts=%d public_queries=%d browser_queries=%d" % (
        len(runs), len(groups & REQUIRED_GROUPS), len(REQUIRED_GROUPS), len(gate_runs), len(gate_posts),
        len(public_runs), len(browser_runs)
    ))
    for warning in warnings:
        print("[trace][warn]", warning)
    for error in errors:
        print("[trace][error]", error)
    if not errors:
        print("[trace] OK", trace_path(date_iso))
    return 1 if errors else 0


def cmd_finalize(args):
    date_iso = normalize_date(args.date)
    payload = load_trace(date_iso)
    payload["completed_at"] = now_iso()
    save_trace(date_iso, payload)
    return validate_trace(date_iso, require_complete=True)


def main():
    parser = argparse.ArgumentParser(description="Record auditable daily research source runs")
    sub = parser.add_subparsers(dest="command", required=True)

    init_parser = sub.add_parser("init")
    init_parser.add_argument("--date", default="today")
    init_parser.add_argument("--mode", choices=["scheduled", "interactive"], required=True)
    init_parser.set_defaults(func=cmd_init)

    record_parser = sub.add_parser("record")
    record_parser.add_argument("--date", default="today")
    record_parser.add_argument("--id", required=True)
    record_parser.add_argument("--provider", choices=sorted(PROVIDERS), required=True)
    record_parser.add_argument("--group", choices=sorted(REQUIRED_GROUPS), required=True)
    record_parser.add_argument("--query")
    record_parser.add_argument("--artifact", required=True)
    record_parser.add_argument("--status", choices=["success", "empty", "blocked", "error"], default="success")
    record_parser.add_argument("--executed-at")
    record_parser.add_argument("--lab", choices=sorted(CORE_LABS))
    record_parser.add_argument("--track", choices=sorted(LAB_TRACKS))
    record_parser.set_defaults(func=cmd_record)

    check_parser = sub.add_parser("check")
    check_parser.add_argument("--date", default="today")
    check_parser.add_argument("--complete", action="store_true")
    check_parser.set_defaults(func=lambda args: validate_trace(args.date, args.complete))

    finalize_parser = sub.add_parser("finalize")
    finalize_parser.add_argument("--date", default="today")
    finalize_parser.set_defaults(func=cmd_finalize)

    args = parser.parse_args()
    result = args.func(args)
    return int(result or 0)


if __name__ == "__main__":
    sys.exit(main())
