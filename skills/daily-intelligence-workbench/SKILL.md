---
name: daily-intelligence-workbench
version: 0.4.0
description: This skill should be used when the user asks to run daily AI intelligence, generate today's AI news digest, find recent important AI discussions, improve stale or low-signal daily news, initialize or configure the daily intelligence workbench, set up a visual local AI intelligence dashboard, install or create a daily schedule, configure X/Twitter collection, or push the daily digest to Lark/Feishu.
---

# Daily Intelligence Workbench

Operate the local daily AI intelligence workbench. The workbench turns configurable sources, industry anchors, optional X/Twitter providers, and an agent-assisted research loop into a structured `digest.js`, a local HTML dashboard, and optional bot pushes.

## Natural Language Setup Mode

When the user asks in natural language, do the setup rather than only listing commands. Examples:

- "Set this up for AI + crypto and AI + finance, English output, no push, and run it every morning."
- "帮我初始化每日资讯工作台，关注 AI+加密和 AI+金融，每天 8:30 自动生成。"
- "Use this repo as your daily task and push the digest to Lark when configured."

Translate the request into this decision set:

1. Industry anchors: infer from the request, otherwise default to `ai-crypto,ai-finance`.
2. Output language: infer from the user's language, otherwise use `zh`; support `zh`, `en`, and `bilingual`.
3. Push behavior: only enable push when the user explicitly wants it and a webhook is already configured or provided locally.
4. Schedule time: infer from the request, otherwise use `08:30`.
5. Agent execution mode: if the user wants the agent itself to run daily and the current agent host has native recurring tasks/automations, create that agent-native daily task. Otherwise install the local OS schedule with `scripts/install_schedule.py`.

For agent-native schedules, the recurring task should open this repository, read this skill, run the topic-discovery and evidence-verification procedure below, write canonical JSON with `quality_version: 4`, write it with `python3 scripts/run_daily.py --date today --from-json <path> --publish-on-valid`, and push only after validation succeeds. Do not store secrets in the task definition.

For local OS schedules, run:

```bash
python3 scripts/install_schedule.py install --time HH:MM
python3 scripts/install_schedule.py install --time HH:MM --push
```

Use the second command only when push is configured. After setup, report the exact anchors, language, push mode, schedule mode, schedule time, and the command or native task that will run.

## Core Workflow

1. Inspect the repository root. Confirm these paths exist:
   - `index.html`
   - `config/`
   - `data/manifest.js`
   - `scripts/`
2. Initialize local configuration when needed:
   - `python3 scripts/init.py`
   - Use `--anchors ai-crypto,ai-finance` or another comma-separated list for non-interactive setup.
   - Use `--language zh`, `--language en`, or `--language bilingual` to choose digest output language.
3. Generate or validate a daily digest:
   - `python3 scripts/run_daily.py --date today`
   - If an agent command is configured, the script creates a research prompt and invokes that command.
   - If no agent command is configured, the script writes a handoff prompt under `.daily-intel/runs/<date>/research_prompt.md`.
4. Validate the generated output:
   - `python3 scripts/validate_digest.py --date latest`
5. Start the local dashboard:
   - `python3 scripts/serve.py --port 4318`
6. Push the digest only when the user has configured a webhook:
   - `python3 scripts/push_lark.py`
7. Install or inspect schedules:
   - `python3 scripts/install_schedule.py install --time 08:30 --push`
   - `python3 scripts/install_schedule.py status`
   - `python3 scripts/install_schedule.py uninstall`

## X/Twitter Provider Discipline

Treat X/Twitter collection as a provider, not a hard dependency.

- Use public web/status reads as the default evidence path. Public profiles can help discover posts without login, but profiles and `with_replies` never count as viewpoints.
- Use Chrome login state, browser extensions, X API, or third-party providers only when the user explicitly configures them locally.
- Never inspect, copy, export, or store cookies, session storage, passwords, or tokens.
- Do not describe the workflow as "anti-ban" or guaranteed to avoid rate limits. Prefer "low-frequency, read-only, user-owned provider".
- Record provider limitations in digest notes when a source could not be verified directly.
- Scheduled or unattended runs must not script the X website, automate X search, auto-scroll, or batch-read a logged-in session. Use public web search, Gate CLI, or an official API for scheduled discovery.
- Gate CLI returning a fluent summary with zero cited posts is a provider failure, not evidence that X has no viewpoints. Immediately fall back to public `site:x.com` discovery for concrete status/article URLs.
- Scheduled runs may accept a concrete X status/article found in a public web index when the result exposes the author, published date, and attributable text excerpt. Record `provider: public-web-index` and `verification_level: public_index`; do not describe it as browser-verified.
- Browser verification is interactive-only: when the user explicitly starts a run, open only a small number of final candidates, read visible author/date/text, and stop immediately on login walls, CAPTCHA, or safety interstitials.

For detailed provider strategy, read `references/source-providers.md`.

## Digest Contract

Write each daily output to `data/YYYY/MM/DD/digest.js` and update `data/manifest.js`. The frontend expects:

- `date`, `date_cn`, `generated_at`
- `dimensions`: five or more dimension summaries
- `hot_topics_today`: cross-dimensional topics
- `items`: structured intelligence entries
- Optional: `kol_list`, `practice_list`, `market_mood`
- For `quality_version: 4`: `coverage_report` with eight mandatory query groups, separate domestic-lab model/product/research tracks, dynamic KOL viewpoint roles, and X provider fallback counts.

Honor `config/runtime.yaml` `output_language` when creating user-facing fields. Supported values are:

- `zh`: Simplified Chinese output with technical terms and URLs preserved.
- `en`: English output with source names, project names, tickers, and URLs preserved.
- `bilingual`: Simplified Chinese first, with concise English equivalents for titles and key summaries where useful.

For the complete schema and validation expectations, read `references/data-schema.md`.

## Agent Research Procedure

When no structured JSON has been provided, run the research loop manually in the current agent:

1. Read `config/industry.yaml`, `config/sources.yaml`, `config/keywords.yaml`, `config/kol.yaml`, `config/conversation_radar.yaml`, and `config/research_radar.yaml`.
2. Run the conversation-radar pass before checking fixed sources or filling dimensions:
   - Search broad recent debates first, using the current date plus 24-hour, 72-hour, and 7-day windows.
   - Complete all eight `mandatory_pulse` groups before strategic lenses: community hotspots, access/quota/subscription changes, Chinese frontier-model launches, X viewpoints, domestic-lab models, domestic-lab product operations, domestic-lab research, and dynamic KOL viewpoints.
   - Always scan the strategic lenses in `config/conversation_radar.yaml`, including how AI enters organizations / enterprise AI and AGI / frontier AI governance.
   - Extract newly named people, articles, terms, organizations, counterarguments, and case studies from the broad pass, then issue focused follow-up queries.
   - Build 3-5 topic clusters with at least two independent sources each. A topic cluster is the editorial unit; the five dimensions are presentation buckets, not search silos.
3. Run the research-radar pass:
   - Researcher longform / X Articles: especially Anthropic Claude Code and OpenAI/alignment researchers.
   - Official research pages: Anthropic Research, OpenAI Research, OpenAI Alignment, Google DeepMind Research.
   - Check all eight core Chinese labs every day: Qwen, DeepSeek, Kimi/Moonshot, Z.ai/GLM, ByteDance Seed/Doubao, Tencent Hunyuan, Baidu ERNIE, and MiniMax. Rotate StepFun, Huawei Pangu, InternLM, Meituan LongCat, Xiaomi MiMo, and InclusionAI as the extended pool.
   - Scan three activity tracks separately for every lab: `model_release`, `product_ops`, and `research`. A model preview, API/product availability, pricing/quota/capacity change, and paper/technical report are different events and must not overwrite one another.
   - Distinguish announcement, preview, API availability, and released weights. Never turn "open weights soon" into "weights released".
   - Open-source finance/quant agents: discover from X discussion plus GitHub topics, not GitHub stars alone.
4. Use the full KOL list as a watch pool, then expand from each emerging topic's exact model name, article title, coined term, evaluator, and counterargument. Select 4-10 actual recent viewpoints; the static list must not cap discovery.
5. Verify X evidence under the run mode:
   - Use public search and Gate CLI `news feed search-x` to discover candidates. Gate CLI is discovery only.
   - Save each `search-x --format json` result and run `python3 scripts/validate_x_candidates.py <result.json>`. Discard the entire synthesized result when the validator fails, even if `summary` or `content` is non-empty.
   - When Gate validation fails because there are no cited posts, continue with public web search using the emerging topic term plus `site:x.com`. Do not stop the KOL track at the provider failure.
   - In a user-initiated interactive run only, open a small number of final X candidates in a browser. Accept only a concrete `x.com/<handle>/status/<digits>` or `x.com/i/article/<digits>` URL with visible author, timestamp, and post/article evidence; record `verification_level: direct_page`.
   - In scheduled or unattended runs, do not automate the X website or reuse a logged-in browser. A concrete X post may still count when a public web index exposes its author, date, and attributable excerpt; record `provider: public-web-index`, `verification_level: public_index`, and the excerpt. A URL without attributable post text does not count.
   - Treat profile, `with_replies`, search, and home URLs as navigation aids only. Never publish them as digest items or count them as X evidence.
   - When an X Article body is login-gated, preserve the X post/article URL and use an author-owned blog, Substack, or official mirror for readable body evidence; never bypass the login wall.
6. Target at least 60% of KOL-view items with verified concrete X post/article evidence and at least four KOL-view items total. Select at least two `discovery_mode: topic_expansion` viewpoints. Across major topics, require at least two originator + independent-evaluation pairs and at least one counterpoint. Record `viewpoint_role` as `originator`, `independent_evaluation`, `counterpoint`, or `context`. If this cannot be reached, do not manufacture monitoring placeholders. Leave the dimension underfilled, document the failure, and let validation fail visibly.
7. Build five presentation tracks: AI labs, KOL views, papers, open source, and AI x finance. Map each selected item back to a discovered topic cluster.
8. Enforce freshness before editorial polish:
   - Target at least 65% of items published within 7 days and at least five items within 72 hours.
   - Use sources older than 7 days only as `recency_role: background`, with a specific `why_now` tied to a fresh catalyst.
   - Do not publish sources older than 30 days as standalone daily items.
   - Read the previous seven digests and reject repeated URLs or near-identical titles unless `repeat_update: true` and `new_evidence` explains the material update.
   - Require article-level deep links. Generic research indexes, topic pages, profiles, and search-result pages are not item sources.
9. Prefer primary sources: official articles, research pages, arXiv, GitHub releases, Hugging Face model cards, project docs, concrete X posts/articles, and then reputable media.
10. Filter aggressively: remove marketing, duplicated reposts, job posts, unverifiable claims, stale filler, source-monitoring notes, and items included only to fill a dimension. Do not drop a high-signal recent researcher article merely because it is not viral yet.
11. For longform or research items, set `content_type` and usually `depth: deep`. Include `detail`, `key_points`, `examples`, `product_implications`, and `limitations` so the dashboard is useful without opening the source.
12. Write a temporary canonical JSON file matching `references/data-schema.md`. Set root `quality_version` to `4`, include `coverage_report`, and record item-level `recency_role`, `topic_cluster`, and `evidence` metadata. Lab items require `lab_activity_type`; KOL items require `discovery_mode` and `viewpoint_role`. `coverage_report.lab_pipeline` must name all eight core labs and all three activity tracks; `coverage_report.viewpoint_pipeline` must record dynamic candidates, selections, and topic roles.
13. Convert it into dashboard format:
   - `python3 scripts/run_daily.py --date YYYY-MM-DD --from-json /path/to/digest.json --publish-on-valid`
14. Validate and serve locally. Do not push when the quality validator reports an error.

## Scheduling

Use `scripts/install_schedule.py` for local schedules. On macOS it writes a LaunchAgent. On Linux it writes a marked crontab line. The scheduled script is intentionally local-first and reads configuration from `config/runtime.yaml` plus environment variables.

Keep schedule setup separate from account setup. A schedule may run without X login, API keys, or push bots; it should create a research prompt or validate existing data rather than failing destructively.

## Push Safety

Push only after the user configures `config/push.yaml` or passes a webhook override. Do not commit real webhook URLs. For Lark/Feishu, `scripts/push_lark.py` uses only the Python standard library and sends an interactive card.

## Useful Resources

- `references/data-schema.md` - Digest schema and canonical JSON format.
- `references/source-providers.md` - Public web, Chrome, extension, API, and fallback provider strategy.
- `config/conversation_radar.yaml` - Topic discovery, freshness, evidence, and anti-placeholder quality policy.
- `config/research_radar.yaml` - Researcher longform, lab research, Chinese frontier lab, and finance/quant agent radar.
- `scripts/validate_x_candidates.py` - Reject Gate CLI summaries without concrete tweet/article evidence before browser verification.
- `docs/调研方法论与Loop设计.md` - Product and research methodology.
