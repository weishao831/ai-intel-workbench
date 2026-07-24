---
name: daily-intelligence-workbench
version: 0.6.0
description: This skill should be used when the user asks to run daily AI intelligence, generate today's AI news digest, find recent important AI discussions, improve stale or low-signal daily news, initialize or configure the daily intelligence workbench, set up a visual local AI intelligence dashboard, install or create a daily schedule, configure X/Twitter collection, or push the daily digest to Lark/Feishu.
---

# Daily Intelligence Workbench

Operate the local daily AI intelligence workbench. The workbench turns dashboard-managed settings, configurable RSS/Atom feeds, industry anchors, optional X/Twitter providers, and an agent-assisted research loop into a structured `digest.js`, a local HTML dashboard, and optional bot pushes.

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

For agent-native schedules, the recurring task should open this repository, read this skill, initialize an auditable schema-v3 `research_trace.json`, run the open-trend discovery and evidence-verification procedure below, write canonical JSON with `quality_version: 6`, write it with `python3 scripts/run_daily.py --date today --from-json <path> --publish-on-valid`, and push only after both trace and digest validation succeed. Do not store secrets in the task definition.

For local OS schedules, run:

```bash
python3 scripts/install_schedule.py install --time HH:MM
python3 scripts/install_schedule.py install --time HH:MM --push
```

Use the second command only when push is configured. After setup, report the exact anchors, language, push mode, schedule mode, schedule time, and the command or native task that will run.

## Core Workflow

The scheduled workflow is resumable. Treat `research_trace.json` as the checkpoint: after context compaction or a continued task, inspect existing runs and continue missing phases instead of restarting or ending with a partial-trace summary. A scheduled run may not return a final answer immediately after the X phase. It must attempt topic discovery, the 24 core-lab tracks, freshness recovery when triggered, and final validation.

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
   - `python3 scripts/research_trace.py init --date today --mode scheduled`
   - `python3 scripts/rss_fetch.py --date today --record`
   - `python3 scripts/run_daily.py --date today`
   - If an agent command is configured, the script creates a research prompt and invokes that command.
   - If no agent command is configured, the script writes a handoff prompt under `.daily-intel/runs/<date>/research_prompt.md`.
4. Finalize query evidence and validate the generated output:
   - `python3 scripts/research_trace.py finalize --date today`
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
- Scheduled runs may use the user's locally configured browser only in `scheduled_limited_readonly` mode: at most six low-frequency X searches, first viewport only, no scrolling, no batch profile reads, and no likes, follows, reposts, posts, or messages. X can remain on a loading shell after `domcontentloaded`; wait for the search timeline/article or up to three additional seconds before declaring the result empty. Stop on any login wall, CAPTCHA, or challenge.
- Gate CLI returning a fluent summary with zero cited posts is a provider failure, not evidence that X has no viewpoints. Immediately fall back to public `site:x.com` discovery for concrete status/article URLs.
- Scheduled runs may accept a concrete X status/article found in a public web index when the result exposes the author, published date, and attributable text excerpt. Record `provider: public-web-index` and `verification_level: public_index`; do not describe it as browser-verified. Do not put X-only operators such as `since:` or `filter:` into ordinary web-search queries.
- In limited scheduled-browser mode, save normalized first-viewport results as evidence and record `provider: x-browser`, `verification_level: direct_page`. Interactive runs may additionally open a small number of final candidate posts.

For detailed provider strategy, read `references/source-providers.md`.

## Workbench Configuration, KOLs, Push Targets, And RSS

- Read `config/workbench.js` and `config/kol.js` first, then merge optional local overrides from `config/workbench.user.js`.
- The dashboard configuration center saves immediately to browser storage. Its "write to daily task" action writes `config/workbench.user.js`, which is intentionally gitignored.
- KOL authors are maintained in the configuration center. The effective `kol.authors` list supersedes the legacy `config/kol.yaml` watch pool.
- Push targets are maintained as non-secret metadata: bot name, type, role, enable state, and environment-variable names. Resolve real webhook/signing-secret values only from the local environment or `config/secrets.env`; never store or export a webhook URL from the dashboard.
- Apply configured runtime values, quality floors, and source switches. Do not call a provider that the effective configuration disables.
- RSS/Atom subscriptions are managed under the dashboard's RSS source view. Run `scripts/rss_fetch.py --date YYYY-MM-DD --record` after trace initialization.
- Record one `rss-feed` trace run and one evidence artifact per enabled feed. A failed feed must not cancel successful feeds.
- Feed titles, dates, links, authors, and excerpts are discovery evidence. Open the article or official deep link before selecting it; never publish an RSS description as a self-validating factual claim.

## Digest Contract

Write each daily output to `data/YYYY/MM/DD/digest.js` and update `data/manifest.js`. The frontend expects:

- `date`, `date_cn`, `generated_at`
- `dimensions`: five or more dimension summaries
- `hot_topics_today`: cross-dimensional topics
- `items`: structured intelligence entries
- Optional: `kol_list`, `practice_list`, `market_mood`
- For `quality_version: 6`: `coverage_report` with twelve mandatory query groups, `run_ids`, `trace_path`, four open-trend lanes, separate domestic-lab model/product/research tracks, dynamic KOL viewpoint roles, and X provider counts derived from trace artifacts.

Honor the effective workbench/runtime `output_language` when creating user-facing fields. Supported values are:

- `zh`: Simplified Chinese output with technical terms and URLs preserved.
- `en`: English output with source names, project names, tickers, and URLs preserved.
- `bilingual`: Simplified Chinese first, with concise English equivalents for titles and key summaries where useful.

For the complete schema and validation expectations, read `references/data-schema.md`.

## Agent Research Procedure

When no structured JSON has been provided, run the research loop manually in the current agent:

1. Read `config/industry.yaml`, `config/sources.yaml`, `config/keywords.yaml`, `config/kol.js`, `config/conversation_radar.yaml`, `config/research_radar.yaml`, `config/runtime.yaml`, `config/workbench.js`, and optional `config/workbench.user.js`. Run `python3 scripts/research_trace.py init --date YYYY-MM-DD --mode scheduled` before searching. Then run `python3 scripts/rss_fetch.py --date YYYY-MM-DD --record` when RSS is enabled. Save every raw or normalized query result under the run's `evidence/` directory and register it with its real native search window; a query without an artifact, run id, and native search window did not happen.
2. Run the conversation-radar pass before checking fixed sources or filling dimensions:
   - Start with four open-trend lanes: global AI, visual/multimodal models, AI x Web3, and AI x finance. The first pass may not name a fixed KOL, core lab, or expected model; it exists to learn what people are discussing today.
   - Search broad recent debates first with the search provider's native recency filter: seven days for discovery and three days for recovery. Writing `recent`, `latest`, or a month name in the query is not a recency filter.
   - Complete all twelve mandatory groups before strategic lenses: the four open-trend lanes, community hotspots, access/quota/subscription changes, Chinese frontier-model launches, X viewpoints, domestic-lab models, domestic-lab product operations, domestic-lab research, and dynamic KOL viewpoints.
   - Always scan the strategic lenses in `config/conversation_radar.yaml`, including how AI enters organizations / enterprise AI and AGI / frontier AI governance.
   - Extract newly named people, articles, terms, organizations, counterarguments, and case studies from the broad pass, then issue focused follow-up queries.
   - Build 3-5 topic clusters with at least two independent sources each. A topic cluster is the editorial unit; the five dimensions are presentation buckets, not search silos.
3. Run the research-radar pass:
   - Researcher longform / X Articles: especially Anthropic Claude Code and OpenAI/alignment researchers.
   - Official research pages: Anthropic Research, OpenAI Research, OpenAI Alignment, Google DeepMind Research.
   - Check all eight core Chinese labs every day: Qwen, DeepSeek, Kimi/Moonshot, Z.ai/GLM, ByteDance Seed/Doubao, Tencent Hunyuan, Baidu ERNIE, and MiniMax. Rotate StepFun, Huawei Pangu, InternLM, Meituan LongCat, Xiaomi MiMo, and InclusionAI as the extended pool.
   - Scan three activity tracks separately for every lab: `model_release`, `product_ops`, and `research`. A model preview, API/product availability, pricing/quota/capacity change, and paper/technical report are different events and must not overwrite one another.
   - Run the independent frontier visual-model watchlist for Black Forest Labs, Runway, Luma, and Kling. Treat image, video, audio, and action-prediction releases as a first-class lane rather than relying on the domestic-lab sweep.
   - Distinguish announcement, preview, API availability, and released weights. Never turn "open weights soon" into "weights released".
   - Open-source finance/quant agents: discover from X discussion plus GitHub topics, not GitHub stars alone.
4. Use the full KOL list as a watch pool, then expand from each emerging topic's exact model name, article title, coined term, evaluator, and counterargument. Select 4-10 actual recent viewpoints; the static list must not cap discovery.
5. Verify X evidence under the run mode:
   - Run `gate-cli preflight --format json`, then execute at least three Gate CLI `news feed search-x` queries and retain their raw JSON. Gate CLI is discovery only.
   - Save each `search-x --format json` result and run `python3 scripts/validate_x_candidates.py <result.json>`. Discard the entire synthesized result when the validator fails, even if `summary` or `content` is non-empty.
   - When Gate validation fails because there are no cited posts, continue with public web search using the emerging topic term plus `site:x.com`. Do not stop the KOL track at the provider failure.
   - Ordinary web search must not use `since:` or `filter:`. Those are X-site operators, not web-search recency filters.
   - A public-index X result counts only when its normalized artifact contains the exact query, author, published timestamp, at least 20 characters of attributable post text, and a concrete status/article URL. A bare URL is discovery only. If Gate has fewer than four cited posts and the public index has fewer than six attributable posts from the last seven days, `config/runtime.yaml` requires at least four and at most six X-site searches with at least ten seconds between them. Read the first viewport only, retain at most eight results per query, and do not scroll or perform any account action. If the first snapshot is only Loading, wait for the search timeline/article or up to three seconds and take one more snapshot before marking it empty.
   - Accept only a concrete `x.com/<handle>/status/<digits>` or `x.com/i/article/<digits>` URL with visible author, timestamp, and attributable text; record `provider: x-browser`, `verification_level: direct_page`. A URL without attributable post text does not count.
   - Treat profile, `with_replies`, search, and home URLs as navigation aids only. Never publish them as digest items or count them as X evidence.
   - When an X Article body is login-gated, preserve the X post/article URL and use an author-owned blog, Substack, or official mirror for readable body evidence; never bypass the login wall.
6. Target at least 60% of KOL-view items with verified concrete X post/article evidence and at least four KOL-view items total. Discover at least ten dynamic candidates, select at least three `discovery_mode: topic_expansion` viewpoints, and select at least two people outside the maintained watchlist. Across major topics, require at least two originator + independent-evaluation pairs and at least one counterpoint. Record `viewpoint_role` as `originator`, `independent_evaluation`, `counterpoint`, or `context`. If this cannot be reached, do not manufacture monitoring placeholders. Let validation fail visibly, but still retain fully researched lab, paper, open-source, and finance items; never replace the entire digest with `items: []` because X failed.
7. Build five presentation tracks: AI labs, KOL views, papers, open source, and AI x finance. Map each selected item back to a discovered topic cluster.
8. Enforce freshness before editorial polish:
   - Target at least 65% of items published within 7 days and at least five items within 72 hours.
   - Use sources older than 7 days only as `recency_role: background`, with a specific `why_now` tied to a fresh catalyst.
   - Do not publish sources older than 30 days as standalone daily items.
   - Read the previous seven digests and reject repeated URLs or near-identical titles unless `repeat_update: true` and `new_evidence` explains the material update.
   - Require article-level deep links. Generic research indexes, topic pages, profiles, and search-result pages are not item sources.
   - Before writing canonical JSON, calculate candidate freshness. If there are fewer than five candidates from the last 72 hours or fewer than 65% from the last seven days, run at least six additional native-recency searches: at least two with a three-day window, plus the required browser fallback when recent X evidence is insufficient. Record those run ids in `coverage_report.freshness_pipeline` and recalculate once; do not fill the gap with old sources.
9. Prefer primary sources: official articles, research pages, arXiv, GitHub releases, Hugging Face model cards, project docs, concrete X posts/articles, and then reputable media.
10. Filter aggressively: remove marketing, duplicated reposts, job posts, unverifiable claims, stale filler, source-monitoring notes, and items included only to fill a dimension. Do not drop a high-signal recent researcher article merely because it is not viral yet.
11. For longform or research items, set `content_type` and usually `depth: deep`. Include `detail`, `key_points`, `examples`, `product_implications`, and `limitations` so the dashboard is useful without opening the source.
12. Finalize the trace with `python3 scripts/research_trace.py finalize --date YYYY-MM-DD`. It must contain all twelve query groups, the configured per-lane query and attributable-candidate floors, at least three X-oriented open-trend runs, at least three actual Gate X runs, the required fallback runs when Gate has fewer than four cited posts, and 24 lab/track checks (eight core labs times three tracks).
13. Write a temporary canonical JSON file matching `references/data-schema.md`. Set root `quality_version` to `6`, include `coverage_report.trace_path`, add trace-backed `run_ids` to every query group, and include `trend_pipeline`, `freshness_pipeline.recovery_triggered`, and `recovery_run_ids`. Record item-level `topic_origin`, `trend_lane`, `recency_role`, `topic_cluster`, and `evidence` metadata. Lab items require `lab_activity_type`; KOL items require `discovery_mode` and `viewpoint_role`. Every hot topic requires `trend_lane`, `why_now`, and `debate`.
14. Convert it into dashboard format:
   - `python3 scripts/run_daily.py --date YYYY-MM-DD --from-json /path/to/digest.json --publish-on-valid`
15. Validate and serve locally. Do not push when the trace or quality validator reports an error.

## Scheduling

Use `scripts/install_schedule.py` for local schedules. On macOS it writes a LaunchAgent. On Linux it writes a marked crontab line. The scheduled script is intentionally local-first and reads `config/runtime.yaml`, dashboard-managed `config/workbench.user.js`, and environment variables.

Keep schedule setup separate from account setup. A schedule may run without X login, API keys, or push bots; it should create a research prompt or validate existing data rather than failing destructively.

## Push Safety

Push only after the user enables a managed push target or configures the legacy `config/push.yaml`. Managed targets store environment-variable names only; real webhook values stay local. Do not commit real webhook URLs. For Lark/Feishu, `scripts/push_lark.py` uses only the Python standard library and sends an interactive card.

## Useful Resources

- `references/data-schema.md` - Digest schema and canonical JSON format.
- `references/source-providers.md` - Public web, Chrome, extension, API, and fallback provider strategy.
- `config/conversation_radar.yaml` - Topic discovery, freshness, evidence, and anti-placeholder quality policy.
- `config/research_radar.yaml` - Researcher longform, lab research, Chinese frontier lab, and finance/quant agent radar.
- `scripts/validate_x_candidates.py` - Reject Gate CLI summaries without concrete tweet/article evidence before browser verification.
- `scripts/research_trace.py` - Record and verify query-level source runs and raw evidence.
- `scripts/rss_fetch.py` - Collect configured RSS/Atom feeds into per-source trace artifacts.
- `docs/调研方法论与Loop设计.md` - Product and research methodology.
