# Changelog

## Unreleased

## 0.4.0 - 2026-07-24

Full release notes: [`docs/releases/v0.4.0.md`](docs/releases/v0.4.0.md)

- Add project-backed configuration tabs for maintaining KOL authors and Lark/Feishu push targets, including search, filters, pagination, CRUD, local handoff, and environment-variable-only secret resolution.
- Add four mandatory open-trend lanes for global AI, visual/multimodal models, AI x Web3, and AI x finance before fixed watchlist sweeps; add Black Forest Labs, Runway, Luma, and Kling as an independent frontier visual-model radar.
- Add `quality_version: 6` and trace schema v3 checks for attributable trend candidates, source diversity, off-watchlist KOL discovery, trend-selected items, and concrete `why_now` / debate fields.
- Enrich bot cards with featured new signals, explanations, and fuller dimension summaries while preserving fail-closed `primary_only` delivery.
- Add dashboard configuration and RSS source management with browser persistence, import/export, and a local `workbench.user.js` handoff to scheduled agents.
- Add six verified default RSS/Atom subscriptions and a failure-isolated `rss_fetch.py` collector that records one `rss-feed` evidence artifact per source.
- Make runtime and quality validation read the effective dashboard configuration, and make the weekday automation collect RSS before web/X research.
- Require attributable, dated X evidence in trace schema v2; bare status URLs no longer count as verified public-index or browser posts.
- Force bounded browser fallback when Gate and public search do not produce enough attributable posts from the last seven days.
- Add native-recency query windows and a six-query freshness recovery loop before a scheduled run may stop for stale candidates.
- Make the Lark push CLI reject unknown arguments and handle `--help` without entering the delivery path.
- Make scheduled research resumable across context compaction and forbid finalizing from an incomplete X-only checkpoint.

## 0.3.0 - 2026-07-22

Full release notes: [`docs/releases/v0.3.0.md`](docs/releases/v0.3.0.md)

- Added `research_trace.json` and `scripts/research_trace.py` so every query group, provider count, candidate total, and domestic-lab track must be backed by a raw or normalized evidence artifact.
- Added `quality_version: 5` validation that rejects untraceable `completed` claims, invented candidate counts, missing eight-lab × three-track checks, and empty digests caused by an X-only failure.
- Changed the X fallback order to Gate candidate discovery → public index → locally configured limited read-only browser search. Scheduled browser use is capped at six first-viewport queries with no scrolling or account actions and stops on any challenge.
- Removed X-only `since:`/`filter:` operators from ordinary web-search templates and reserved them for X's own search surface.
- Required non-X dimensions to remain populated when KOL evidence is insufficient, preserving useful lab, paper, open-source, and finance research for diagnosis.
- Scoped combined evidence artifacts to their exact query so one result set cannot be counted by multiple trace runs.

## 0.2.0 - 2026-07-21

Full release notes: [`docs/releases/v0.2.0.md`](docs/releases/v0.2.0.md)

- Expanded the domestic AI lab radar to eight daily core vendors (Qwen, DeepSeek, Kimi, Z.ai, ByteDance Seed, Tencent Hunyuan, Baidu ERNIE, and MiniMax) plus six rotating vendors.
- Split lab monitoring into required `model_release`, `product_ops`, and `research` tracks so model announcements cannot hide pricing, quota, capacity, developer-tool, or paper updates.
- Added Qwen official X, Qwen Code updates, and Token Plan documentation; upgraded Qwen3.8 and future model-preview queries to high priority while distinguishing previews from released weights.
- Expanded the default KOL seed list from 61 to 69 and added topic-driven discovery with originator, independent-evaluation, and counterpoint roles.
- Added `quality_version: 4` validation with eight mandatory coverage groups, eight-lab completion records, three lab activity tracks, and dynamic viewpoint quotas.
- Rebuilt the 2026-07-21 digest with Qwen3.8, Qwen Code product updates, open-weight deployability debate, and the Graph Engineering vs Loop Engineering discussion.

## 0.1.9 - 2026-07-21

- Added a fail-closed `primary_only` push policy so scheduled runs send only the explicitly selected primary bot even when additional local webhooks remain configured.
- Blocked command-line webhook replacement under `primary_only` unless a manual run explicitly passes `--allow-target-override`.
- Removed webhook token fragments from push logs; dry runs and delivery logs now show only an opaque configured-target label.

## 0.1.8 - 2026-07-21

- Added mandatory community-pulse coverage for emerging AI topics, quota/subscription/pricing/capacity changes, Chinese frontier-model launches, and concrete X viewpoints.
- Added a public-web X fallback when Gate CLI returns summaries without cited posts; scheduled runs can use a concrete indexed post only with author, date, attributable excerpt, and explicit `public_index` evidence metadata.
- Added `quality_version: 3` and `coverage_report` validation so every mandatory query group records actual searches, candidate counts, selections or rejection reasons, plus Gate/public-index/browser pipeline counts.
- Added `--publish-on-valid` so failed digests remain available for debugging but do not advance the dashboard manifest or trigger pushes.
- Expanded Kimi/Moonshot, OpenAI Help/Status, and product-entitlement sources and keywords, including Kimi K3 and Codex quota/reset discussions.

## 0.1.7 - 2026-07-20

- Restricted browser-based X access to explicit interactive spot checks; scheduled or unattended runs must use public web search, Gate CLI, or an official API and must not script a logged-in X session.
- Added runtime flags and provider documentation for stopping on login walls, CAPTCHA, or safety interstitials.
- Tightened Gate CLI candidate validation so short or sequential placeholder numeric IDs are rejected.

## 0.1.6 - 2026-07-20

- Added `config/conversation_radar.yaml` so each run discovers recent cross-source debates before filling the five dashboard dimensions; default strategic lenses include enterprise AI adoption / organizational change and frontier AI / AGI governance.
- Changed X collection from profile-level monitoring to concrete-post evidence: profiles, `with_replies`, search pages, and home pages no longer count as KOL viewpoints.
- Added `scripts/validate_x_candidates.py` to reject Gate CLI `search-x` summaries when tweet/article citations are empty, malformed, placeholders, or not concrete numeric X URLs.
- Upgraded `validate_digest.py` with `quality_version: 2` gates for 72-hour/7-day freshness, old-background limits, generic source-index rejection, concrete X post ratios, browser-verification metadata, topic clusters, and seven-day cross-run deduplication.
- Expanded the default KOL seed list from 59 to 61 with enterprise AI / organizational-workflow voices, and added Demis Hassabis to the frontier longform radar.
- Updated the daily research prompt and provider documentation so Gate CLI is candidate discovery, browser verification is the final X evidence step, and low-quality dimensions fail visibly instead of being filled with monitoring placeholders.

## 0.1.5 - 2026-07-20

- Upgraded the dashboard archive view to render newest days first.
- Added archive-level filters for dimension, heat, and keyword search.
- Added archive pagination and page-size controls to keep long history lists usable.

## 0.1.4 - 2026-07-15

- Added per-bot Lark/Feishu enable switches such as `DAILY_INTEL_LARK_WEBHOOK_2_ENABLED=false`, so a local webhook can stay configured while being skipped by daily scheduled pushes.

## 0.1.3 - 2026-07-09

- Added `config/research_radar.yaml` as a mandatory discovery layer before generic daily search. It tracks researcher X Articles / longform, Anthropic Research, OpenAI Research / Alignment, DeepSeek, Kimi/Moonshot, Z.ai/GLM, Qwen, and finance/quant agent repositories.
- Upgraded `sources.yaml`, `keywords.yaml`, `industry.yaml`, and `kol.yaml` so high-value research posts, Chinese frontier-lab model cards, technical reports, and AI finance/quant agent projects are prioritized.
- Expanded the default KOL seed list from 55 to 59 entries, adding `@trq212`, `@OpenAI`, `@jietang`, and `@Kimi_Moonshot`.
- Extended the digest schema with `content_type`, `depth`, `key_points`, `examples`, `product_implications`, and `limitations` for longform/research items.
- Updated `run_daily.py` prompts to require the research-radar pass and deep longform summaries before writing canonical JSON.
- Updated `validate_digest.py` to warn when a digest has no research-radar hits, has short deep-item details, or lacks finance/quant OSS coverage while AI+finance/AI+crypto anchors are active.
- Updated `index.html` to render key points, examples, product implications, and limitations in item detail modals.

## 0.1.2 - 2026-07-02

- Added X-first KOL research rules: the KOL views track should first search public X status/profile URLs, configured X providers, and Gate-News `news_feed_search_x` before falling back to newsletters or blogs.
- Added `kol_x_sources` validation so generated digests warn when KOL-view items are not backed by enough X evidence.
- Added optional multi-bot Lark/Feishu push support through local environment variables, plus `--dry-run` and masked webhook logging.
- Declared Gate-News as the recommended dependency for X/Twitter discussion aggregation.
- Shipped the 55-person default KOL seed list in `config/kol.yaml` for out-of-the-box tracking.
