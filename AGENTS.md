# Daily Intelligence Workbench

本仓库是一个本地优先的每日 AI 情报工作台。面向 Codex / Claude Code 使用时，优先读取 `skills/daily-intelligence-workbench/SKILL.md`，再按脚本入口执行初始化、每日调研、校验、推送和定时任务。

## 关键入口

- `python3 scripts/init.py`：初始化工作区、行业锚定和推送配置。
- `python3 scripts/init.py --language zh|en|bilingual`：初始化工作区、行业锚定、产出语言和推送配置。
- `python3 scripts/run_daily.py --date today --language zh|en|bilingual`：生成或验证当天 digest；若配置了 agent 命令，会调用 agent 完成调研。
- `python3 scripts/serve.py --port 4318`：启动本地 HTML 工作台。
- `python3 scripts/install_schedule.py install --time 08:30 --push`：安装本地每日定时任务。
- `python3 scripts/validate_digest.py --date latest`：校验 digest 与 manifest。

## 自然语言入口

用户可能不会直接给 Python 命令，而是说：

- “帮我初始化每日资讯工作台，关注 AI+加密和 AI+金融，每天 08:30 自动生成。”
- “输出英文，不推送，先每天早上更新本地看板。”
- “如果有飞书 webhook 就推送，否则只生成 digest。”

遇到这类请求时，不要只解释命令；先读取 `skills/daily-intelligence-workbench/SKILL.md`，按其中 Natural Language Setup Mode 自动推断或使用默认值，然后执行初始化、语言配置、推送配置和定时任务设置。若当前 Agent 平台支持自己的 recurring task / automation，优先按用户要求创建 agent 原生每日任务；否则使用 `scripts/install_schedule.py` 安装本地 launchd / cron。

## 数据源原则

X/Twitter 采集必须使用 provider 模式：

- 默认：公共网页 / 搜索发现 / 公开 status 或 profile 读取。
- 可选：用户本地 Chrome 登录态、浏览器扩展、X API 或第三方数据源。
- KOL 观点维度必须 X-first：优先按 `config/kol.yaml` 与 `config/conversation_radar.yaml` 发现候选，用公开搜索和 Gate CLI `news feed search-x` 找具体帖子。Gate CLI 只作候选发现，结果先过 `scripts/validate_x_candidates.py`；只有用户明确发起的交互式运行，才由浏览器少量打开具体 X status/article 核验。定时任务不得脚本化搜索、滚动或批量读取 X 登录态；profile/with_replies 只用于导航，不是观点证据。只有 X 证据不足时才 fallback 到 newsletter / blog，并让质量校验如实报告不足。
- 不把任何用户账号、cookie、token、webhook 写入仓库；只使用本地 `config/*.yaml` 或环境变量。

## 输出约定

- 输出文档和摘要默认简体中文。
- 每条情报必须保留可访问来源 URL、日期、维度、摘要和可信度备注。
- 遵循 `config/runtime.yaml` 的 `output_language`：`zh` / `en` / `bilingual`。
- 不确定、单源、超时间窗口的信息要明确标注。
