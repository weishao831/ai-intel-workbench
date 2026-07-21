# AI Intel Workbench

[English](README.md) | [中文](README.zh-CN.md)

AI Intel Workbench is a **local-first, open-source daily intelligence workflow for agents**. It helps Codex, Claude Code, or any skill-capable agent collect and structure daily AI + user-defined industry signals, then review them in a visual local dashboard.

Use it to track AI lab updates, X-first KOL opinions, frontier papers, open-source projects, and AI x finance / crypto / any configured industry. It includes configurable sources, a 69-person default KOL seed list, a conversation radar for emerging debates, a research radar for researcher longform and lab papers, industry anchors, structured digests, output-language selection, a zero-dependency HTML workbench, optional Lark/Feishu bot pushes, and local scheduled runs.

![English dashboard](assets/screenshots/dashboard-en.png)

## What It Does

- Builds a visual local dashboard for daily AI + industry intelligence.
- Lets users define industry anchors such as AI + crypto, AI + finance, AI + healthcare, or AI + robotics.
- Produces structured daily digest files that are easy for agents to write, validate, archive, and reuse.
- Supports Chinese, English, or bilingual output.
- Works as a Codex local plugin, a Claude Code repository workflow, or plain local Python scripts.
- Supports optional Lark/Feishu push bots and local scheduling through macOS LaunchAgent or Linux cron.
- Runs `config/conversation_radar.yaml` before fixed dimensions to discover recent debates such as enterprise AI adoption and frontier AI / AGI governance.
- Runs eight mandatory coverage groups, including separate domestic-lab model, product-operations, and research tracks plus dynamic viewpoint discovery.
- Uses X-first KOL tracking by default. Gate CLI `news feed search-x` is candidate discovery only; failed Gate results fall back to public indexed concrete posts, while interactive runs may browser-verify a small final set.
- Records a `coverage_report` so an empty provider result cannot be mistaken for “there were no viewpoints,” requires originator/evaluator/counterpoint coverage for major topics, and publishes the manifest only after validation succeeds.
- Runs `config/research_radar.yaml` before generic search to catch researcher X Articles, Anthropic/OpenAI research posts, Chinese frontier-lab model cards, and finance/quant agent repositories.

No personal webhook, cookie, token, API key, or X/Twitter session state is committed by default.

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

Give that prompt to Codex, Claude Code, or another agent runtime. The agent should research, produce canonical JSON, and write it back with `run_daily.py --from-json`.

## Output Language

```bash
python3 scripts/init.py --language zh
python3 scripts/init.py --language en
python3 scripts/init.py --language bilingual

python3 scripts/run_daily.py --date today --language en
```

Language modes:

- `zh`: Simplified Chinese output.
- `en`: English output.
- `bilingual`: Chinese-first bilingual output.

The dashboard UI can also be opened as:

```text
http://127.0.0.1:4318/?lang=en
http://127.0.0.1:4318/?lang=zh
```

## Research Radar and Deep Summaries

Daily AI research is often published outside ordinary company blogs: researcher X Articles, Anthropic Research, OpenAI Alignment, Hugging Face model cards, GitHub technical reports, or Chinese frontier-lab project pages.

`config/research_radar.yaml` makes these sources first-class:

- `researcher_longform_watchlist`: researcher X Articles and longform posts.
- `lab_research_watchlist`: Anthropic Research, OpenAI Research, OpenAI Alignment, Google DeepMind Research.
- `chinese_frontier_lab_watchlist`: daily checks for Qwen, DeepSeek, Kimi/Moonshot, Z.ai/GLM, ByteDance Seed/Doubao, Tencent Hunyuan, Baidu ERNIE, and MiniMax, plus an extended rotating pool.
- `domestic_lab_scan_policy`: scans model releases, product operations, and papers/research as separate activity tracks.
- `open_source_finance_quant_watchlist`: finance agents, quant agents, AI stock-research agents, backtesting and broker/exchange integrations.

For important longform or research items, agents should set `content_type`, `depth: deep`, `key_points`, `examples`, `product_implications`, and `limitations`. The dashboard is designed to show enough structure that users can understand most of the original article without opening it.

## Agent Usage

Any agent runtime that can read a skill or instruction file, run local scripts, and trigger or install scheduled tasks can use this repository.

You can also set it up through natural language. For example:

```text
Set up AI Intel Workbench for AI + crypto and AI + finance, use English output, do not push yet, and schedule your daily run at 08:30.
```

```text
Initialize this workbench, track AI + finance, push to Lark if a webhook is configured, and run it every weekday morning.
```

The agent should read the skill, initialize config, choose the requested output language, and either create its own native recurring task when supported or install the local OS schedule with `scripts/install_schedule.py`.

Codex should read:

```text
.codex-plugin/plugin.json
skills/daily-intelligence-workbench/SKILL.md
```

Claude Code should read:

```text
CLAUDE.md
skills/daily-intelligence-workbench/SKILL.md
docs/调研方法论与Loop设计.md
```

## Documentation

- [Changelog](CHANGELOG.md)
- [Full English README](README.en.md)
- [中文说明](README.zh-CN.md)

## Repository Layout

```text
ai-intel-workbench/
├── .codex-plugin/plugin.json
├── AGENTS.md
├── CLAUDE.md
├── index.html
├── config/
├── data/
├── docs/
├── scripts/
└── skills/daily-intelligence-workbench/
```

## License

MIT
