# Source Provider Strategy

The workbench is designed for open-source distribution, so source collection must not depend on a single user's browser session.

## Provider Tiers

### Tier 0: Public Web Provider

Use by default.

- Search the open web for source URLs.
- Read official blogs, arXiv, GitHub, Hugging Face, project docs, reputable media, and public X status pages. Use public profiles only to discover concrete posts.
- Treat X search as best-effort because it often redirects to login.
- Cache discovered URLs and avoid repeated requests.

### Tier 1: Local Browser Provider

Use only when the user opts in.

- Read public pages through a local browser session.
- If a Chrome/extension bridge is available, it may reuse the user's logged-in X session.
- Do not read cookies, local storage, passwords, or account settings.
- Do not follow, like, post, send messages, solve CAPTCHAs, or bypass safety interstitials.

### Tier 2: Official API Provider

Use when the user provides credentials.

- X API, news APIs, financial data APIs, or other paid/free API sources may be configured in local env files.
- Store API keys outside version-controlled files.
- Record rate-limit and coverage limitations in the digest.

### Tier 3: User-Supplied Export Provider

Use when the user supplies CSV/JSON/bookmarks.

- Accept local files under a configured workspace.
- Normalize into the canonical digest JSON schema.

## X/Twitter Notes

Observed behavior in Codex's in-app browser:

- Public status pages can expose post text, author, timestamp, view count, quoted post snippets, and links without login.
- Public profiles can expose biography, follower counts, pinned posts, recent post snippets, reposts, and status URLs.
- X search can redirect to the login/onboarding page without a logged-in provider.

Design implications:

- Discover X URLs via web search, RSS-like third-party sources, curated KOL handles, or configured provider APIs. For each major topic, search the exact model/product name, article title, coined term, evaluator, and counterargument; the curated KOL list is not a discovery ceiling.
- Use Gate CLI `news feed search-x` as a candidate-discovery provider, not as self-validating evidence. Require non-empty `cited_tweets`/`items` and reject placeholder or example URLs.
- Discard a Gate CLI result when `summary`/`content` is non-empty but `cited_tweets` and `items` are empty. A fluent synthesis without tweet-level evidence is not a usable source.
- A discarded Gate result must trigger a public-web fallback, not end X discovery. Search the emerging topic with `site:x.com` and require a concrete status/article URL plus visible indexed author, date, and attributable post text.
- Read the final concrete status/article URL as a public page whenever possible. Verify visible author, timestamp, post/article title or text, and a stable numeric status/article id.
- Treat `x.com/<handle>`, `/with_replies`, `/search`, and home pages as discovery surfaces only. They are not viewpoints and must not be stored as digest items or counted toward X coverage.
- For the KOL views dimension, run X discovery before newsletter/blog fallbacks. A healthy daily digest should normally have a majority of KOL-view items backed by concrete `x.com/.../status/<digits>` or `x.com/i/article/<digits>` evidence, plus explicit originator, independent-evaluation, and counterpoint roles for the day's major topics.
- In scheduled runs, a public index result may count as X evidence only when it includes a concrete URL, author, date, and text excerpt. Mark it `verification_level=public_index`; never label it browser-verified.
- If all providers return only aggregate summaries, keep the aggregate in the coverage report as a rejected candidate, not as a digest viewpoint.
- Keep Chrome login-state access optional and local; it is for explicit interactive spot checks, not unattended collection.
- When `config/runtime.yaml` enables `scheduled_limited_readonly`, a scheduled run may perform at most six low-frequency X searches through the user's local browser. Read the first viewport only, retain at most eight results, never scroll or perform account actions, and stop on any login wall, CAPTCHA, or challenge.
- Do not describe this as ban-proof or anti-ban. It is a small, read-only, user-owned access pattern with no guarantee from X.
- Do not use X-only syntax such as `since:` or `filter:` in ordinary web-search queries. Use native recency/domain filters there; reserve X operators for X's own search box.
- Persist every Gate, public-index, and browser query as a trace artifact. A provider count without a matching `research_trace.json` run is invalid.
- Avoid any promise of "anti-ban" behavior. Use low-frequency, read-only, user-owned access and graceful fallbacks. Stop on login walls, CAPTCHA, or safety interstitials.

### Browser verification checklist

Before selecting an X item, verify all of the following:

- The final URL resolves to a concrete numeric status or article id.
- The visible author matches the claimed author or organization.
- The visible timestamp is inside the stated freshness window.
- The visible text/title supports the summary; do not infer a viewpoint from a profile bio or pinned navigation page.
- The URL is not a placeholder such as `example`, `123456`, a search URL, or a generic profile/replies page.

When an X Article opens only a login screen, keep its public status card as provenance and find an author-owned readable copy (for example an official site or Substack). Record the readable copy as supporting evidence rather than replacing the author attribution with a secondary summary.

## Research Radar Notes

Some of the most valuable daily AI signals are not published as normal product news. They appear as:

- X Articles by researchers or engineers.
- Official research pages outside a company blog, such as `anthropic.com/research`.
- Alignment or safety sub-sites, such as `alignment.openai.com`.
- Hugging Face model cards and GitHub technical-report repositories from frontier labs.
- Project pages from core Chinese labs: Qwen, DeepSeek, Kimi/Moonshot, Z.ai/GLM, ByteDance Seed/Doubao, Tencent Hunyuan, Baidu ERNIE, and MiniMax, plus the configured extended rotation.

Provider discipline:

- Run `config/research_radar.yaml` before generic news search.
- Treat official research pages, model cards, and GitHub technical reports as primary sources.
- For X Articles, keep the public article/status URL in `url` or `x_src`; if only a search snippet is reachable, mark the limitation in `dimensions[].notes`.
- For Chinese frontier labs, scan both English and Chinese terms. Run model release, product operations, and paper/research queries separately. Many useful releases are model-card, repository, product-doc, pricing, quota, or changelog updates rather than press releases.
- Distinguish an announcement, hosted preview, API/product rollout, and released weights. Store only the stage supported by the primary source.
- For OpenAI, scan both `openai.com/research` and `alignment.openai.com`; important alignment articles may not appear on the normal product blog.
- For Anthropic, scan `anthropic.com/research` in addition to `anthropic.com/news`.

Longform handling:

- Do not treat a long article as a normal tweet.
- If a source is a long article, official research note, technical report, or model card, set `content_type` and usually `depth: deep`.
- The item should include enough `detail`, `key_points`, examples, implications, and limitations for the dashboard to be useful without opening the original page.
