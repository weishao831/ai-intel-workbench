# AI 每日情报工作台

[English](README.md) | [中文](README.zh-CN.md)

本项目是一个**本地优先、可开源安装部署**的每日 AI 行业情报工作台。它把配置化信源、X-first KOL 追踪、行业锚定、Agent 调研、结构化 digest、本地 HTML 工作台、机器人推送和本地定时任务串成一套可复用流程。

只要你的 Agent 具备读取 skill/说明文档、运行本地脚本、设置或触发定时任务的能力，就可以使用这个仓库完成初始化、每日调研、看板更新和可选机器人推送。

![中文看板](assets/screenshots/dashboard-zh.png)

适用环境：

- Codex：作为本地 plugin 使用，读取 `.codex-plugin/plugin.json` 与 `skills/`。
- Claude Code：作为本地仓库/skill 工作流使用，读取 `CLAUDE.md` 与 `skills/daily-intelligence-workbench/SKILL.md`。
- 普通本地运行：只依赖 Python 3 标准库即可打开工作台、校验数据、推送和设置定时任务。

> 开源默认不内置任何个人 webhook、cookie、token 或账号态。X/Twitter 登录态、API Key、推送机器人都由用户本地自行配置。

> 默认配置已内置 `config/kol.js` 作为初始 KOL 池，共 69 人，覆盖 AI 研究者、大厂负责人/研究员、企业 AI 与组织工作、AI 工程与 Agent、开源与模型、评测安全、AI x Crypto 和中文 AI 圈。名单可在配置中心人工新增、编辑、停用或删除；固定池只是监听起点，每日还会按当天话题反向发现新人物。

> 2026-07-21 起，`config/research_radar.yaml` 每日必扫 Qwen、DeepSeek、Kimi/Moonshot、Z.ai/GLM、ByteDance Seed/豆包、Tencent Hunyuan、Baidu ERNIE 和 MiniMax，并把模型发布、套餐/限额/产品上线、论文/技术研究分成三条独立扫描轨道。

> 2026-07-20 起新增 `config/conversation_radar.yaml`：先发现最近 72 小时/7 天里正在升温的讨论，再映射到五个展示维度。Gate CLI 只作候选发现，profile/with_replies 不再算观点，具体 X 帖必须经浏览器打开核验。

> 2026-07-24 起扩展为十二组强制覆盖：每天先做全局 AI、视觉/多模态、AI x Web3、AI x 金融四条开放热点发现，再检查社媒热点、额度/订阅、国产模型、X 观点、国内大厂三条活动线和动态 KOL。重点话题至少补齐首发者、独立评估和反方中的必要角色。

---

## 目录结构

```text
ai-intel-workbench/
├── .codex-plugin/plugin.json              # Codex plugin 元数据
├── AGENTS.md                              # Codex 仓库内协作说明
├── CLAUDE.md                              # Claude Code 仓库内协作说明
├── index.html                             # 零依赖本地 HTML 工作台
├── config/
│   ├── industry.yaml                      # 行业锚定：AI+加密 / AI+金融 / 自定义
│   ├── sources.yaml                       # 信源配置
│   ├── keywords.yaml                      # 搜索词与噪音过滤
│   ├── kol.js                             # 配置中心可维护的默认 KOL 名单
│   ├── conversation_radar.yaml            # 近期话题发现、证据与新鲜度门槛
│   ├── research_radar.yaml                # 研究员长文/官方研究/国产模型/金融量化 Agent 雷达
│   ├── workbench.js                       # 工作台默认设置与默认 RSS 订阅
│   ├── workbench.user.js                  # 页面写入的本地设置（gitignore）
│   ├── push.yaml                          # Lark/飞书等机器人配置
│   ├── runtime.yaml                       # 本地端口、agent 命令、定时配置
│   └── secrets.example.env                # 本地密钥示例，不提交真实 secrets
├── data/
│   ├── manifest.js                        # 历史 digest 清单
│   └── 2026/06/29/digest.js               # 内置样例数据，可 smoke test
├── docs/
│   └── 调研方法论与Loop设计.md
├── scripts/
│   ├── init.py                            # 初始化向导
│   ├── run_daily.py                       # 每日运行入口
│   ├── rss_fetch.py                       # RSS/Atom 采集与 trace 登记
│   ├── validate_digest.py                 # digest 校验
│   ├── validate_x_candidates.py            # Gate CLI X 候选证据校验
│   ├── serve.py                           # 本地静态服务
│   ├── push_lark.py                       # Lark/飞书推送
│   └── install_schedule.py                # launchd / cron 定时任务
└── skills/
    └── daily-intelligence-workbench/      # Codex / Claude Code 可读 skill
```

---

## 快速开始

```bash
git clone https://github.com/weishao831/ai-intel-workbench.git
cd ai-intel-workbench

# 1. 初始化：行业、机器人、端口、可选 agent 命令
python3 scripts/init.py

# 非交互初始化示例：选择行业与产出语言
python3 scripts/init.py --anchors ai-crypto,ai-finance --language zh --bot none

# 2. 打开本地工作台
python3 scripts/serve.py --port 4318
# 浏览器访问 http://127.0.0.1:4318/

# 3. 校验内置样例
python3 scripts/validate_digest.py --date latest

# 4. 生成今天的调研任务
python3 scripts/run_daily.py --date today
```

如果没有配置 agent 命令，`run_daily.py` 会生成：

```text
.daily-intel/runs/YYYY-MM-DD/research_prompt.md
```

把这个 prompt 交给 Codex 或 Claude Code 执行，它会按 skill 说明完成调研，并用 canonical JSON 写回 `digest.js`。

---

## Codex 使用方式

仓库已经包含 Codex plugin 元数据：

```text
.codex-plugin/plugin.json
skills/daily-intelligence-workbench/SKILL.md
```

本地开发时，可把整个仓库作为 local plugin 源安装到 Codex；也可以在 Codex 中直接打开本目录工作。触发语示例：

- 初始化每日资讯工作台
- 帮我关注 AI+加密和 AI+金融，每天 08:30 自动生成每日情报
- 初始化这个工作台，输出英文，不推送，先每天早上生成本地看板
- 生成今天的 AI 情报 digest
- 帮我安装每日定时任务
- 配置 X/Twitter 采集 provider

Codex agent 应先读取 `skills/daily-intelligence-workbench/SKILL.md`，再执行脚本。

### 直接用自然语言初始化

你不需要手动记所有 Python 命令，也可以直接对 Agent 说：

```text
帮我初始化每日资讯工作台，关注 AI+加密和 AI+金融，产出中文；如果没有推送机器人，就先只更新本地看板；每天早上 08:30 自动运行。
```

或：

```text
Set up AI Intel Workbench for AI + finance, English output, no push yet, and schedule your daily run at 08:30.
```

Agent 应该读取 skill 后自动完成：初始化配置、写入行业锚定、设置产出语言、判断是否启用推送，并在支持 agent 原生定时任务的环境中创建自己的每日任务；若当前 Agent 没有原生定时能力，则使用 `scripts/install_schedule.py` 安装本地 launchd / cron 定时任务。

---

## Claude Code 使用方式

Claude Code 可直接在仓库根目录工作：

```bash
cd ai-intel-workbench
claude
```

然后让 Claude Code 读取：

```text
CLAUDE.md
skills/daily-intelligence-workbench/SKILL.md
docs/调研方法论与Loop设计.md
```

也可以在 `config/runtime.yaml` 里配置定时调用的 agent 命令，例如：

```yaml
agent_command: claude -p "$(cat {prompt})"
```

其中占位符：

- `{date}`：当天日期，格式 `YYYY-MM-DD`
- `{root}`：工作台根目录
- `{prompt}`：`run_daily.py` 生成的调研提示文件

---

## 产出语言

初始化时可选择 digest 的用户可见语言：

```bash
python3 scripts/init.py --language zh
python3 scripts/init.py --language en
python3 scripts/init.py --language bilingual
```

也可以编辑 `config/runtime.yaml`：

```yaml
output_language: zh        # zh | en | bilingual
```

运行时可临时覆盖：

```bash
python3 scripts/run_daily.py --date today --language en
```

## 研究雷达与长文详情

固定信源巡检容易漏掉跨人物、跨公司的新议题。工作流先运行 `config/conversation_radar.yaml`，从最近讨论中发现话题，再运行研究雷达和五维度采编。默认战略镜头包括“AI 如何进入组织 / AI B 端”和“AGI 临近 / Frontier AI”。

普通热点搜索还容易漏掉两类内容：一类是研究员发在 X Article 或个人账号里的长文，另一类是 DeepSeek、Kimi、智谱等实验室发在 Hugging Face / GitHub / 项目页里的模型卡和技术报告。

为了解决这个问题，工作流新增 `config/research_radar.yaml`：

- `researcher_longform_watchlist`：研究员长文/X Article，例如 Anthropic Claude Code 相关研究员。
- `lab_research_watchlist`：Anthropic Research、OpenAI Research、OpenAI Alignment、Google DeepMind Research。
- `chinese_frontier_lab_watchlist`：每日必扫 8 家国内核心厂商，并轮询 StepFun、Huawei Pangu、InternLM、Meituan LongCat、Xiaomi MiMo 和 InclusionAI。
- `domestic_lab_scan_policy`：将 `model_release`、`product_ops`、`research` 作为三条独立轨道。
- `open_source_finance_quant_watchlist`：金融 Agent、量化 Agent、AI 投研、回测/交易所/券商接口类开源项目。

长文或技术报告入选时，应设置：

```json
{
  "content_type": "x_article",
  "depth": "deep",
  "key_points": [],
  "examples": [],
  "product_implications": [],
  "limitations": []
}
```

`detail` 不再只写短摘要，而应尽量让用户在工作台里了解原文的核心逻辑、案例、价值和边界。

语言含义：

- `zh`：简体中文输出，技术术语、公司名、项目名、URL 保留原文。
- `en`：英文输出，来源名、项目名、ticker、URL 保留原文。
- `bilingual`：中文优先，标题和关键摘要可补简短英文对照。

---

## X/Twitter 数据源设计

开源版不默认依赖某个用户的 Chrome 登录态。

KOL 观点维度采用 X-first：优先从配置中心维护的 `config/kol.js` 与当天话题发现的新人物出发，用公开搜索和 Gate CLI `news feed search-x` 找到候选。每日先运行四条不带固定人名/厂商名的开放趋势搜索，学习当天正在讨论的模型、术语、争议和新作者，再回到维护名单补证。Gate 无 `cited_tweets/items` 时立即改用 `site:x.com` 公开索引寻找具体原帖，再 fallback 到 newsletter / blog / 媒体聚合。浏览器只在用户明确发起的交互式运行中做少量最终核验，不用于定时批量采集。

Gate CLI 只负责候选发现：输出必须先通过 `python3 scripts/validate_x_candidates.py <result.json>`。交互运行用浏览器核对具体原帖；定时运行也可采用公开索引中同时可见作者、日期和正文摘录的具体 `x.com/<handle>/status/<数字 id>` 或 X Article。`profile`、`with_replies`、搜索页和主页只用于导航，不是观点，也不计入 X 来源比例。`validate_digest.py` 会输出热点覆盖、新鲜度、具体 X 比例和过去 7 天重复情况。

默认 provider：

- 公共网页搜索发现 URL
- 官方博客 / arXiv / GitHub / HuggingFace / 媒体源
- 公开 X status 页面
- 公开 X profile 页面（仅用于发现帖子，不作为观点证据）

可选 provider：

- 用户本地 Chrome/浏览器扩展，复用用户自己的登录态，仅用于用户明确发起的低频只读核验
- X API 或第三方数据 API
- Gate CLI `news feed search-x`，用于候选发现；推文级证据仍需本地校验脚本和浏览器复核
- 用户导出的 CSV/JSON/bookmarks

安全原则：

- 不读取、不导出、不提交 cookie / localStorage / session token。
- 不关注、不点赞、不发帖、不私信、不绕过 CAPTCHA 或安全拦截。
- 不承诺“防封”；定时任务不脚本化访问 X 网站，只做低频、只读、用户明确触发的本地核验；遇到登录墙、验证码或安全拦截立即停止。

详见 `skills/daily-intelligence-workbench/references/source-providers.md`。

---

## 每日运行

### 只生成调研提示

```bash
python3 scripts/run_daily.py --date today
```

### 从 canonical JSON 写入 digest

```bash
python3 scripts/run_daily.py --date 2026-06-30 --from-json /path/to/digest.json
python3 scripts/validate_digest.py --date 2026-06-30
```

### 用内置样例做 smoke test

```bash
python3 scripts/run_daily.py --date today --sample
```

### 生成后推送

推荐先在「配置中心 → 推送机器人」维护机器人名称、角色和环境变量名，再把真实 webhook 放进本机 `config/secrets.env` 或系统环境变量：

```bash
export DAILY_INTEL_LARK_WEBHOOK="<your-local-webhook>"
python3 scripts/run_daily.py --date today --push

# 或单独推送某天（使用 push.yaml 选定的主机器人）
python3 scripts/push_lark.py 2026/06/29
```

`primary_only` 下默认拒绝命令行 webhook，防止定时任务绕过白名单。只有明确的手动一次性操作才可使用 `--allow-target-override`。配置中心和导出的 `workbench.user.js` 只保存环境变量名，不保存或展示真实机器人地址。

可以在本机 `config/secrets.env` 或环境变量中保留多个机器人，真实 webhook 不进仓库。当有效配置使用 `target_policy: primary_only` 时，日常任务只会发送角色为 `primary` 的启用机器人，其他机器人可继续保留但不会自动发送：

```bash
DAILY_INTEL_LARK_WEBHOOK_1="<your-primary-webhook>"
DAILY_INTEL_LARK_WEBHOOK_2="<your-secondary-webhook>"

python3 scripts/push_lark.py 2026/06/29 --dry-run
```

---

## 安装定时任务

macOS 使用 LaunchAgent，Linux 使用 crontab。

```bash
# 每天 08:30 运行，不推送
python3 scripts/install_schedule.py install --time 08:30

# 每天 08:30 运行并推送
python3 scripts/install_schedule.py install --time 08:30 --push

# 查看状态
python3 scripts/install_schedule.py status

# 卸载
python3 scripts/install_schedule.py uninstall
```

定时任务会调用：

```bash
python3 scripts/run_daily.py --date today
```

若 `config/runtime.yaml` 或环境变量配置了 `agent_command`，会自动把 research prompt 交给该命令执行。

---

## 配置

### 在工作台中配置

直接打开 `index.html`，侧栏进入「配置中心」可以维护三类真实项目配置：

- 「运行与质量」：运行参数、质量门槛、数据源开关，以及全局 AI、视觉/多模态、AI x Web3、AI x 金融四条主动热点发现线。
- 「KOL 作者」：搜索、分类筛选、分页、新增、编辑、停用和删除默认关注作者。
- 「推送机器人」：维护机器人名称、类型、主/备用角色、启用状态和 webhook/签名密钥的环境变量名。

侧栏「RSS 订阅源」可新增、编辑、停用或删除 RSS/Atom 地址。

- 「保存」写入当前浏览器，本页下次打开仍会保留。
- 「写入每日任务」选择工作台根目录或 `config/` 目录，生成本地 `config/workbench.user.js`，后续 Agent 与校验脚本会自动合并读取。
- 「导入 / 导出」用于迁移本地配置；`workbench.user.js` 默认不进入版本控制。

RSS 默认包含 OpenAI News、Google DeepMind Blog、Hugging Face Blog、arXiv cs.AI、GitHub AI & ML 和 CoinDesk。每日任务在 trace 初始化后执行：

```bash
python3 scripts/rss_fetch.py --date today --record
```

每个订阅源都会形成独立 artifact 和 `rss-feed` trace。RSS 只负责发现候选，最终条目仍须核验文章深链。

### 行业锚定

编辑 `config/industry.yaml`：

```yaml
anchors:
  - ai-crypto
  - ai-finance
```

可改为：

```yaml
anchors:
  - ai-healthcare
  - ai-robotics
```

### 推送机器人

优先在「配置中心 → 推送机器人」中维护。页面只要求填写环境变量名，例如 `DAILY_INTEL_LARK_WEBHOOK`；真实地址写入本机 `config/secrets.env`：

```bash
DAILY_INTEL_LARK_WEBHOOK=<your-local-webhook>
```

`config/push.yaml` 仅作为旧版兼容配置；开源提交中应保持 `webhook: ""`。

### agent 命令

编辑 `config/runtime.yaml`：

```yaml
agent_command: claude -p "$(cat {prompt})"
```

或：

```yaml
agent_command: codex exec "$(cat {prompt})"
```

具体 CLI 参数以用户本机安装版本为准。

### 产出语言

编辑 `config/runtime.yaml`：

```yaml
output_language: zh
```

支持 `zh` / `en` / `bilingual`。

---

## 数据契约

每日 digest 写入：

```text
data/YYYY/MM/DD/digest.js
```

并更新：

```text
data/manifest.js
```

canonical JSON schema 见：

```text
skills/daily-intelligence-workbench/references/data-schema.md
```

---

## 当前路线图

- [x] 本地 HTML 工作台
- [x] 初始化配置
- [x] Lark/飞书推送
- [x] 多 Lark/飞书机器人本机私密配置
- [x] Codex plugin manifest
- [x] Claude Code / Codex skill
- [x] 本地 run / validate / serve 脚本
- [x] macOS launchd / Linux cron 定时任务
- [x] 默认 69 人 KOL 池 + 话题反向发现
- [x] KOL 维度 X-first 校验
- [ ] 完整公共网页采集器
- [ ] Chrome provider 示例
- [ ] X API provider 示例
- [ ] 反馈闭环：星标数据回流调权

---

## 免责声明

本项目只做信息聚合与辅助分析，不构成投资建议。AI × 金融 / AI × 交易类内容尤其需要自行判断。每条信息应保留来源 URL、日期和可信度说明。
