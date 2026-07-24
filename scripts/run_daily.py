#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Daily Intelligence Workbench runner.

This script is intentionally deterministic. It can validate an existing digest,
write a digest from canonical JSON, copy bundled sample data for smoke tests,
or create an agent handoff prompt for Claude Code / Codex to complete research.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

from common import (
    ROOT,
    date_label,
    digest_path_for,
    js_string,
    load_json,
    load_workbench_config,
    normalize_date,
    read_text,
    runtime_config,
    slash_date,
    write_text,
)


DEFAULT_DIMENSIONS = [
    {"key": "lab", "cn": "AI 大厂动态"},
    {"key": "kol", "cn": "KOL 观点"},
    {"key": "paper", "cn": "前沿论文"},
    {"key": "oss", "cn": "开源项目"},
    {"key": "fin", "cn": "AI × 金融"},
]
LANGUAGE_INSTRUCTIONS = {
    "zh": "最终 digest 的标题、摘要、详细解释、热点、维度概览与 practice_list 使用简体中文；技术术语、公司名、项目名、URL 保留原文。",
    "en": "Write the final digest titles, summaries, details, hot topics, dimension overviews, and practice_list in English. Keep source names, project names, tickers, and URLs unchanged.",
    "bilingual": "Write the final digest in bilingual form: prioritize Simplified Chinese, and include concise English equivalents for titles and key summaries where useful. Keep source names, project names, tickers, and URLs unchanged.",
}


def js_value(obj, indent=2):
    return json.dumps(obj, ensure_ascii=False, indent=indent)


def load_config_kol_list():
    path = ROOT / "config" / "kol.yaml"
    if not path.exists():
        return []
    items = []
    for line in read_text(path).splitlines():
        line = line.strip()
        if not line.startswith("- {") or "handle:" not in line:
            continue
        row = {}
        for key, quoted, bare in re.findall(r'(\w+):\s*(?:"([^"]*)"|([^,}]+))', line):
            row[key] = (quoted or bare).strip()
        if row.get("handle") and row.get("name"):
            items.append({
                "handle": row.get("handle", ""),
                "name": row.get("name", ""),
                "field": row.get("field", ""),
                "platform": row.get("platform", ""),
                "status": row.get("status", ""),
            })
    return items


def apply_persistent_config(payload):
    config_kol = load_config_kol_list()
    if config_kol and len(payload.get("kol_list") or []) < len(config_kol):
        payload["kol_list"] = config_kol
    return payload


def write_digest_from_json(date_value, json_path, language_override=None, publish_manifest=True):
    date_iso = normalize_date(date_value)
    key = slash_date(date_iso)
    cfg = runtime_config()
    language = (language_override or cfg.get("output_language") or "zh").strip()
    if language not in LANGUAGE_INSTRUCTIONS:
        language = "zh"
    payload = load_json(json_path)
    payload.setdefault("date", date_iso)
    payload.setdefault("language", language)
    payload.setdefault("date_cn", date_label(date_iso))
    payload.setdefault("generated_at", date_iso)
    payload.setdefault("refresh_note", "由 Daily Intelligence Workbench 生成。")
    payload.setdefault("dimensions", DEFAULT_DIMENSIONS)
    payload.setdefault("hot_topics_today", [])
    payload.setdefault("items", [])
    payload.setdefault("kol_list", [])
    payload.setdefault("practice_list", [])
    payload = apply_persistent_config(payload)

    out = digest_path_for(date_iso)
    text = [
        "// 当日聚合数据（由 Daily Intelligence Workbench 生成）。",
        "window.__DAILY__ = window.__DAILY__ || {};",
        'window.__DAILY__[%s] = %s;' % (js_string(key), js_value(payload, indent=2)),
        "",
    ]
    write_text(out, "\n".join(text))
    if publish_manifest:
        update_manifest(date_iso, len(payload.get("items", [])))
    else:
        print("[run] 已写入候选 digest；通过质量校验后再更新 manifest")
    print("[run] 已写入", out)
    return out


def update_manifest(date_value, count):
    date_iso = normalize_date(date_value)
    key = slash_date(date_iso)
    manifest = ROOT / "data" / "manifest.js"
    manifest.parent.mkdir(parents=True, exist_ok=True)

    entries = []
    if manifest.exists():
        raw = read_text(manifest)
        for m in __import__("re").finditer(
            r'\{\s*date:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*count:\s*(\d+),\s*file:\s*"([^"]+)"\s*\}',
            raw,
        ):
            entries.append({
                "date": m.group(1),
                "label": m.group(2),
                "count": int(m.group(3)),
                "file": m.group(4),
            })
    entries = [e for e in entries if e["date"] != key]
    entries.append({
        "date": key,
        "label": date_label(date_iso),
        "count": int(count),
        "file": "data/%s/digest.js" % key,
    })
    entries.sort(key=lambda e: e["date"])
    latest = entries[-1]["date"]
    body = ",\n".join(
        '    { date: "%s", label: "%s", count: %d, file: "%s" }' %
        (e["date"], e["label"], e["count"], e["file"])
        for e in entries
    )
    write_text(manifest, "\n".join([
        "// 数据清单：记录已有哪些日期的调研数据。每天调研后追加一条。",
        "window.__MANIFEST__ = {",
        '  generated_at: "%s",' % date_iso,
        '  latest: "%s",' % latest,
        "  dates: [",
        body,
        "  ]",
        "};",
        "",
    ]))
    print("[run] 已更新 manifest latest=%s" % latest)


def copy_sample(date_value, sample_date):
    src = digest_path_for(sample_date)
    if not src.exists():
        raise SystemExit("[run] 样例 digest 不存在: %s" % src)
    dst = digest_path_for(date_value)
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst)
    raw = read_text(dst)
    date_iso = normalize_date(date_value)
    old_key = slash_date(sample_date)
    new_key = slash_date(date_iso)
    raw = raw.replace('["%s"]' % old_key, '["%s"]' % new_key)
    raw = raw.replace('date: "%s"' % normalize_date(sample_date), 'date: "%s"' % date_iso)
    raw = raw.replace('generated_at: "%s"' % normalize_date(sample_date), 'generated_at: "%s"' % date_iso)
    write_text(dst, raw)
    item_count = len(__import__("re").findall(r'\bid\s*:\s*"([^"]+)"', raw))
    update_manifest(date_iso, item_count)
    print("[run] 已复制样例 %s -> %s" % (old_key, new_key))


def create_research_prompt(date_value, language_override=None):
    date_iso = normalize_date(date_value)
    cfg = runtime_config()
    language = (language_override or cfg.get("output_language") or "zh").strip()
    if language not in LANGUAGE_INSTRUCTIONS:
        language = "zh"
    language_instruction = LANGUAGE_INSTRUCTIONS[language]
    workbench = load_workbench_config()
    enabled_sources = [
        key for key, enabled in (workbench.get("sources") or {}).items() if enabled
    ]
    enabled_rss = [
        feed for feed in ((workbench.get("rss") or {}).get("feeds") or [])
        if isinstance(feed, dict) and feed.get("enabled", True)
    ]
    native_days = int(cfg.get("web_native_recency_days") or 7)
    recovery_days = int(cfg.get("web_recovery_recency_days") or 3)
    recovery_queries = int(cfg.get("freshness_recovery_min_queries") or 6)
    x_search_limit = int(cfg.get("x_scheduled_search_limit") or 6)
    source_flags = workbench.get("sources") or {}
    quality = workbench.get("quality") or {}
    discovery = workbench.get("discovery") or {}
    kol_config = workbench.get("kol") or {}
    dimension_minima = quality.get("dimension_minima") or {}
    min_total_items = int(quality.get("min_total_items") or 12)
    min_kol_items = int(dimension_minima.get("kol") or 4)
    min_fresh_72h = int(quality.get("min_fresh_72h") or 5)
    min_fresh_7d_percent = int(round(float(quality.get("min_fresh_7d_ratio") or 0.65) * 100))
    trend_lanes = [
        lane for lane in discovery.get("lanes") or []
        if isinstance(lane, dict) and lane.get("enabled", True) and lane.get("key")
    ]
    trend_lane_keys = [str(lane["key"]) for lane in trend_lanes]
    trend_lane_requirements = "；".join(
        "%s≥%d 次查询/≥%d 条可归属候选" % (
            lane["key"], int(lane.get("min_queries") or 1), int(lane.get("min_candidates") or 0)
        )
        for lane in trend_lanes
    )
    active_authors = [
        row for row in kol_config.get("authors") or []
        if isinstance(row, dict) and row.get("enabled", True)
    ]
    min_dynamic_candidates = int(kol_config.get("min_dynamic_candidates") or 10)
    min_topic_expansion = int(kol_config.get("min_topic_expansion_selected") or 3)
    min_off_watchlist = int(discovery.get("min_off_watchlist_kol") or 2)
    gate_instruction = (
        "运行 `gate-cli preflight --format json`，再执行至少 3 次 Gate CLI `news feed search-x` 并保存原始 JSON。"
        if source_flags.get("gate_search_x", True)
        else "Gate X 候选源已在工作台关闭，不得调用 Gate CLI。"
    )
    browser_instruction = (
        "允许按安全边界使用最多 %d 次本机只读 X 搜索。" % x_search_limit
        if source_flags.get("x_browser", True)
        else "X 浏览器源已在工作台关闭，不得启动浏览器采集。"
    )
    run_dir = ROOT / ".daily-intel" / "runs" / date_iso
    run_dir.mkdir(parents=True, exist_ok=True)
    effective_config_path = run_dir / "effective_config.json"
    write_text(effective_config_path, json.dumps(workbench, ensure_ascii=False, indent=2) + "\n")
    prompt_path = run_dir / "research_prompt.md"
    prompt = """# Daily Intelligence Research Task

日期：{date_iso}
工作区：{root}
产出语言：{language} — {language_instruction}

请基于本仓库的 `skills/daily-intelligence-workbench/SKILL.md` 和 `docs/调研方法论与Loop设计.md` 生成当日 AI 情报。

执行要求：

本任务按 `开放热点地图 → X 观点与分歧 → 厂商/研究补齐 → 验证发布` 四阶段执行。若当日 schema v3 trace 已存在但未 finalize，必须读取已有 runs 从断点继续，不能重新把部分进度当作完整结果；发生上下文压缩后同样从 trace 恢复。最终答复前必须至少真实尝试完四阶段并运行 validator，禁止在 X 阶段或 trace 不完整时主动结束。

1. 读取 `.daily-intel/runs/{date_iso}/effective_config.json` 作为工作台有效配置，同时参考 `config/industry.yaml`、`config/sources.yaml`、`config/keywords.yaml`、`config/kol.yaml`、`config/conversation_radar.yaml`、`config/research_radar.yaml`。有效 KOL 监听池为 {active_kol_count} 人；页面新增/停用作者和推送机器人均以 effective config 为准，不能只读旧 `kol.yaml`。当前启用数据源：`{enabled_sources}`；启用 RSS：{enabled_rss_count} 个。然后先运行 `python3 scripts/research_trace.py init --date {date_iso} --mode scheduled`。每次真实查询都必须保存原始或规范化 JSON 到 `.daily-intel/runs/{date_iso}/evidence/`，再用 `research_trace.py record --window-days <N>` 登记；没有 artifact、run id 和真实时间窗口的查询不得写成 completed。
   - trace 初始化后立即运行 `python3 scripts/rss_fetch.py --date {date_iso} --record`。RSS 只作为候选发现源；最终入选前必须打开文章深链核验标题、日期和正文，不得把 feed 摘要当作独立事实结论。
2. 先执行 `config/conversation_radar.yaml` 的开放热点地图，不要一上来按五维度或固定名单填表：
   - 首轮查询禁止包含固定 KOL、国内核心厂商和既有型号名，从过去 {trend_lookback_hours} 小时的公开网页、开发者社区、RSS 与社媒中抽取反复出现的新实体、产品名和争议词；
   - 四条启用热点泳道为 `{trend_lane_keys}`，硬门槛为：{trend_lane_requirements}。每条候选必须保存标题、深链、真实发布日期和至少 20 字摘录；只返回索引页或一个 URL 不计候选；
   - 每条泳道至少覆盖 2 个不同来源域名。四条泳道合计至少 3 次 X 候选发现或站内主题查询，查询词必须来自首轮出现的新实体，不能只轮询固定 handle；
   - 每天强制执行 12 组查询：上述四条热点泳道，加上 `community_hotspots`、`access_and_quota`、`chinese_frontier_models`、`x_viewpoints`、`domestic_lab_models`、`domestic_lab_product_ops`、`domestic_lab_research`、`dynamic_kol_views`；
   - 额度重置、usage limits、credits、订阅/价格/容量变化、产品上线、开发者工具和刚发布的国产模型都属于高优先级产品情报；
   - 必扫「AI 如何进入组织 / AI B 端」与「AGI 临近 / Frontier AI」两个战略镜头；
   - 从候选讨论反向提取人物、模型/产品名、文章标题、专有词和反方观点，再做定向搜索；静态 KOL/主题配置不能限制当天新热点；
   - 最终聚成 3-5 个话题簇，每个热点尽量有两条独立来源，再映射到五个展示维度。
3. 执行 `config/research_radar.yaml` 的高优先级雷达。雷达必须覆盖：
   - 研究员长文 / X Articles：尤其 Anthropic Claude Code、OpenAI/alignment 研究员；
   - Demis Hassabis 等 Frontier AI / AGI 长文作者；
   - 官方研究页：Anthropic Research、OpenAI Research、OpenAI Alignment、Google DeepMind Research；
   - 国内核心厂商每日全部检查：Qwen、DeepSeek、Kimi/Moonshot、Z.ai/GLM、ByteDance Seed/豆包、Tencent Hunyuan、Baidu ERNIE、MiniMax；
   - 扩展轮询 StepFun、Huawei Pangu、InternLM、Meituan LongCat、Xiaomi MiMo、InclusionAI；
   - 视觉/多模态独立雷达：Black Forest Labs、Runway、Luma、Kling 等官方发布。重点检查图像/视频/音频统一模型、世界模型、Physical AI 和动作预测；例如 BFL 发布必须核验 `bfl.ai/blog` 具体文章，区分 Early Access、GA 与未来开放权重；
   - 每个厂商必须分别扫描三条活动轨道：`model_release`、`product_ops`、`research`。预告与已公开权重必须区分，套餐/限额/容量/开发者工具不能被模型发布项吞掉；
   - 开源金融/量化 Agent：从 X 讨论 + GitHub topics 双入口发现，不只看 stars。
4. 按五维度组织展示：AI 大厂动态、KOL 观点、前沿论文、开源项目、AI × 金融。研究雷达与话题雷达发现可进入任一维度。
5. KOL 观点必须执行 X-first，但只接受具体观点证据：
   - 从 effective config 的 {active_kol_count} 人启用名单和话题发现的新人物中选取候选；`config/kol.yaml` 只作为兼容参考；
   - {gate_instruction} Gate 是候选发现，不是证据；
   - Gate CLI 仅作候选发现。把每次 `search-x --format json` 结果保存后运行 `python3 scripts/validate_x_candidates.py <result.json>`；校验失败就整段丢弃，即使 `summary`/`content` 非空；但不能因此结束观点发现；
   - Gate 无 cited_tweets/items 时，立即降级为公开网页搜索，用热点专有词加 `site:x.com` 找具体 status/article。普通网页搜索不得使用 `since:`、`filter:` 等 X 站内操作符；网页工具调用使用原生 `recency={native_days}`。规范化 artifact 每条至少保存 `query`、`url`、`title`、`published_at`、`excerpt`，X 帖还必须保存 `author`；缺字段的 status URL 只能算导航候选，不能算已核验帖子；
   - {browser_instruction} 当 Gate 具体引用不足 4 条，且公开索引中同时具备作者、日期、正文摘录、数字 status/article URL 且 {native_days} 天内的帖子不足 6 条时，若 X 浏览器源启用，定时任务必须按配置执行低频只读 X 站内搜索；不得仅因公开搜索返回了 status URL 就跳过浏览器。每次只读首屏最多 8 条，不滚动、不批量访问 profile、不点赞/关注/转发/发帖/发消息，查询间隔至少 10 秒；`domcontentloaded` 后若仍为 Loading，等待 Search timeline/article 出现或最多补等 3 秒再判空；遇到登录墙、验证码或挑战立即停止并将该 browser run 记录为 blocked；
   - 具体 `x.com/<handle>/status/<digits>` 或 article 必须记录作者、时间、正文摘录并设置 `provider=x-browser`、`verification_level=direct_page`；
   - profile、with_replies、search、home 只用于导航，绝不能写成观点条目，也不能计入 X 比例；
   - X Article 正文被登录墙阻挡时，保留 X 文章/状态链接，并补作者自有博客、Substack 或官方镜像作为正文证据；遇到登录墙、验证码或安全拦截立即停止，不得绕过。
6. KOL 维度至少 {min_kol_items} 条，至少 60% 来自浏览器或公开索引核验过的具体 X status/article。每天必须先按热点词找人，再与固定名单交叉：
   - 动态作者候选至少 {min_dynamic_candidates} 人，至少选入 {min_topic_expansion} 条 `discovery_mode=topic_expansion` 的观点，其中至少 {min_off_watchlist} 条作者不在启用名单；
   - 至少 2 个重点话题同时拥有 `originator` 和 `independent_evaluation`；
   - 至少 1 个话题有 `counterpoint`，用来揭示部署门槛、证据边界或反方逻辑。
   达不到时不要写占位条目，应让质量校验失败；但大厂、论文、开源和金融条目仍必须正常生成并保留，禁止因为 X 不足把整个 `items` 清空。
7. 执行新鲜度与去重门槛：
   - 至少 {min_fresh_7d_percent}% 条目在 {native_days} 天内发布，至少 {min_fresh_72h} 条在 72 小时内发布；
   - 在写 canonical JSON 前，先按候选真实 `published_at` 计算一次临时新鲜度。如果未达到上述门槛，必须触发 `freshness_recovery`：使用工具原生 `recency={recovery_days}` 再执行至少 {recovery_queries} 次针对性查询，其中至少 2 次明确以 {recovery_days} 天为 `--window-days`，补查热点、产品运营、国内模型、官方研究和动态 KOL；X 证据仍不足且浏览器源启用时继续纳入浏览器兜底；
   - 超过 7 天只能设为 `recency_role=background`，并写清与本周新事件绑定的 `why_now`；
   - 超过 30 天不得作为每日独立条目；
   - 读取此前 7 期 digest，重复 URL/近似标题默认淘汰；确有实质更新时设置 `repeat_update=true` 并填写 `new_evidence`；
   - 禁止用官网索引页、研究列表页、主题页或 profile 代替具体文章深链。
8. 优先英文关键词与一手来源，不读取 cookie/token。对所有国内核心厂商的具体文章、论文、模型卡、官方 X、GitHub release、产品更新与套餐说明提升优先级。
9. 开源项目额外关注金融 Agent、量化 Agent、AI 投研、回测/券商/交易所接口、自动推送、风控闭环；星少但机制新、X 讨论早期升温的项目可标 `potential=潜力新星`。
10. 过滤营销、招聘、重复、旧闻填充、监测占位与不可验证信息；保留来源 URL、真实发布日期和可信度说明。不要把来源日期改成运行当天。
11. 长文/研究项写作规则：若 `content_type` 是 `x_article`、`official_research`、`paper`、`technical_report`、`model_card`，通常设置 `depth=deep`，`detail` 至少约 650 个中文字符，并补充 `key_points`、`examples`、`product_implications`、`limitations`。目标是用户不跳原文也能了解七七八八。
12. 按“产出语言”要求组织面向用户字段。产出 canonical JSON 时设置根字段 `quality_version: 6`，总条目不少于 {min_total_items}；每条填写 `topic_cluster`、`recency_role`。由开放热点发现入选的条目还必须填写 `topic_origin=trend_discovery` 和对应 `trend_lane`；至少 {min_trend_items} 条趋势条目并覆盖至少 {min_trend_lanes} 条泳道。AI 大厂条目追加 `lab_activity_type=model_release|product_ops|research`；KOL 条目追加 `discovery_mode=watchlist|topic_expansion` 和 `viewpoint_role=originator|independent_evaluation|counterpoint|context`；X 条目填写 `evidence.provider`、`verification_level`、`excerpt`、`verified_url`、`verified_at`、`published_at` 和 `direct`。字段参考 `skills/daily-intelligence-workbench/references/data-schema.md`。
13. 根字段必须写 `coverage_report`，并设置 `trace_path=.daily-intel/runs/{date_iso}/research_trace.json`。12 个必扫 query group 均记录 `key`、`status=completed`、实际 `queries`、`run_ids`、`candidate_count`、`selected_ids`；有候选但未入选时写 `rejection_reasons`。`queries`、候选数和管道计数必须能被 trace 反查，不能估算或补写。同时记录：
   - `trend_pipeline.lanes`：四条热点泳道的 run_ids、可归属候选、不同域名、新实体和入选条目；`trend_selected_ids` 必须与所有 `topic_origin=trend_discovery` 条目完全一致；
   - `x_pipeline`：Gate 查询数/逐帖引用数、公开索引查询数/具体帖子数、交互浏览器查询数/核验帖子数；
   - `lab_pipeline`：`core_labs_checked` 覆盖 8 家核心厂商，`activity_tracks` 完整记录三条轨道的查询、候选和入选/淘汰；
   - `viewpoint_pipeline`：动态候选不少于 {min_dynamic_candidates}，话题反向入选不少于 {min_topic_expansion}，`topic_roles` 记录重点话题的首发者、独立评估和反方。
   - `freshness_pipeline`：记录 `provisional_within_72h`、`provisional_within_7d`、`provisional_total`、`recovery_triggered`、`recovery_run_ids` 和补搜后的计数；每个 recovery run 必须可在 trace 中反查，其中至少 2 个 `window_days<=3`；
   - trace 中为 8 家核心厂商分别留下 `lab + track` 的 24 组真实检查记录；批量调用可以，但每个查询及原始结果必须独立登记；
   禁止用笼统的“已扫描”代替。
   每个 `hot_topics_today` 条目必须填写 `trend_lane`、具体 `why_now` 和 `debate`，标题应包含当天新实体或明确变化，不能再用“开放模型走向产品”等可连续复用的泛化句。进入成稿前先执行一次 `research_trace.py check`：只有 12/12 组、四条热点泳道、8 家核心厂商的 24 个轨道和 X 兜底要求都完成，才可进入 finalize；检查失败必须按缺口继续，不能输出最终总结。
14. 完成检索后先运行 `python3 scripts/research_trace.py finalize --date {date_iso}`；trace 校验失败时继续补查询，不得写 completed。然后写入 canonical JSON 并运行：

```bash
python3 scripts/run_daily.py --date {date_iso} --from-json <canonical-json-path> --publish-on-valid
python3 scripts/validate_digest.py --date {date_iso}
```

仅在验证无 error 后可选推送：

```bash
python3 scripts/push_lark.py
```

若最终仍未达到内容质量门槛，也必须在上述 trace 覆盖与 freshness recovery 均完成后，以 `validate_digest.py` 的实际错误作为失败原因；不得以“trace 仍不完整”作为主动提前停止的结果。
""".format(
        date_iso=date_iso,
        root=ROOT,
        language=language,
        language_instruction=language_instruction,
        enabled_sources=", ".join(enabled_sources) or "none",
        enabled_rss_count=len(enabled_rss),
        active_kol_count=len(active_authors),
        trend_lookback_hours=int(discovery.get("lookback_hours") or 24),
        trend_lane_keys=", ".join(trend_lane_keys),
        trend_lane_requirements=trend_lane_requirements,
        native_days=native_days,
        recovery_days=recovery_days,
        recovery_queries=recovery_queries,
        gate_instruction=gate_instruction,
        browser_instruction=browser_instruction,
        min_total_items=min_total_items,
        min_kol_items=min_kol_items,
        min_dynamic_candidates=min_dynamic_candidates,
        min_topic_expansion=min_topic_expansion,
        min_off_watchlist=min_off_watchlist,
        min_trend_items=int(discovery.get("min_trend_items") or 3),
        min_trend_lanes=int(discovery.get("min_distinct_lanes_selected") or 2),
        min_fresh_72h=min_fresh_72h,
        min_fresh_7d_percent=min_fresh_7d_percent,
    )
    write_text(prompt_path, prompt)
    print("[run] 已生成 agent 调研提示:", prompt_path)
    return prompt_path


def maybe_run_agent(date_value, prompt_path):
    cfg = runtime_config()
    cmd = (cfg.get("agent_command") or "").strip()
    if not cmd:
        print("[run] 未配置 agent_command；请把上面的 research_prompt.md 交给 Claude Code / Codex 执行。")
        return 0
    replacements = {
        "{date}": normalize_date(date_value),
        "{root}": str(ROOT),
        "{prompt}": str(prompt_path),
    }
    for k, v in replacements.items():
        cmd = cmd.replace(k, v)
    print("[run] 调用 agent_command:", cmd)
    return subprocess.call(cmd, shell=True, cwd=str(ROOT))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", default="today", help="YYYY-MM-DD, YYYY/MM/DD, or today")
    parser.add_argument("--from-json", help="Canonical digest JSON to write into data/YYYY/MM/DD/digest.js")
    parser.add_argument("--publish-on-valid", action="store_true", help="Update manifest only after digest validation passes")
    parser.add_argument("--sample", action="store_true", help="Copy bundled sample data for a smoke run")
    parser.add_argument("--sample-date", default="2026-06-29", help="Sample date to copy when --sample is used")
    parser.add_argument("--push", action="store_true", help="Push after successful validation")
    parser.add_argument("--strict", action="store_true", help="Exit non-zero when no digest is generated")
    parser.add_argument("--language", choices=sorted(LANGUAGE_INSTRUCTIONS), help="Override runtime.yaml output_language for this run")
    args = parser.parse_args()

    date_iso = normalize_date(args.date)
    pending_manifest_count = None

    if args.from_json:
        source_payload = load_json(args.from_json)
        pending_manifest_count = len(source_payload.get("items", []))
        write_digest_from_json(
            date_iso,
            args.from_json,
            args.language,
            publish_manifest=not args.publish_on_valid,
        )
    elif args.sample:
        copy_sample(date_iso, args.sample_date)
    elif digest_path_for(date_iso).exists():
        print("[run] 当日 digest 已存在:", digest_path_for(date_iso))
    else:
        prompt_path = create_research_prompt(date_iso, args.language)
        rc = maybe_run_agent(date_iso, prompt_path)
        if rc != 0:
            sys.exit(rc)
        if not digest_path_for(date_iso).exists() and args.strict:
            raise SystemExit("[run] 未生成 digest: %s" % digest_path_for(date_iso))

    if digest_path_for(date_iso).exists():
        rc = subprocess.call([sys.executable, "scripts/validate_digest.py", "--date", date_iso], cwd=str(ROOT))
        if rc != 0:
            sys.exit(rc)
        if args.publish_on_valid and pending_manifest_count is not None:
            update_manifest(date_iso, pending_manifest_count)
        if args.push:
            sys.exit(subprocess.call([sys.executable, "scripts/push_lark.py"], cwd=str(ROOT)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
