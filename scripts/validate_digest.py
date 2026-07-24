#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validate a generated digest.js and manifest.js using lightweight checks."""

import argparse
import collections
import datetime as dt
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

from common import (
    ROOT,
    digest_path_for,
    extract_latest_from_manifest,
    load_workbench_config,
    read_text,
    slash_date,
)


DEEP_TYPES = {"x_article", "official_research", "paper", "technical_report", "model_card", "long_blog"}
X_STATUS_RE = re.compile(r"^https?://(?:(?:www|mobile)\.)?x\.com/[^/?#]+/status/(\d{15,})(?:[/?#].*)?$", re.I)
X_ARTICLE_RE = re.compile(r"^https?://(?:www\.)?x\.com/(?:i/article/(\d{15,})|[^/?#]+/article/(\d{15,}))(?:[/?#].*)?$", re.I)
PLACEHOLDER_TERMS = (
    "保留监测入口",
    "保留公开 x",
    "监听入口",
    "已完成 x-first",
    "已纳入监测",
    "无近期逐帖",
    "无近帖可入选",
    "待补采",
    "provider 无近帖",
)
GENERIC_INDEX_PATHS = {
    ("www.anthropic.com", "/research"),
    ("anthropic.com", "/research"),
    ("www.anthropic.com", "/news"),
    ("anthropic.com", "/news"),
    ("openai.com", "/research"),
    ("openai.com", "/news/research"),
    ("openai.com", "/index"),
    ("deepmind.google", "/research"),
}
RESEARCH_DOMAINS = (
    "anthropic.com/research",
    "openai.com/research",
    "alignment.openai.com",
    "moonshotai.github.io",
    "huggingface.co/moonshotai",
    "huggingface.co/deepseek-ai",
    "github.com/deepseek-ai",
    "z.ai/blog",
    "github.com/zai-org",
    "huggingface.co/zai-org",
    "qwenlm.github.io",
    "docs.qwencloud.com",
    "huggingface.co/qwen",
    "github.com/qwenlm",
    "seed.bytedance.com",
    "github.com/tencent-hunyuan",
    "ernie.baidu.com/blog",
    "github.com/minimax-ai",
    "stepfun.com/research",
    "support.huaweicloud.com/productdesc-pangulm",
    "github.com/internlm",
    "github.com/meituan-longcat",
    "github.com/xiaomimimo",
    "github.com/inclusionai",
)
V3_REQUIRED_COVERAGE_GROUPS = {
    "community_hotspots",
    "access_and_quota",
    "chinese_frontier_models",
    "x_viewpoints",
}
V4_REQUIRED_COVERAGE_GROUPS = V3_REQUIRED_COVERAGE_GROUPS | {
    "domestic_lab_models",
    "domestic_lab_product_ops",
    "domestic_lab_research",
    "dynamic_kol_views",
}
WORKBENCH_CONFIG = load_workbench_config()
WORKBENCH_DISCOVERY = WORKBENCH_CONFIG.get("discovery") or {}
WORKBENCH_KOL = WORKBENCH_CONFIG.get("kol") or {}
V6_TREND_LANES = [
    row for row in WORKBENCH_DISCOVERY.get("lanes") or []
    if isinstance(row, dict) and row.get("enabled", True) and row.get("key")
]
V6_TREND_GROUPS = {str(row["key"]) for row in V6_TREND_LANES}
V6_REQUIRED_COVERAGE_GROUPS = V4_REQUIRED_COVERAGE_GROUPS | V6_TREND_GROUPS
CORE_DOMESTIC_LABS = {
    "qwen",
    "deepseek",
    "kimi",
    "zai",
    "bytedance_seed",
    "tencent_hunyuan",
    "baidu_ernie",
    "minimax",
}
LAB_ACTIVITY_TYPES = {"model_release", "product_ops", "research"}
KOL_DISCOVERY_MODES = {"watchlist", "topic_expansion"}
VIEWPOINT_ROLES = {"originator", "independent_evaluation", "counterpoint", "context"}
SCHEDULED_X_PROVIDER_TOKENS = (
    "public-web",
    "web-search",
    "public-index",
    "official-api",
)
WORKBENCH_QUALITY = WORKBENCH_CONFIG.get("quality") or {}
V5_MIN_TOTAL_ITEMS = int(WORKBENCH_QUALITY.get("min_total_items", 12))
V5_MIN_FRESH_72H = int(WORKBENCH_QUALITY.get("min_fresh_72h", 5))
V5_MIN_FRESH_7D_RATIO = float(WORKBENCH_QUALITY.get("min_fresh_7d_ratio", 0.65))
V5_MAX_BACKGROUND_RATIO = float(WORKBENCH_QUALITY.get("max_background_ratio", 0.20))
V5_MIN_DIMENSION_ITEMS = {
    "lab": 2,
    "kol": 4,
    "paper": 1,
    "oss": 2,
    "fin": 1,
}
V5_MIN_DIMENSION_ITEMS.update({
    key: int(value)
    for key, value in (WORKBENCH_QUALITY.get("dimension_minima") or {}).items()
    if key in V5_MIN_DIMENSION_ITEMS
})


def load_v5_trace(payload, coverage, errors):
    trace_ref = str(coverage.get("trace_path") or "").strip()
    if not trace_ref:
        errors.append("quality v5 缺少 coverage_report.trace_path")
        return None
    trace_file = Path(trace_ref)
    if not trace_file.is_absolute():
        trace_file = ROOT / trace_file
    expected = ROOT / ".daily-intel" / "runs" / str(payload.get("date")) / "research_trace.json"
    try:
        resolved = trace_file.resolve()
    except OSError:
        errors.append("research trace 路径无效：%s" % trace_ref)
        return None
    if resolved != expected.resolve():
        errors.append("research trace 必须使用当日固定路径：%s" % expected.relative_to(ROOT))
        return None
    if not resolved.exists():
        errors.append("research trace 不存在：%s" % trace_ref)
        return None
    try:
        trace = json.loads(read_text(resolved))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append("research trace 无法读取：%s" % exc)
        return None
    if trace.get("date") != payload.get("date"):
        errors.append("research trace 日期与 digest 不一致")
    if not trace.get("started_at") or not trace.get("completed_at"):
        errors.append("research trace 缺少开始或完成时间")
    return trace


def validate_v5_trace(payload, coverage, groups_by_key, required_groups, errors):
    trace = load_v5_trace(payload, coverage, errors)
    if not trace:
        return
    runs = [row for row in trace.get("runs", []) if isinstance(row, dict)]
    schema_version = int(trace.get("schema_version") or 1)
    runs_by_id = {str(row.get("id")): row for row in runs if row.get("id")}
    if len(runs_by_id) != len(runs):
        errors.append("research trace 存在缺失或重复 run id")

    for group_key in sorted(required_groups & set(groups_by_key)):
        group = groups_by_key[group_key]
        run_ids = [str(run_id) for run_id in group.get("run_ids") or [] if str(run_id)]
        if not run_ids:
            errors.append("查询组缺少可审计 run_ids：%s" % group_key)
            continue
        missing_ids = [run_id for run_id in run_ids if run_id not in runs_by_id]
        if missing_ids:
            errors.append("查询组引用不存在的 trace run：%s=%s" % (group_key, ",".join(missing_ids)))
            continue
        mismatched = [run_id for run_id in run_ids if runs_by_id[run_id].get("query_group") != group_key]
        if mismatched:
            errors.append("查询组引用了其他组的 trace run：%s=%s" % (group_key, ",".join(mismatched)))
        traced_queries = {str(runs_by_id[run_id].get("query") or "").strip() for run_id in run_ids}
        declared_queries = {str(query).strip() for query in group.get("queries") or [] if str(query).strip()}
        if not declared_queries.issubset(traced_queries):
            errors.append("查询组声明了未实际记录的 query：%s" % group_key)
        trace_candidates = sum(
            max(0, int(runs_by_id[run_id].get("result_count") or 0))
            for run_id in run_ids
        )
        candidate_count = group.get("candidate_count")
        if isinstance(candidate_count, int) and candidate_count > trace_candidates:
            errors.append("查询组候选数大于 trace 原始结果：%s=%d>%d" % (
                group_key, candidate_count, trace_candidates
            ))

    if int(payload.get("quality_version") or 0) >= 6:
        for lane in V6_TREND_LANES:
            key = str(lane["key"])
            lane_runs = [row for row in runs if row.get("query_group") == key]
            min_queries = max(1, int(lane.get("min_queries") or 1))
            min_candidates = max(0, int(lane.get("min_candidates") or 0))
            valid_candidates = sum(max(0, int(row.get("valid_candidate_count") or 0)) for row in lane_runs)
            domains = {
                str(domain).strip()
                for row in lane_runs
                for domain in row.get("candidate_domains") or []
                if str(domain).strip()
            }
            if len(lane_runs) < min_queries:
                errors.append("热点泳道 %s trace 查询少于 %d 次" % (key, min_queries))
            if valid_candidates < min_candidates:
                errors.append("热点泳道 %s 可归属候选少于 %d 条" % (key, min_candidates))
            if valid_candidates and len(domains) < 2:
                errors.append("热点泳道 %s 候选来源域名少于 2 个" % key)
        x_trend_runs = [
            row for row in runs
            if row.get("query_group") in V6_TREND_GROUPS
            and row.get("provider") in {"gate-search-x", "public-web-index", "x-browser"}
        ]
        if V6_TREND_GROUPS and len(x_trend_runs) < 3:
            errors.append("热点泳道中的 X 定向发现少于 3 次")

    gate_runs = [row for row in runs if row.get("provider") == "gate-search-x"]
    public_runs = [row for row in runs if row.get("provider") == "public-web-index"]
    browser_runs = [row for row in runs if row.get("provider") == "x-browser"]
    gate_posts = {url for row in gate_runs for url in row.get("x_post_urls") or [] if is_concrete_x_evidence(url)}
    public_posts = {url for row in public_runs for url in row.get("x_post_urls") or [] if is_concrete_x_evidence(url)}
    browser_posts = {url for row in browser_runs for url in row.get("x_post_urls") or [] if is_concrete_x_evidence(url)}
    public_fresh_posts = {
        url for row in public_runs for url in row.get("fresh_x_post_urls") or [] if is_concrete_x_evidence(url)
    }
    browser_fresh_posts = {
        url for row in browser_runs for url in row.get("fresh_x_post_urls") or [] if is_concrete_x_evidence(url)
    }
    pipeline = coverage.get("x_pipeline") or {}
    actual_counts = {
        "gate_queries": len(gate_runs),
        "gate_cited_posts": len(gate_posts),
        "public_index_queries": len(public_runs),
        "public_index_posts": len(public_posts),
        "browser_queries": len(browser_runs),
        "browser_verified_posts": len(browser_posts),
    }
    for field, actual in actual_counts.items():
        if pipeline.get(field) != actual:
            errors.append("x_pipeline.%s 与 trace 不一致：声明=%s 实际=%d" % (
                field, pipeline.get(field), actual
            ))
    if len(gate_runs) < 3:
        errors.append("Gate X 实际查询少于 3 次")
    if len(gate_posts) < 4 and len(public_runs) + len(browser_runs) < 4:
        errors.append("Gate 无足够逐帖引用时，公开索引/浏览器降级查询少于 4 次")
    if schema_version >= 2:
        for row in runs:
            window_days = row.get("window_days")
            if not isinstance(window_days, int) or not 1 <= window_days <= 30:
                errors.append("trace run 缺少有效 window_days：%s" % row.get("id"))
        for row in public_runs + browser_runs:
            evidence_by_url = {
                evidence.get("url"): evidence
                for evidence in row.get("x_post_evidence") or []
                if isinstance(evidence, dict) and evidence.get("url")
            }
            for url in row.get("x_post_urls") or []:
                evidence = evidence_by_url.get(url) or {}
                if (
                    not str(evidence.get("author") or "").strip()
                    or not str(evidence.get("published_at") or "").strip()
                    or len(str(evidence.get("excerpt") or "").strip()) < 20
                ):
                    errors.append("trace X 证据缺少作者/日期/正文摘录：%s" % row.get("id"))
        blocked_browser = any(row.get("status") == "blocked" for row in browser_runs)
        if len(gate_posts) < 4 and len(public_fresh_posts) < 6 and not blocked_browser and len(browser_runs) < 4:
            errors.append("Gate/公开索引近 7 天 X 证据不足时，浏览器降级查询少于 4 次")
    for row in public_runs:
        query = str(row.get("query") or "").lower()
        if "since:" in query or "filter:" in query:
            errors.append("公开网页搜索误用了 X 站内操作符：%s" % row.get("id"))

    lab_pairs = {(row.get("lab"), row.get("track")) for row in runs}
    missing_pairs = sorted(
        (lab, track)
        for lab in CORE_DOMESTIC_LABS
        for track in LAB_ACTIVITY_TYPES
        if (lab, track) not in lab_pairs
    )
    if missing_pairs:
        errors.append("缺少国内厂商逐轨 trace：%s" % ", ".join("%s/%s" % pair for pair in missing_pairs))

    print("[validate] trace_runs=%d gate_queries=%d gate_posts=%d public_queries=%d public_fresh_posts=%d browser_queries=%d browser_fresh_posts=%d" % (
        len(runs), len(gate_runs), len(gate_posts), len(public_runs), len(public_fresh_posts),
        len(browser_runs), len(browser_fresh_posts)
    ))
    return trace


def item_x_urls(item):
    urls = [item.get("url", "")]
    urls.extend(item.get("x_src") or [])
    evidence = item.get("evidence") or {}
    urls.append(evidence.get("verified_url", ""))
    return [str(url).strip() for url in urls if str(url).strip()]


def item_x_handle(item):
    for url in item_x_urls(item):
        match = re.match(r"^https?://(?:www\.|mobile\.)?x\.com/([^/?#]+)/", url, re.I)
        if match:
            return ("@" + match.group(1)).lower()
    return ""


def is_concrete_x_evidence(url):
    if not (X_STATUS_RE.match(url) or X_ARTICLE_RE.match(url)):
        return False
    match = re.search(r"/(?:status|article)/(\d+)(?:[/?#].*)?$", str(url), re.I)
    if not match:
        return False
    value = match.group(1)
    if len(value) < 15 or len(set(value)) == 1:
        return False
    ascending = "".join(str(index % 10) for index in range(len(value)))
    descending = "".join(str(9 - (index % 10)) for index in range(len(value)))
    return value not in {ascending, descending}


def is_x_discovery_only(url):
    parsed = urlparse(url)
    host = parsed.netloc.lower().removeprefix("www.").removeprefix("mobile.")
    if host != "x.com":
        return False
    return not is_concrete_x_evidence(url)


def is_generic_index_url(url):
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    path = parsed.path.rstrip("/") or "/"
    if (host, path) in GENERIC_INDEX_PATHS:
        return True
    if host.endswith("x.com") and is_x_discovery_only(url):
        return True
    if host == "github.com" and path.startswith("/topics/"):
        return True
    if host == "huggingface.co" and path == "/papers" and parsed.query:
        return True
    return False


def normalize_title(title):
    title = re.sub(r"^@[^：:]+[：:]", "", str(title or ""))
    return re.sub(r"[^0-9a-z\u4e00-\u9fff]+", "", title.lower())


def parse_item_age(digest_date, item_date):
    try:
        current = dt.date.fromisoformat(digest_date)
        published = dt.date.fromisoformat(str(item_date))
    except (TypeError, ValueError):
        return None
    return (current - published).days


def load_recent_payloads(current_date, days=7):
    current = dt.date.fromisoformat(current_date)
    recent = []
    for path in sorted((ROOT / "data").glob("*/*/*/digest.js")):
        payload = load_strict_payload(read_text(path))
        if not payload or not payload.get("date"):
            continue
        try:
            payload_date = dt.date.fromisoformat(str(payload["date"]))
        except ValueError:
            continue
        age = (current - payload_date).days
        if 1 <= age <= days:
            recent.append(payload)
    return recent


def active_industry_anchors():
    path = ROOT / "config" / "industry.yaml"
    if not path.exists():
        return []
    txt = read_text(path)
    m = re.search(r'(?m)^anchors:\n((?:\s*-\s*[\w-]+\s*\n)+)', txt)
    if not m:
        return []
    return re.findall(r'-\s*([\w-]+)', m.group(1))


def load_strict_payload(raw):
    m = re.search(r'window\.__DAILY__\[[^\]]+\]\s*=\s*(\{.*\})\s*;?\s*$', raw, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


def prop(name):
    return r'(?:"%s"|%s)\s*:\s*' % (re.escape(name), re.escape(name))


def validate_digest(date_value):
    if date_value == "latest":
        latest = extract_latest_from_manifest()
        if not latest:
            raise SystemExit("[validate] manifest.js 未找到 latest")
        date_value = latest
    key = slash_date(date_value)
    path = digest_path_for(key)
    if not path.exists():
        raise SystemExit("[validate] 未找到 digest: %s" % path)

    raw = read_text(path)
    errors = []
    warnings = []

    if 'window.__DAILY__' not in raw:
        errors.append("缺少 window.__DAILY__ 赋值")
    if key not in raw:
        errors.append("digest 中未包含日期 key %s" % key)
    if not re.search(r'\bdate\s*:\s*"%s"' % re.escape(key.replace("/", "-")), raw) and key.replace("/", "-") not in raw:
        warnings.append("未显式找到 date=%s" % key.replace("/", "-"))

    payload = load_strict_payload(raw)
    if payload:
        item_ids = [item.get("id", "") for item in payload.get("items", [])]
        dims = [dim.get("key", "") for dim in payload.get("dimensions", [])]
        hot_topics = [topic.get("title", "") for topic in payload.get("hot_topics_today", [])]
        urls = [item.get("url", "") for item in payload.get("items", []) if item.get("url")]
    else:
        item_ids = re.findall(prop("id") + r'"([^"]+)"', raw)
        dims = re.findall(prop("key") + r'"([^"]+)"', raw)
        hot_topics = re.findall(prop("title") + r'"([^"]+)"[^{}\n]*' + prop("heat"), raw)
        urls = re.findall(prop("url") + r'"([^"]+)"', raw)

    if len(item_ids) < 1:
        errors.append("items 里未识别到 id")
    if len(dims) < 1:
        errors.append("dimensions 里未识别到 key")
    if len(urls) < max(1, len(item_ids) // 2):
        warnings.append("URL 数量偏少：%d urls / %d items" % (len(urls), len(item_ids)))
    if payload:
        items = payload.get("items", [])
        try:
            quality_version = int(payload.get("quality_version") or 0)
        except (TypeError, ValueError):
            quality_version = 0
        strict_quality = quality_version >= 2
        coverage_quality = quality_version >= 3
        expanded_quality = quality_version >= 4
        trace_quality = quality_version >= 5
        trend_quality = quality_version >= 6
        trace = None

        def quality_issue(message, hard=True):
            if strict_quality and hard:
                errors.append(message)
            else:
                warnings.append(message)

        if not strict_quality:
            warnings.append("legacy digest：缺少 quality_version=2；新鲜度、X 实帖和跨天去重仅报告，不阻断")

        if coverage_quality:
            coverage = payload.get("coverage_report") or {}
            if trend_quality:
                required_coverage_groups = V6_REQUIRED_COVERAGE_GROUPS
            else:
                required_coverage_groups = V4_REQUIRED_COVERAGE_GROUPS if expanded_quality else V3_REQUIRED_COVERAGE_GROUPS
            raw_groups = coverage.get("query_groups") or []
            if isinstance(raw_groups, dict):
                groups = []
                for group_key, group_value in raw_groups.items():
                    row = dict(group_value or {})
                    row.setdefault("key", group_key)
                    groups.append(row)
            else:
                groups = [row for row in raw_groups if isinstance(row, dict)]
            groups_by_key = {row.get("key"): row for row in groups if row.get("key")}
            missing_groups = sorted(required_coverage_groups - set(groups_by_key))
            if missing_groups:
                errors.append("coverage_report 缺少必扫查询组：%s" % ", ".join(missing_groups))
            for group_key in sorted(required_coverage_groups & set(groups_by_key)):
                group = groups_by_key[group_key]
                queries = [str(query).strip() for query in group.get("queries") or [] if str(query).strip()]
                if group.get("status") != "completed":
                    errors.append("coverage_report 查询组未完成：%s" % group_key)
                if not queries:
                    errors.append("coverage_report 查询组没有实际查询：%s" % group_key)
                candidate_count = group.get("candidate_count")
                if not isinstance(candidate_count, int) or candidate_count < 0:
                    errors.append("coverage_report candidate_count 无效：%s" % group_key)
                    continue
                selected_ids = [str(item_id) for item_id in group.get("selected_ids") or [] if str(item_id)]
                rejection_reasons = [str(reason) for reason in group.get("rejection_reasons") or [] if str(reason).strip()]
                if candidate_count > 0 and not selected_ids and not rejection_reasons:
                    errors.append("coverage_report 有候选但没有入选或淘汰记录：%s" % group_key)
                unknown_ids = [item_id for item_id in selected_ids if item_id not in item_ids]
                if unknown_ids:
                    errors.append("coverage_report 引用了不存在的条目：%s=%s" % (group_key, ",".join(unknown_ids)))

            pipeline = coverage.get("x_pipeline") or {}
            required_pipeline_counts = (
                "gate_queries",
                "gate_cited_posts",
                "public_index_queries",
                "public_index_posts",
                "browser_queries",
                "browser_verified_posts",
            )
            for field in required_pipeline_counts:
                value = pipeline.get(field)
                if not isinstance(value, int) or value < 0:
                    errors.append("coverage_report.x_pipeline 缺少有效计数：%s" % field)
            print("[validate] coverage_groups=%d/%d" % (
                len(required_coverage_groups & set(groups_by_key)), len(required_coverage_groups)
            ))

            if expanded_quality:
                lab_pipeline = coverage.get("lab_pipeline") or {}
                checked_labs = {
                    str(lab).strip().lower()
                    for lab in lab_pipeline.get("core_labs_checked") or []
                    if str(lab).strip()
                }
                missing_labs = sorted(CORE_DOMESTIC_LABS - checked_labs)
                if missing_labs:
                    errors.append("coverage_report.lab_pipeline 缺少国内核心厂商：%s" % ", ".join(missing_labs))

                raw_tracks = lab_pipeline.get("activity_tracks") or []
                if isinstance(raw_tracks, dict):
                    tracks = []
                    for track_key, track_value in raw_tracks.items():
                        row = dict(track_value or {})
                        row.setdefault("key", track_key)
                        tracks.append(row)
                else:
                    tracks = [row for row in raw_tracks if isinstance(row, dict)]
                tracks_by_key = {row.get("key"): row for row in tracks if row.get("key")}
                missing_tracks = sorted(LAB_ACTIVITY_TYPES - set(tracks_by_key))
                if missing_tracks:
                    errors.append("coverage_report.lab_pipeline 缺少活动轨道：%s" % ", ".join(missing_tracks))
                for track_key in sorted(LAB_ACTIVITY_TYPES & set(tracks_by_key)):
                    track = tracks_by_key[track_key]
                    queries = [str(query).strip() for query in track.get("queries") or [] if str(query).strip()]
                    candidate_count = track.get("candidate_count")
                    selected_ids = [str(item_id) for item_id in track.get("selected_ids") or [] if str(item_id)]
                    rejection_reasons = [str(reason) for reason in track.get("rejection_reasons") or [] if str(reason).strip()]
                    if track.get("status") != "completed":
                        errors.append("国内大厂活动轨道未完成：%s" % track_key)
                    if not queries:
                        errors.append("国内大厂活动轨道没有实际查询：%s" % track_key)
                    if not isinstance(candidate_count, int) or candidate_count < 0:
                        errors.append("国内大厂活动轨道 candidate_count 无效：%s" % track_key)
                    elif candidate_count > 0 and not selected_ids and not rejection_reasons:
                        errors.append("国内大厂活动轨道有候选但无入选/淘汰记录：%s" % track_key)
                    unknown_ids = [item_id for item_id in selected_ids if item_id not in item_ids]
                    if unknown_ids:
                        errors.append("国内大厂活动轨道引用了不存在的条目：%s=%s" % (track_key, ",".join(unknown_ids)))

                viewpoint_pipeline = coverage.get("viewpoint_pipeline") or {}
                dynamic_candidates = viewpoint_pipeline.get("dynamic_candidates")
                dynamic_selected_ids = [
                    str(item_id) for item_id in viewpoint_pipeline.get("dynamic_selected_ids") or [] if str(item_id)
                ]
                if not isinstance(dynamic_candidates, int) or dynamic_candidates < 6:
                    errors.append("coverage_report.viewpoint_pipeline 动态候选少于 6 条")
                if len(dynamic_selected_ids) < 2:
                    errors.append("coverage_report.viewpoint_pipeline 动态入选少于 2 条")
                unknown_ids = [item_id for item_id in dynamic_selected_ids if item_id not in item_ids]
                if unknown_ids:
                    errors.append("动态 KOL 管道引用了不存在的条目：%s" % ",".join(unknown_ids))
                topic_roles = [row for row in viewpoint_pipeline.get("topic_roles") or [] if isinstance(row, dict)]
                complete_topics = 0
                counterpoint_topics = 0
                for row in topic_roles:
                    roles = row.get("roles") or {}
                    originators = [str(item_id) for item_id in roles.get("originator") or [] if str(item_id)]
                    independent = [str(item_id) for item_id in roles.get("independent_evaluation") or [] if str(item_id)]
                    counterpoints = [str(item_id) for item_id in roles.get("counterpoint") or [] if str(item_id)]
                    if originators and independent:
                        complete_topics += 1
                    if counterpoints:
                        counterpoint_topics += 1
                    referenced = originators + independent + counterpoints
                    unknown = [item_id for item_id in referenced if item_id not in item_ids]
                    if unknown:
                        errors.append("观点角色管道引用了不存在的条目：%s" % ",".join(unknown))
                if complete_topics < 2:
                    errors.append("至少 2 个重点话题需同时有首发者与独立评估")
                if counterpoint_topics < 1:
                    errors.append("至少 1 个重点话题需要反方/边界观点")

            if trace_quality:
                trace = validate_v5_trace(payload, coverage, groups_by_key, required_coverage_groups, errors)

        if trace_quality:
            dimension_counts = collections.Counter(str(item.get("dim") or "") for item in items)
            if len(items) < V5_MIN_TOTAL_ITEMS:
                errors.append("quality v5 总条目少于 %d 条：%d" % (V5_MIN_TOTAL_ITEMS, len(items)))
            for dim_key, minimum in V5_MIN_DIMENSION_ITEMS.items():
                if dimension_counts.get(dim_key, 0) < minimum:
                    errors.append("quality v5 维度 %s 少于 %d 条：%d" % (
                        dim_key, minimum, dimension_counts.get(dim_key, 0)
                    ))

        ages = []
        invalid_date_items = []
        for item in items:
            age = parse_item_age(str(payload.get("date", "")), item.get("date"))
            ages.append(age)
            if age is None:
                invalid_date_items.append(item.get("id", "(no-id)"))
            elif age < 0:
                quality_issue("条目日期晚于 digest 日期：%s" % item.get("id", "(no-id)"))
        for item_id in invalid_date_items[:5]:
            quality_issue("条目日期无效：%s" % item_id)

        valid_ages = [age for age in ages if age is not None and age >= 0]
        fresh_72h = sum(age <= 3 for age in valid_ages)
        fresh_7d = sum(age <= 7 for age in valid_ages)
        older_7d = sum(age > 7 for age in valid_ages)
        older_30d = sum(age > 30 for age in valid_ages)
        fresh_ratio = (fresh_7d / float(len(valid_ages))) if valid_ages else 0.0
        background_ratio = (older_7d / float(len(valid_ages))) if valid_ages else 1.0
        max_age = max(valid_ages) if valid_ages else -1
        print("[validate] freshness_72h=%d freshness_7d=%d/%d (%.0f%%) older_7d=%d older_30d=%d max_age=%d" % (
            fresh_72h, fresh_7d, len(valid_ages), fresh_ratio * 100, older_7d, older_30d, max_age
        ))
        if items and fresh_72h < V5_MIN_FRESH_72H:
            quality_issue("72 小时内条目不足：%d；质量门槛为至少 %d 条" % (fresh_72h, V5_MIN_FRESH_72H))
        if items and fresh_ratio < V5_MIN_FRESH_7D_RATIO:
            quality_issue("近 7 天条目占比不足：%.0f%%；质量门槛为至少 %.0f%%" % (
                fresh_ratio * 100, V5_MIN_FRESH_7D_RATIO * 100
            ))
        if items and background_ratio > V5_MAX_BACKGROUND_RATIO:
            quality_issue("7 天外背景条目过多：%.0f%%；质量门槛为最多 %.0f%%" % (
                background_ratio * 100, V5_MAX_BACKGROUND_RATIO * 100
            ))
        if older_30d:
            quality_issue("存在 %d 条超过 30 天的独立条目；旧资料只能进入新话题的背景说明" % older_30d)
        if trace_quality and trace and int(trace.get("schema_version") or 1) >= 2:
            freshness_failed = (
                fresh_72h < V5_MIN_FRESH_72H
                or fresh_ratio < V5_MIN_FRESH_7D_RATIO
            )
            if freshness_failed:
                freshness_pipeline = (payload.get("coverage_report") or {}).get("freshness_pipeline") or {}
                recovery_ids = [
                    str(run_id) for run_id in freshness_pipeline.get("recovery_run_ids") or [] if str(run_id)
                ]
                trace_runs = {
                    str(row.get("id")): row for row in trace.get("runs", [])
                    if isinstance(row, dict) and row.get("id")
                }
                valid_recovery = [
                    trace_runs[run_id] for run_id in recovery_ids
                    if run_id in trace_runs and isinstance(trace_runs[run_id].get("window_days"), int)
                    and trace_runs[run_id]["window_days"] <= 7
                ]
                recovery_72h = [row for row in valid_recovery if row.get("window_days") <= 3]
                if freshness_pipeline.get("recovery_triggered") is not True:
                    errors.append("新鲜度不足但 freshness recovery 未触发")
                if len(valid_recovery) < 6:
                    errors.append("新鲜度不足时，原生近 7 天恢复查询少于 6 次")
                if len(recovery_72h) < 2:
                    errors.append("新鲜度不足时，原生近 72 小时恢复查询少于 2 次")

        for item, age in zip(items, ages):
            if age is not None and age > 7:
                if item.get("recency_role") != "background" or len(str(item.get("why_now") or "")) < 30:
                    quality_issue("旧来源缺少 background/why_now：%s（%d 天）" % (item.get("id", "(no-id)"), age))
            if strict_quality and not item.get("topic_cluster"):
                errors.append("缺少 topic_cluster：%s" % item.get("id", "(no-id)"))

        placeholder_items = []
        generic_items = []
        current_url_first = {}
        current_duplicate_urls = []
        for item in items:
            blob = " ".join(str(item.get(k, "")) for k in ("title", "summary", "detail")).lower()
            if any(term.lower() in blob for term in PLACEHOLDER_TERMS):
                placeholder_items.append(item.get("id", "(no-id)"))
            url = str(item.get("url") or "").strip()
            if url and is_generic_index_url(url):
                generic_items.append(item.get("id", "(no-id)"))
            if url in current_url_first:
                current_duplicate_urls.append((item.get("id", "(no-id)"), current_url_first[url]))
            elif url:
                current_url_first[url] = item.get("id", "(no-id)")
        if placeholder_items:
            quality_issue("监测/无结果占位条目不得进入 digest：%s" % ", ".join(placeholder_items[:8]))
        if generic_items:
            quality_issue("条目使用 profile/索引/主题页而非具体来源深链：%s" % ", ".join(generic_items[:8]))
        if current_duplicate_urls:
            quality_issue("同一期存在重复 URL：%s" % ", ".join("%s=%s" % pair for pair in current_duplicate_urls[:8]))

        prior_payloads = load_recent_payloads(str(payload.get("date")), days=7)
        prior_urls = {}
        prior_titles = {}
        for prior in prior_payloads:
            for prior_item in prior.get("items", []):
                if prior_item.get("url"):
                    prior_urls.setdefault(str(prior_item["url"]), str(prior.get("date")))
                title_key = normalize_title(prior_item.get("title"))
                if title_key:
                    prior_titles.setdefault(title_key, str(prior.get("date")))
        repeated = []
        for item in items:
            repeat_ok = item.get("repeat_update") is True and len(str(item.get("new_evidence") or "")) >= 20
            url = str(item.get("url") or "")
            title_key = normalize_title(item.get("title"))
            prior_date = prior_urls.get(url) or prior_titles.get(title_key)
            if prior_date and not repeat_ok:
                repeated.append("%s←%s" % (item.get("id", "(no-id)"), prior_date))
        print("[validate] repeated_from_previous_7d=%d" % len(repeated))
        if repeated:
            quality_issue("近 7 期重复内容未声明实质更新：%s" % ", ".join(repeated[:8]))

        kol_items = [item for item in items if item.get("dim") == "kol"]
        lab_items = [item for item in items if item.get("dim") == "lab"]
        verified_x_kol = [item for item in kol_items if any(is_concrete_x_evidence(url) for url in item_x_urls(item))]
        discovery_only_kol = [item for item in kol_items if any(is_x_discovery_only(url) for url in item_x_urls(item)) and item not in verified_x_kol]
        x_ratio = len(verified_x_kol) / float(len(kol_items)) if kol_items else 0.0
        print("[validate] kol_verified_x_posts=%d/%d (%.0f%%) profile_or_replies=%d" % (
            len(verified_x_kol), len(kol_items), x_ratio * 100, len(discovery_only_kol)
        ))
        if len(kol_items) < 4:
            quality_issue("KOL 观点不足：%d；质量门槛为至少 4 条真实观点" % len(kol_items))
        if x_ratio < 0.60:
            quality_issue("KOL 具体 X status/article 占比不足：%d/%d；profile/with_replies 不计证据" % (len(verified_x_kol), len(kol_items)))
        if discovery_only_kol:
            quality_issue("KOL 条目只有 profile/with_replies 等导航页：%s" % ", ".join(item.get("id", "(no-id)") for item in discovery_only_kol))

        if expanded_quality:
            for item in lab_items:
                if item.get("lab_activity_type") not in LAB_ACTIVITY_TYPES:
                    errors.append("AI 大厂条目缺少有效 lab_activity_type：%s" % item.get("id", "(no-id)"))
            topic_expansion_items = []
            role_counts = {role: 0 for role in VIEWPOINT_ROLES}
            for item in kol_items:
                discovery_mode = item.get("discovery_mode")
                viewpoint_role = item.get("viewpoint_role")
                if discovery_mode not in KOL_DISCOVERY_MODES:
                    errors.append("KOL 条目缺少有效 discovery_mode：%s" % item.get("id", "(no-id)"))
                if viewpoint_role not in VIEWPOINT_ROLES:
                    errors.append("KOL 条目缺少有效 viewpoint_role：%s" % item.get("id", "(no-id)"))
                else:
                    role_counts[viewpoint_role] += 1
                if discovery_mode == "topic_expansion":
                    topic_expansion_items.append(item)
            if len(topic_expansion_items) < 2:
                errors.append("按话题反向发现的 KOL 入选少于 2 条")
            if role_counts["independent_evaluation"] < 1:
                errors.append("KOL 观点缺少独立评估")
            if role_counts["counterpoint"] < 1:
                errors.append("KOL 观点缺少反方/边界观点")

        if trend_quality:
            trend_items = [
                item for item in items
                if item.get("topic_origin") == "trend_discovery"
                and item.get("trend_lane") in V6_TREND_GROUPS
            ]
            min_trend_items = int(WORKBENCH_DISCOVERY.get("min_trend_items") or 3)
            selected_lanes = {item.get("trend_lane") for item in trend_items}
            min_lanes = int(WORKBENCH_DISCOVERY.get("min_distinct_lanes_selected") or 2)
            if len(trend_items) < min_trend_items:
                errors.append("趋势发现入选少于 %d 条：%d" % (min_trend_items, len(trend_items)))
            if len(selected_lanes) < min_lanes:
                errors.append("趋势发现入选覆盖泳道少于 %d 条：%d" % (min_lanes, len(selected_lanes)))
            watchlist_handles = {
                str(row.get("handle") or "").strip().lower()
                for row in WORKBENCH_KOL.get("authors") or []
                if isinstance(row, dict) and row.get("enabled", True) and str(row.get("handle") or "").startswith("@")
            }
            off_watchlist_kol = [
                item for item in kol_items
                if item.get("discovery_mode") == "topic_expansion"
                and item_x_handle(item)
                and item_x_handle(item) not in watchlist_handles
            ]
            min_off_watchlist = int(WORKBENCH_DISCOVERY.get("min_off_watchlist_kol") or 2)
            if len(off_watchlist_kol) < min_off_watchlist:
                errors.append("名单外 KOL 观点少于 %d 条：%d" % (min_off_watchlist, len(off_watchlist_kol)))
            trend_pipeline = (payload.get("coverage_report") or {}).get("trend_pipeline") or {}
            lane_rows = [
                row for row in trend_pipeline.get("lanes") or []
                if isinstance(row, dict) and row.get("key")
            ]
            lane_keys = {str(row.get("key")) for row in lane_rows}
            missing_lane_rows = sorted(V6_TREND_GROUPS - lane_keys)
            if missing_lane_rows:
                errors.append("trend_pipeline 缺少热点泳道：%s" % ", ".join(missing_lane_rows))
            declared_dynamic = {
                str(item_id) for item_id in trend_pipeline.get("trend_selected_ids") or [] if str(item_id)
            }
            actual_dynamic = {str(item.get("id")) for item in trend_items if item.get("id")}
            if declared_dynamic != actual_dynamic:
                errors.append("trend_pipeline.trend_selected_ids 与实际趋势条目不一致")

        for item in kol_items:
            concrete = [url for url in item_x_urls(item) if is_concrete_x_evidence(url)]
            content_type = item.get("content_type")
            if content_type in {"x_status", "x_article"} and not concrete:
                quality_issue("%s 标为 %s 但没有具体数字 id 的 X status/article" % (item.get("id", "(no-id)"), content_type))
            if strict_quality and concrete:
                evidence = item.get("evidence") or {}
                provider = str(evidence.get("provider") or "").lower()
                browser_verified = any(token in provider for token in ("browser", "chrome"))
                scheduled_verified = any(token in provider for token in SCHEDULED_X_PROVIDER_TOKENS)
                if coverage_quality:
                    if not (browser_verified or scheduled_verified):
                        errors.append("X 条目 provider 不是浏览器、公开索引或官方 API：%s" % item.get("id", "(no-id)"))
                    verification_level = str(evidence.get("verification_level") or "")
                    if browser_verified and verification_level != "direct_page":
                        errors.append("浏览器 X 条目必须标记 verification_level=direct_page：%s" % item.get("id", "(no-id)"))
                    if scheduled_verified and verification_level not in {"public_index", "direct_page", "official_api"}:
                        errors.append("公开 X 条目 verification_level 无效：%s" % item.get("id", "(no-id)"))
                    if len(str(evidence.get("excerpt") or "").strip()) < 20:
                        errors.append("X 条目缺少可归属作者的正文摘录：%s" % item.get("id", "(no-id)"))
                elif not browser_verified:
                    errors.append("X 条目缺少浏览器核验 provider：%s" % item.get("id", "(no-id)"))
                if not is_concrete_x_evidence(str(evidence.get("verified_url") or "")):
                    errors.append("X 条目 evidence.verified_url 无效：%s" % item.get("id", "(no-id)"))
                if evidence.get("direct") is not True or not evidence.get("verified_at") or not evidence.get("published_at"):
                    errors.append("X 条目缺少 direct/verified_at/published_at：%s" % item.get("id", "(no-id)"))

        item_by_id = {item.get("id"): item for item in items if item.get("id")}
        for topic in payload.get("hot_topics_today", []):
            related_items = [item_by_id[item_id] for item_id in topic.get("related", []) if item_id in item_by_id]
            source_urls = {item.get("url") for item in related_items if item.get("url")}
            related_ages = [parse_item_age(str(payload.get("date")), item.get("date")) for item in related_items]
            if strict_quality and len(source_urls) < 2:
                errors.append("热点缺少两条独立来源：%s" % topic.get("title", "(no-title)"))
            if strict_quality and not any(age is not None and 0 <= age <= 7 for age in related_ages):
                errors.append("热点没有近 7 天证据：%s" % topic.get("title", "(no-title)"))
            if trend_quality:
                if topic.get("trend_lane") not in V6_TREND_GROUPS:
                    errors.append("热点缺少有效 trend_lane：%s" % topic.get("title", "(no-title)"))
                if len(str(topic.get("why_now") or "").strip()) < 20:
                    errors.append("热点缺少具体 why_now：%s" % topic.get("title", "(no-title)"))
                if len(str(topic.get("debate") or "").strip()) < 20:
                    errors.append("热点缺少讨论分歧/边界：%s" % topic.get("title", "(no-title)"))

        deep_items = [
            item for item in items
            if item.get("depth") == "deep" or item.get("content_type") in DEEP_TYPES
        ]
        short_deep = [item for item in deep_items if len(str(item.get("detail") or "")) < 650]
        if deep_items:
            print("[validate] deep_items=%d short_detail=%d" % (len(deep_items), len(short_deep)))
        for item in short_deep[:5]:
            warnings.append("深度/长文条目 detail 偏短：%s；目标至少 650 个中文字符" % item.get("id", "(no-id)"))

        radar_hits = [
            item for item in items
            if item.get("content_type") in DEEP_TYPES
            or any(
                domain in (item.get("url", "") + " " + " ".join(item.get("x_src") or [])).lower()
                for domain in RESEARCH_DOMAINS
            )
        ]
        print("[validate] research_radar_hits=%d" % len(radar_hits))
        if not radar_hits:
            warnings.append("未发现研究雷达命中项：请确认已扫描 config/research_radar.yaml（研究员长文/官方研究页/国产模型论文）")

        anchors = active_industry_anchors()
        if "ai-finance" in anchors or "ai-crypto" in anchors:
            finance_oss = []
            for item in items:
                if item.get("dim") != "oss":
                    continue
                blob = " ".join(str(item.get(k, "")) for k in ("title", "summary", "detail", "why", "buzz")).lower()
                blob += " " + " ".join(str(x).lower() for x in item.get("tags") or [])
                if any(term in blob for term in ("trading", "quant", "financial", "finance", "stock", "backtest", "broker", "exchange", "量化", "投研", "交易", "回测")):
                    finance_oss.append(item)
            print("[validate] finance_quant_oss=%d" % len(finance_oss))
            if len(finance_oss) < 2:
                warnings.append("当前锚定 AI+金融/加密，但开源项目中金融/量化 Agent 少于 2 条；请补充 X/GitHub 热议项目")

    manifest = read_text(ROOT / "data" / "manifest.js")
    if 'latest: "%s"' % key not in manifest and '"%s"' % key not in manifest:
        warnings.append("manifest.js 未显式标记 latest=%s" % key)
    if path.name != "digest.js":
        warnings.append("digest 文件名异常")

    print("[validate] date=%s items=%d dimensions=%d hot_topics~=%d urls=%d" % (
        key, len(item_ids), len(set(dims)), len(hot_topics), len(urls)
    ))
    for w in warnings:
        print("[validate][warn]", w)
    if errors:
        for e in errors:
            print("[validate][error]", e)
        return 1
    print("[validate] OK", path)
    return 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", default="latest", help="YYYY-MM-DD, YYYY/MM/DD, today, or latest")
    args = parser.parse_args()
    sys.exit(validate_digest(args.date))


if __name__ == "__main__":
    main()
