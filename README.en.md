# Daily Intelligence Workbench

[English](README.md) | [中文](README.zh-CN.md)

Daily Intelligence Workbench is a **local-first, open-source deployable** workflow for daily AI industry intelligence. It combines configurable sources, X-first KOL tracking, an emerging-conversation radar, a research radar for researcher longform and lab papers, industry anchors, agent-assisted research, structured digests, a local HTML dashboard, bot pushes, output-language selection, and local schedules.

Any agent runtime that can read a skill/instruction file, run local scripts, and trigger or install scheduled tasks can use this repository to initialize a workspace, produce daily intelligence, refresh the dashboard, and optionally push summaries to a bot.

![English dashboard](assets/screenshots/dashboard-en.png)

Supported environments:

- Codex: install or open as a local plugin using `.codex-plugin/plugin.json` and `skills/`.
- Claude Code: run as a local repository workflow using `CLAUDE.md` and `skills/daily-intelligence-workbench/SKILL.md`.
- Plain local Python: Python 3 standard library is enough for the dashboard, validation, push, and scheduling scripts.

> The open-source default does not include any personal webhook, cookie, token, or account state. X/Twitter login state, API keys, and push bots are configured locally by each user.

> The default KOL seed list is included in `config/kol.yaml` with 69 AI researchers, lab leads, AI engineering voices, open-source/model builders, evaluation/safety accounts, AI x crypto voices, and Chinese-language AI commentators. It is a watch pool rather than a discovery ceiling: every run also expands from the day's exact topics, originators, evaluators, and counterarguments.

> `config/conversation_radar.yaml` first runs eight mandatory coverage groups, including separate domestic-lab model, product-operations, and research tracks plus dynamic KOL discovery. `config/research_radar.yaml` then scans researcher X Articles, frontier-lab research, model cards, technical reports, and finance/quant agent repositories.

---

## Repository Layout

```text
ai-intel-workbench/
├── .codex-plugin/plugin.json
├── AGENTS.md
├── CLAUDE.md
├── index.html
├── config/
│   ├── industry.yaml
│   ├── sources.yaml
│   ├── keywords.yaml
│   ├── kol.yaml
│   ├── conversation_radar.yaml
│   ├── research_radar.yaml
│   ├── push.yaml
│   ├── runtime.yaml
│   └── secrets.example.env
├── data/
│   ├── manifest.js
│   └── 2026/06/29/digest.js
├── docs/
│   └── 调研方法论与Loop设计.md
├── scripts/
│   ├── init.py
│   ├── run_daily.py
│   ├── validate_digest.py
│   ├── serve.py
│   ├── push_lark.py
│   └── install_schedule.py
└── skills/
    └── daily-intelligence-workbench/
```

---

## Quick Start

```bash
git clone https://github.com/weishao831/ai-intel-workbench.git
cd ai-intel-workbench

# Initialize anchors, output language, bot, port, and optional agent command.
python3 scripts/init.py

# Non-interactive example.
python3 scripts/init.py --anchors ai-crypto,ai-finance --language en --bot none

# Start the local dashboard.
python3 scripts/serve.py --port 4318
# Open http://127.0.0.1:4318/

# Validate bundled sample data.
python3 scripts/validate_digest.py --date latest

# Generate today's research task.
python3 scripts/run_daily.py --date today
```

If no agent command is configured, `run_daily.py` writes:

```text
.daily-intel/runs/YYYY-MM-DD/research_prompt.md
```

Give that prompt to Codex or Claude Code. The agent should research, produce canonical JSON, and write it back with `run_daily.py --from-json`.

---

## Output Language

Choose the user-facing digest language during initialization:

```bash
python3 scripts/init.py --language zh
python3 scripts/init.py --language en
python3 scripts/init.py --language bilingual
```

Or edit `config/runtime.yaml`:

```yaml
output_language: en        # zh | en | bilingual
```

Override per run:

```bash
python3 scripts/run_daily.py --date today --language en
```

Language modes:

- `zh`: Simplified Chinese output; technical terms, company names, project names, and URLs stay in their original form.
- `en`: English output; source names, project names, tickers, and URLs stay unchanged.
- `bilingual`: Chinese-first bilingual output, with concise English equivalents for titles and key summaries where useful.

---

## Research Radar and Deep Summaries

Some of the most valuable AI research signals do not look like ordinary news. They may be researcher X Articles, Anthropic Research posts, OpenAI Alignment notes, Hugging Face model cards, GitHub technical reports, or Chinese frontier-lab project pages.

The workflow reads `config/research_radar.yaml` before generic news search:

- `researcher_longform_watchlist`: researcher X Articles and longform posts.
- `lab_research_watchlist`: Anthropic Research, OpenAI Research, OpenAI Alignment, Google DeepMind Research.
- `chinese_frontier_lab_watchlist`: daily checks for Qwen, DeepSeek, Kimi/Moonshot, Z.ai/GLM, ByteDance Seed/Doubao, Tencent Hunyuan, Baidu ERNIE, and MiniMax, plus an extended rotating pool.
- `domestic_lab_scan_policy`: scans model releases, product operations, and papers/research as separate activity tracks.
- `open_source_finance_quant_watchlist`: finance agents, quant agents, AI stock-research agents, backtesting and broker/exchange integrations.

For important longform or research items, the digest should set `content_type`, `depth: deep`, `key_points`, `examples`, `product_implications`, and `limitations`. The dashboard renders these fields so the user can understand most of the article without opening the original source.

---

## Codex Usage

The repository contains:

```text
.codex-plugin/plugin.json
skills/daily-intelligence-workbench/SKILL.md
```

Starter prompts:

- Initialize the daily intelligence workbench
- Set up AI Intel Workbench for AI + finance, English output, and schedule your daily run
- Track AI + crypto and AI + finance every morning at 08:30, then push to Lark if configured
- Generate today's AI intelligence digest
- Install the daily schedule
- Configure the X/Twitter provider

Codex should read `skills/daily-intelligence-workbench/SKILL.md` before running scripts.

### Natural-Language Setup

You do not need to memorize the Python commands. You can ask an agent directly:

```text
Set up AI Intel Workbench for AI + crypto and AI + finance, use English output, do not push yet, and schedule your daily run at 08:30.
```

Or:

```text
Initialize this workbench, track AI + finance, push to Lark if a webhook is configured, and run it every weekday morning.
```

The agent should read the skill, initialize configuration, write industry anchors, set output language, decide whether push is enabled, and create an agent-native recurring task when the current host supports it. If native agent scheduling is unavailable, it should install a local launchd / cron schedule through `scripts/install_schedule.py`.

---

## Claude Code Usage

Open Claude Code in the repository root:

```bash
cd ai-intel-workbench
claude
```

Ask Claude Code to read:

```text
CLAUDE.md
skills/daily-intelligence-workbench/SKILL.md
docs/调研方法论与Loop设计.md
```

Optional scheduled agent command in `config/runtime.yaml`:

```yaml
agent_command: claude -p "$(cat {prompt})"
```

Placeholders:

- `{date}`: date in `YYYY-MM-DD`
- `{root}`: workbench root directory
- `{prompt}`: generated research prompt path

---

## X/Twitter Provider Strategy

The open-source workflow does not depend on a user's Chrome login state by default.

For the KOL views track, the research loop is X-first. Gate CLI `news feed search-x` is candidate discovery only: save its JSON and run `scripts/validate_x_candidates.py`. If it returns no cited posts, continue with public `site:x.com` indexing instead of stopping the track. Interactive runs can browser-verify a small final set; scheduled runs may use an indexed concrete post only when the author, date, and attributable excerpt are visible. Profiles, `with_replies`, home pages, and search pages are never counted as viewpoints. The digest validator reports coverage, `kol_verified_x_posts`, freshness, and seven-day repetition.

Default provider:

- Public web search / source discovery
- Official blogs, arXiv, GitHub, Hugging Face, reputable media
- Public X status pages
- Public X profile pages

Optional providers:

- User-owned local Chrome or browser extension session
- X API or third-party data APIs
- Gate CLI `news feed search-x` for candidate discovery; results still require `validate_x_candidates.py` and browser verification
- User-supplied CSV/JSON/bookmark exports

Safety rules:

- Do not read, export, or commit cookies, localStorage, session tokens, passwords, or API keys.
- Do not follow, like, post, DM, solve CAPTCHAs, or bypass safety barriers.
- Do not promise "anti-ban" behavior. Use low-frequency, read-only, user-owned access with graceful fallback.

See `skills/daily-intelligence-workbench/references/source-providers.md`.

---

## Daily Run

Create only the research prompt:

```bash
python3 scripts/run_daily.py --date today
```

Write a digest from canonical JSON:

```bash
python3 scripts/run_daily.py --date 2026-06-30 --from-json /path/to/digest.json
python3 scripts/validate_digest.py --date 2026-06-30
```

Smoke test with bundled sample data:

```bash
python3 scripts/run_daily.py --date today --sample
```

Push after generation:

```bash
export DAILY_INTEL_LARK_WEBHOOK="https://open.larksuite.com/open-apis/bot/v2/hook/xxx"
python3 scripts/run_daily.py --date today --push
```

Multiple local bot targets can remain configured without committing webhooks. With `target_policy: primary_only` in `config/push.yaml`, scheduled runs send only the bot named by `primary_target_key`; numbered targets are retained but not sent automatically:

```bash
export DAILY_INTEL_LARK_WEBHOOK_1="https://open.larksuite.com/open-apis/bot/v2/hook/xxx"
export DAILY_INTEL_LARK_WEBHOOK_2="https://open.larksuite.com/open-apis/bot/v2/hook/yyy"
python3 scripts/push_lark.py 2026/06/29 --dry-run
```

---

## Schedule

macOS uses LaunchAgent. Linux uses crontab.

```bash
python3 scripts/install_schedule.py install --time 08:30
python3 scripts/install_schedule.py install --time 08:30 --push
python3 scripts/install_schedule.py status
python3 scripts/install_schedule.py uninstall
```

The scheduled task runs:

```bash
python3 scripts/run_daily.py --date today
```

If `agent_command` is configured, the generated prompt is handed to that command.

---

## Push Bot

Edit `config/push.yaml`:

```yaml
enabled: true
bot_type: lark
webhook: https://open.larksuite.com/open-apis/bot/v2/hook/xxx
```

Before publishing, keep:

```yaml
enabled: false
webhook: ""
```

---

## Data Contract

Daily digest:

```text
data/YYYY/MM/DD/digest.js
```

Manifest:

```text
data/manifest.js
```

Canonical JSON schema:

```text
skills/daily-intelligence-workbench/references/data-schema.md
```

---

## Disclaimer

This project provides information aggregation and assisted analysis only. It is not investment advice. AI x finance and AI x trading content should be independently verified. Each item should preserve source URL, date, and confidence notes.
