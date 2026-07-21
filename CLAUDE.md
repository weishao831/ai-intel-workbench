# Daily Intelligence Workbench

This repository can be used from Claude Code as a local-first daily AI intelligence workflow.

Start by reading `skills/daily-intelligence-workbench/SKILL.md`, then use the scripts in `scripts/`:

- `python3 scripts/init.py`
- `python3 scripts/init.py --language zh|en|bilingual`
- `python3 scripts/run_daily.py --date today --language zh|en|bilingual`
- `python3 scripts/serve.py --port 4318`
- `python3 scripts/install_schedule.py install --time 08:30 --push`
- `python3 scripts/validate_digest.py --date latest`

Users may ask in natural language instead of giving commands, for example:

- "Set this up for AI + crypto and AI + finance, English output, no push, and run it every morning."
- "Initialize this workbench, track AI + finance, and schedule your daily run at 08:30."
- "Push to Lark if a webhook is configured; otherwise just update the local dashboard."

In that case, do not stop at explaining commands. Read the skill's Natural Language Setup Mode, infer safe defaults, run initialization, configure output language and push behavior, then create a native recurring agent task if Claude Code or the host environment supports it. If native scheduling is not available, use `scripts/install_schedule.py` to install launchd / cron.

Do not store browser cookies, X/Twitter session tokens, API keys, or webhook URLs in committed files. Keep user-specific secrets in local config files or environment variables.

Honor `config/runtime.yaml` `output_language` when generating user-facing digest fields. Supported values are `zh`, `en`, and `bilingual`.

For the KOL views dimension, use X-first sourcing: start from `config/kol.yaml` plus emerging topics in `config/conversation_radar.yaml`, use public search and Gate CLI `news feed search-x` for candidate discovery, run `scripts/validate_x_candidates.py`, then open each selected concrete X status/article in a browser. Profiles and `with_replies` pages are navigation only and never count as viewpoints. Preserve verified X URLs in `items[].url` or `items[].x_src`.
