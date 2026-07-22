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
    run_dir = ROOT / ".daily-intel" / "runs" / date_iso
    prompt_path = run_dir / "research_prompt.md"
    prompt = """# Daily Intelligence Research Task

日期：{date_iso}
工作区：{root}
产出语言：{language} — {language_instruction}

请基于本仓库的 `skills/daily-intelligence-workbench/SKILL.md` 和 `docs/调研方法论与Loop设计.md` 生成当日 AI 情报。

执行要求：

1. 读取 `config/industry.yaml`、`config/sources.yaml`、`config/keywords.yaml`、`config/kol.yaml`、`config/conversation_radar.yaml`、`config/research_radar.yaml`、`config/runtime.yaml`，然后先运行 `python3 scripts/research_trace.py init --date {date_iso} --mode scheduled`。每次真实查询都必须保存原始或规范化 JSON 到 `.daily-intel/runs/{date_iso}/evidence/`，再用 `research_trace.py record` 登记；没有 artifact 和 run id 的查询不得写成 completed。
2. 先执行 `config/conversation_radar.yaml` 的话题发现，不要一上来按五维度填表：
   - 先开放扫描过去 24 小时 AI 圈热词，再用当天日期、最近 72 小时和 7 天窗口宽搜，先找 8-15 个候选讨论；
   - 每天强制执行 `mandatory_pulse` 八组查询：`community_hotspots`、`access_and_quota`、`chinese_frontier_models`、`x_viewpoints`、`domestic_lab_models`、`domestic_lab_product_ops`、`domestic_lab_research`、`dynamic_kol_views`；
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
   - 每个厂商必须分别扫描三条活动轨道：`model_release`、`product_ops`、`research`。预告与已公开权重必须区分，套餐/限额/容量/开发者工具不能被模型发布项吞掉；
   - 开源金融/量化 Agent：从 X 讨论 + GitHub topics 双入口发现，不只看 stars。
4. 按五维度组织展示：AI 大厂动态、KOL 观点、前沿论文、开源项目、AI × 金融。研究雷达与话题雷达发现可进入任一维度。
5. KOL 观点必须执行 X-first，但只接受具体观点证据：
   - 从完整 `config/kol.yaml` 和话题发现的新人物中选取候选；
   - 先运行 `gate-cli preflight --format json`，再执行至少 3 次 Gate CLI `news feed search-x` 并保存原始 JSON。Gate 是候选发现，不是证据；
   - Gate CLI 仅作候选发现。把每次 `search-x --format json` 结果保存后运行 `python3 scripts/validate_x_candidates.py <result.json>`；校验失败就整段丢弃，即使 `summary`/`content` 非空；但不能因此结束观点发现；
   - Gate 无 cited_tweets/items 时，立即降级为公开网页搜索，用热点专有词加 `site:x.com` 找具体 status/article。普通网页搜索不得使用 `since:`、`filter:` 等 X 站内操作符；只采用同时可见作者、日期、正文摘录的原帖，设置 `provider=public-web-index`、`verification_level=public_index`、`excerpt`；
   - 若公开索引只返回 trending/profile，定时任务可按 `config/runtime.yaml` 使用本机浏览器做最多 6 次低频、只读的 X 站内搜索：每次只读首屏最多 8 条，不滚动、不批量访问 profile、不点赞/关注/转发/发帖/发消息，查询间隔至少 10 秒；`domcontentloaded` 后若仍为 Loading，等待 Search timeline/article 出现或最多补等 3 秒再判空；遇到登录墙、验证码或挑战立即停止；
   - 具体 `x.com/<handle>/status/<digits>` 或 article 必须记录作者、时间、正文摘录并设置 `provider=x-browser`、`verification_level=direct_page`；
   - profile、with_replies、search、home 只用于导航，绝不能写成观点条目，也不能计入 X 比例；
   - X Article 正文被登录墙阻挡时，保留 X 文章/状态链接，并补作者自有博客、Substack 或官方镜像作为正文证据；遇到登录墙、验证码或安全拦截立即停止，不得绕过。
6. KOL 维度至少 4 条，至少 60% 来自浏览器或公开索引核验过的具体 X status/article。每个重点话题不能只查固定名单，要用专有词、标题、产品名反向找人：
   - 至少选入 2 条 `discovery_mode=topic_expansion` 的观点；
   - 至少 2 个重点话题同时拥有 `originator` 和 `independent_evaluation`；
   - 至少 1 个话题有 `counterpoint`，用来揭示部署门槛、证据边界或反方逻辑。
   达不到时不要写占位条目，应让质量校验失败；但大厂、论文、开源和金融条目仍必须正常生成并保留，禁止因为 X 不足把整个 `items` 清空。
7. 执行新鲜度与去重门槛：
   - 至少 65% 条目在 7 天内发布，至少 5 条在 72 小时内发布；
   - 超过 7 天只能设为 `recency_role=background`，并写清与本周新事件绑定的 `why_now`；
   - 超过 30 天不得作为每日独立条目；
   - 读取此前 7 期 digest，重复 URL/近似标题默认淘汰；确有实质更新时设置 `repeat_update=true` 并填写 `new_evidence`；
   - 禁止用官网索引页、研究列表页、主题页或 profile 代替具体文章深链。
8. 优先英文关键词与一手来源，不读取 cookie/token。对所有国内核心厂商的具体文章、论文、模型卡、官方 X、GitHub release、产品更新与套餐说明提升优先级。
9. 开源项目额外关注金融 Agent、量化 Agent、AI 投研、回测/券商/交易所接口、自动推送、风控闭环；星少但机制新、X 讨论早期升温的项目可标 `potential=潜力新星`。
10. 过滤营销、招聘、重复、旧闻填充、监测占位与不可验证信息；保留来源 URL、真实发布日期和可信度说明。不要把来源日期改成运行当天。
11. 长文/研究项写作规则：若 `content_type` 是 `x_article`、`official_research`、`paper`、`technical_report`、`model_card`，通常设置 `depth=deep`，`detail` 至少约 650 个中文字符，并补充 `key_points`、`examples`、`product_implications`、`limitations`。目标是用户不跳原文也能了解七七八八。
12. 按“产出语言”要求组织面向用户字段。产出 canonical JSON 时设置根字段 `quality_version: 5`，每条填写 `topic_cluster`、`recency_role`；AI 大厂条目追加 `lab_activity_type=model_release|product_ops|research`；KOL 条目追加 `discovery_mode=watchlist|topic_expansion` 和 `viewpoint_role=originator|independent_evaluation|counterpoint|context`；X 条目填写 `evidence.provider`、`verification_level`、`excerpt`、`verified_url`、`verified_at`、`published_at` 和 `direct`。字段参考 `skills/daily-intelligence-workbench/references/data-schema.md`。
13. 根字段必须写 `coverage_report`，并设置 `trace_path=.daily-intel/runs/{date_iso}/research_trace.json`。八个必扫 query group 均记录 `key`、`status=completed`、实际 `queries`、`run_ids`、`candidate_count`、`selected_ids`；有候选但未入选时写 `rejection_reasons`。`queries`、候选数和管道计数必须能被 trace 反查，不能估算或补写。同时记录：
   - `x_pipeline`：Gate 查询数/逐帖引用数、公开索引查询数/具体帖子数、交互浏览器查询数/核验帖子数；
   - `lab_pipeline`：`core_labs_checked` 覆盖 8 家核心厂商，`activity_tracks` 完整记录三条轨道的查询、候选和入选/淘汰；
   - `viewpoint_pipeline`：动态候选不少于 6，入选不少于 2，`topic_roles` 记录重点话题的首发者、独立评估和反方。
   - trace 中为 8 家核心厂商分别留下 `lab + track` 的 24 组真实检查记录；批量调用可以，但每个查询及原始结果必须独立登记；
   禁止用笼统的“已扫描”代替。
14. 完成检索后先运行 `python3 scripts/research_trace.py finalize --date {date_iso}`；trace 校验失败时继续补查询，不得写 completed。然后写入 canonical JSON 并运行：

```bash
python3 scripts/run_daily.py --date {date_iso} --from-json <canonical-json-path> --publish-on-valid
python3 scripts/validate_digest.py --date {date_iso}
```

仅在验证无 error 后可选推送：

```bash
python3 scripts/push_lark.py
```
""".format(
        date_iso=date_iso,
        root=ROOT,
        language=language,
        language_instruction=language_instruction,
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
