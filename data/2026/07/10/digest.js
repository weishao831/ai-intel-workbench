// 当日聚合数据（由 Daily Intelligence Workbench 生成）。
window.__DAILY__ = window.__DAILY__ || {};
window.__DAILY__["2026/07/10"] = {
  "date": "2026-07-10",
  "date_cn": "2026年7月10日 · 周五",
  "generated_at": "2026-07-10",
  "language": "zh",
  "refresh_note": "按 Asia/Taipei 日期生成；已执行 research radar 与 KOL X-first 检索，优先官方、论文、GitHub 与公开 X status。",
  "market_mood": "今天 AI 情报的核心不是单点模型炫技，而是 agent 工作流产品化、金融 agent 可验证评测、以及权限/记忆安全边界。AI+金融方向继续升温，但更适合以辅助分析、诊断报告和证据链落地，避免收益承诺。",
  "dimensions": [
    {
      "key": "lab",
      "cn": "AI 大厂动态",
      "overview": "今天大厂主线从单点模型发布转向“可持续工作的 agent 产品”和企业级交付。OpenAI 把 Work、Codex、桌面端和 Plugin Directory 串成一套工作入口；Google DeepMind 与 Hugging Face 的近期更新则把研究、数据与部署基础设施继续前移。",
      "notes": "优先采用 OpenAI 官方 release notes、Google DeepMind/Hugging Face 官方页；个别市场化解读仅作背景，不作为核心事实。"
    },
    {
      "key": "kol",
      "cn": "KOL 观点",
      "overview": "KOL 讨论集中在 agent 产品命名膨胀、Claude Code/Work loop 方法论、以及 agentic engineering 从 prompt 转向 harness、loop、权限和交付物。今天 KOL 条目全部带公开 X status 证据。",
      "notes": "X-first 已执行：6/6 KOL 条目来自公开 x.com status 或 x_src，比例 100%。公开 X 页面可访问但正文有时只通过搜索摘要暴露，因此可信度标注为“公开 X status + 搜索摘要交叉确认”。"
    },
    {
      "key": "paper",
      "cn": "前沿论文",
      "overview": "论文与研究雷达今天更偏 agent 评测：金融表格、组合管理、长期记忆安全和企业迁移。共同趋势是：只看单次答案正确率不够，agent 需要过程轨迹、成本、权限、记忆和可复算证据。",
      "notes": "采用 arXiv、Hugging Face 官方 blog/papers 等一手或准一手来源；部分论文发布时间不是当天，但仍在近 14 天/近期雷达窗口内，且与 AI+金融、agent 评测高度相关。"
    },
    {
      "key": "oss",
      "cn": "开源项目",
      "overview": "开源项目维度今天重点补金融/量化 Agent：TradingAgents 继续修正确性和稳定性，AI-Trader、FinRobot 等项目分别覆盖交易平台、投研报告和量化社区。另有 agent 安全事件提醒开源工作流必须做权限隔离。",
      "notes": "金融/量化 Agent 条目不少于 2 条；优先 GitHub 官方仓库与 Hacker News/安全研究来源，未把纯榜单和广告型内容作为入选依据。"
    },
    {
      "key": "fin",
      "cn": "AI × 金融",
      "overview": "金融维度今天有两条线：一是 AI agent 开始进入个人投资、投行和银行生产工作流；二是监管与安全开始把 agent 当成可能影响市场结构的自动化主体，而不是普通聊天工具。",
      "notes": "优先采用一手论文/GitHub/监管或可靠媒体信号；涉及交易收益的项目均标注“不能等同真实可交易 alpha”。"
    }
  ],
  "hot_topics_today": [
    {
      "title": "Work/Claude Code 推动 agent 产品从聊天入口转向可交付工作流",
      "heat": "high",
      "dims": [
        "lab",
        "kol",
        "oss"
      ],
      "summary": "OpenAI Work、Claude Code loop/harness 讨论、GitHub Agentic Workflows 安全事件共同说明：agent 的竞争点正在变成任务载体、权限边界和交付物质量。",
      "related": [
        "lab-1",
        "lab-2",
        "kol-2",
        "oss-4"
      ]
    },
    {
      "title": "AI+金融 Agent 的主线从收益叙事转向诊断评测",
      "heat": "high",
      "dims": [
        "paper",
        "oss",
        "fin"
      ],
      "summary": "BlueFin、CLQT、TradingAgents v0.3.1 都在强调真实金融任务、前视过滤、成本、策略一致性和可复算轨迹。",
      "related": [
        "paper-1",
        "paper-2",
        "oss-1",
        "fin-4"
      ]
    },
    {
      "title": "KOL 圈重新定义 agentic engineering：harness、loop、fleet、software factory",
      "heat": "medium",
      "dims": [
        "kol",
        "lab"
      ],
      "summary": "Addy、Thariq、Boris、swyx 的近期 X 讨论共同指向：prompt 只是入口，生产级 agent 依赖工程系统。",
      "related": [
        "kol-2",
        "kol-3",
        "kol-5",
        "kol-6"
      ]
    },
    {
      "title": "Agent 安全从内容安全转为权限安全",
      "heat": "high",
      "dims": [
        "paper",
        "oss"
      ],
      "summary": "长期记忆投毒与 GitLost 都说明，agent 的风险不只是说错话，而是带着权限读写真实系统。",
      "related": [
        "paper-3",
        "oss-4"
      ]
    },
    {
      "title": "开源金融 Agent 开始补正确性和生产韧性",
      "heat": "medium",
      "dims": [
        "oss",
        "fin"
      ],
      "summary": "TradingAgents、FinRobot、AI-Trader 分别在交易框架、研报生成、agent-native 平台上探索，但都需要数据、风控和评测兜底。",
      "related": [
        "oss-1",
        "oss-2",
        "oss-3",
        "fin-1"
      ]
    }
  ],
  "items": [
    {
      "id": "lab-1",
      "dim": "lab",
      "title": "OpenAI 发布 ChatGPT Work：把长任务、连接器、文件和 Sites 放进一个 agent 工作入口",
      "orig": "Introducing ChatGPT Work",
      "source": "OpenAI Help Center",
      "url": "https://help.openai.com/en/articles/6825453-chatgpt-release-notes",
      "date": "2026-07-09",
      "heat": "high",
      "tags": [
        "Agent",
        "Codex",
        "工作流"
      ],
      "summary": "OpenAI 官方 release notes 显示，ChatGPT Work 面向更长、更复杂的任务，可研究资料、分析信息、跨已连接应用和文件工作，并生成文档、表格、演示、报告和 Sites。它也支持一次性、重复、触发式或监控式 Scheduled Tasks。",
      "detail": "这不是普通聊天能力更新，而是把 agent 工作台产品化：用户可以跟踪进度、回答问题、改变方向、批准关键动作；企业和教育空间先进入两周 preview，默认关闭，管理员可控制启用。对 Wesber 的启发是，Work 把“任务执行、交付物、审批、人机协作、定时自动化”放到同一个心智下，比单独强调模型能力更接近生产工具。边界是：官方文档强调可连接应用和本地文件，但真正的权限隔离、审计和失败恢复仍要看 workspace/admin 策略。 更具体地看，Work 把“查资料、分析、写成品、定时继续做”串成一个产品对象，这会改变用户对 AI 的预期：用户不再只问一个答案，而是把一个工作包交给系统。产品设计上需要把中间状态可视化，把人工确认点显性化，把失败后的继续、回滚和重试做成默认能力。对于金融和企业场景，连接器权限、文件读取范围、最终产物审批会比模型能力本身更容易成为上线阻力。",
      "why": "这是大厂 agent 产品从“功能模式”转向“工作载体”的明确信号。",
      "why_now": "发布日期为 2026-07-09，刚好落在今天的 24 小时窗口。",
      "buzz": "官方来源；与 Codex、插件目录、桌面端整合共同构成 OpenAI 当前 agent 入口战略。",
      "content_type": "news",
      "depth": "normal",
      "key_points": [
        "Work 面向长任务与交付物，而不是短问答",
        "Scheduled Tasks 被纳入同一工作入口",
        "企业/Edu 有管理员预览与启用控制"
      ],
      "examples": [
        "让 agent 定时监控某个目录或数据源，生成周报并等待人工审批后推送。"
      ],
      "product_implications": [
        "GateAI 若做长任务，需要把计划、审批、文件、推送、恢复做成产品对象。"
      ],
      "limitations": [
        "release notes 不能证明所有连接器和本地文件能力在每个地区/套餐同时可用。"
      ]
    },
    {
      "id": "lab-2",
      "dim": "lab",
      "title": "ChatGPT 桌面端把 Chat、Work、Codex 合并，插件目录替代 App Directory",
      "source": "OpenAI Help Center",
      "url": "https://help.openai.com/en/articles/6825453-chatgpt-release-notes",
      "date": "2026-07-09",
      "heat": "high",
      "tags": [
        "桌面端",
        "插件",
        "Codex"
      ],
      "summary": "OpenAI 同日说明新的 ChatGPT desktop app 将 Chat、Work、Codex 放在同一个 macOS/Windows 应用中，并用 Plugin Directory 替代 App Directory。",
      "detail": "这意味着 OpenAI 不再把“聊天、任务执行、写代码、应用连接”当作割裂入口，而是让插件打包 skills、apps 和 templates，面向具体 workflow 出现。对产品经理来说，关键词不是插件市场本身，而是插件成为“工作流分发单元”：一个插件既能带技能说明，也能带应用连接，还能带模板。边界是，插件生态的质量控制、权限解释和用户信任成本会成为新问题。 这也说明插件目录不是单纯“应用商店改名”，而是把工具、技能、模板和场景说明打包为可复用能力。未来用户可能不是选择“我要用哪个模型”，而是安装“投研报告”“代码迁移”“客户周报”这类工作流包。对平台方而言，插件需要声明能读什么、能写什么、需要哪些权限、输出什么 artifact，以及失败时如何退出。否则插件越多，用户心智越乱，安全边界也越难解释。",
      "why": "这会影响用户对 Agent 产品入口的期待：从模型列表转向可安装的工作流能力包。",
      "buzz": "官方 release notes；与 ChatGPT Work 同日发布，可信度高。",
      "content_type": "news",
      "depth": "normal"
    },
    {
      "id": "lab-3",
      "dim": "lab",
      "title": "Google DeepMind 近期论文列表强调“全球有益技术”和多智能体安全议题",
      "source": "Google DeepMind Publications",
      "url": "https://deepmind.google/research/publications/",
      "date": "2026-07-06",
      "heat": "medium",
      "tags": [
        "安全",
        "多智能体",
        "治理"
      ],
      "summary": "Google DeepMind publications 页近期列出 2026-07-06 的 The Case for Globally Beneficial Technology，以及 6 月多篇关于 AI 意识、ASI、多智能体安全的研究。",
      "detail": "这一组研究不像产品发布那样吸睛，但说明顶级实验室仍在把“能力上限”与“社会影响/安全”并行推进。对 agent 产品尤其重要的是，多智能体环境会放大策略互动、责任归属和外部性问题；简单把单 agent 能力叠加成 agent fleet，可能带来不可预测的群体行为。 对 Agent 产品来说，这类研究还有一层现实意义：当多个 agent 在同一环境中互相观察、竞争或协作时，单 agent 的安全评测可能不再足够。比如一个交易 agent、一个风控 agent、一个新闻解读 agent 同时影响用户决策，系统级行为可能不是任何单个 agent 的设计者能完全预测的。DeepMind 持续投入这类研究，意味着多 agent 产品需要提前考虑治理、角色边界和冲突解决机制。",
      "why": "多 agent 正在成为大厂和开源框架的共同方向，安全研究会影响产品默认边界。",
      "buzz": "官方 publications 索引，作为研究雷达命中。",
      "content_type": "news",
      "depth": "normal"
    },
    {
      "id": "lab-4",
      "dim": "lab",
      "title": "Hugging Face 连续更新 Data for Agents、vLLM backend 与部署相关内容",
      "source": "Hugging Face Blog",
      "url": "https://huggingface.co/blog",
      "date": "2026-07-08",
      "heat": "medium",
      "tags": [
        "数据",
        "部署",
        "Agent"
      ],
      "summary": "Hugging Face blog 近期显示 Data for Agents、Native-speed vLLM transformers modeling backend、SageMaker Studio 一键入口等更新，方向集中在 agent 数据与部署基础设施。",
      "detail": "这类更新的意义在于：agent 不只缺模型，还缺可用数据、可控推理后端、云端运行和评测闭环。Data for Agents 说明社区开始把 agent 数据看成独立资产；vLLM/Transformers backend 与云端部署更新则降低从 notebook 到服务的成本。边界是，基础设施更新本身不等于 agent 可靠，仍需要任务级 eval、权限隔离和失败恢复。 这对每日资讯工作台本身也有启发：情报不是只靠一次搜索，而是要沉淀来源、URL、日期、可信度、维度、校验结果和推送记录，形成可复跑数据。对更大的 Agent 平台而言，数据层要记录“任务为什么这样做”，不只是最终答案。否则评测无法复现，模型升级后也不知道质量是变好还是变差。Hugging Face 的近期更新说明开源社区正在把这件事产品化。",
      "why": "开源生态正在补 agent 基建，而不是只堆 demo。",
      "buzz": "官方 blog 列表，日期 2026-07-08。",
      "content_type": "news",
      "depth": "normal"
    },
    {
      "id": "kol-1",
      "dim": "kol",
      "title": "Simon Willison 吐槽 ChatGPT Work、Codex、Claude Code 等命名混乱",
      "source": "X / Simon Willison",
      "url": "https://x.com/simonw/status/2075348941215006888",
      "date": "2026-07-09",
      "heat": "high",
      "tags": [
        "Agent",
        "产品命名",
        "用户心智"
      ],
      "summary": "Simon Willison 在 X 上表示，自己都被 ChatGPT、ChatGPT Codex、ChatGPT Work、Claude、Claude Code、Claude Cowork 的命名关系搞糊涂。",
      "detail": "这条不是技术更新，但产品信号很强：agent 产品线开始丰富后，用户首先遇到的不是能力，而是入口、边界和命名心智。对于 GateAI，这提示显式功能、领域 Agent、工具、skill、workflow 等概念如果都外露，用户会先困惑于“我到底该点哪个”。",
      "why": "顶级开发者都觉得困惑，说明命名和入口架构已成为 agent 产品的核心 UX 问题。",
      "buzz": "公开 X status，近 24 小时内。",
      "x_src": [
        "https://x.com/simonw/status/2075348941215006888"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "kol-2",
      "dim": "kol",
      "title": "Addy Osmani：agentic engineering 已从 prompt 转向 harness、loops 和 software factories",
      "source": "X / Addy Osmani",
      "url": "https://x.com/addyosmani/status/2074927530482835916",
      "date": "2026-07-09",
      "heat": "high",
      "tags": [
        "Agentic Engineering",
        "Loop",
        "Harness"
      ],
      "summary": "Addy Osmani 的 X status 指出，过去一年 agentic engineering 的讨论已经转向 harnesses、loops、fleets 和 software factories。",
      "detail": "这与 Wesber 近期关注的 Loop Engineering 高度一致：真正可交付的 agent 不是靠一个 prompt，而是靠流程骨架、运行日志、可恢复状态、权限模型和批量执行能力。产品启发是：如果一个功能要从 demo 走到生产，应该先问“它的 loop 文件包在哪里、如何验收、失败怎么恢复”，而不是先问模型换哪一个。",
      "why": "把工程讨论从提示词转到执行系统，是 agent 生产化的标志。",
      "buzz": "公开 X status，搜索摘要可见。",
      "x_src": [
        "https://x.com/addyosmani/status/2074927530482835916"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "kol-3",
      "dim": "kol",
      "title": "Boris Cherny 回顾 Claude Code 起源：从 Anthropic 安全研究走向开发者产品",
      "source": "X / Boris Cherny",
      "url": "https://x.com/bcherny/status/2074247226038063316",
      "date": "2026-07-07",
      "heat": "high",
      "tags": [
        "Claude Code",
        "安全研究",
        "开发者工具"
      ],
      "summary": "Boris Cherny 在 X 上表示，这是他们第一次讲述 Claude Code 从 Anthropic 安全研究起源，到构建和发布的故事。",
      "detail": "这说明 Claude Code 不是单纯的 IDE 插件，而是安全研究、工具权限、代码执行和人机协作长期积累的产物。对产品设计的启发是，强 agent 往往不是“加一个 code interpreter”就完成，而是从安全边界、上下文隔离、工具调用审计开始设计。",
      "why": "Claude Code 是当前 agent 编程产品的重要参照，起源叙事能帮助判断它的设计重心。",
      "buzz": "公开 X status；近 7 天。",
      "x_src": [
        "https://x.com/bcherny/status/2074247226038063316"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "kol-4",
      "dim": "kol",
      "title": "OpenAI 官方 X 宣布 ChatGPT Work：由 Codex 驱动的新 agent",
      "source": "X / OpenAI",
      "url": "https://x.com/OpenAI/status/2075274271845404744",
      "date": "2026-07-09",
      "heat": "high",
      "tags": [
        "OpenAI",
        "Codex",
        "Work"
      ],
      "summary": "OpenAI 官方 X 表示 ChatGPT Work 是由 Codex 驱动的新 agent，并把它描述为一种新的完成工作方式。",
      "detail": "这条 X 与官方 release notes 相互印证，重点是 OpenAI 把 Codex 从“写代码”拓展为“驱动工作”的底层 agent 能力。对 GateAI 来说，这类似把某个强执行引擎沉到多个上层场景里，而不是每个场景单独做一个模型入口。",
      "why": "官方 X 是当天传播主线，能解释市场和 KOL 讨论为何集中在 Work。",
      "buzz": "公开 X status，近 24 小时内。",
      "x_src": [
        "https://x.com/OpenAI/status/2075274271845404744"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "kol-5",
      "dim": "kol",
      "title": "Thariq 再次强调 Claude Code dynamic workflows：Claude 能为任务即时写 harness",
      "source": "X / Thariq Shihipar",
      "url": "https://x.com/trq212/status/2061907337154367865",
      "date": "2026-06-22",
      "heat": "medium",
      "tags": [
        "Dynamic Workflow",
        "Claude Code",
        "Harness"
      ],
      "summary": "Thariq 近期 X status 提到 Claude Code 的 dynamic workflows：Claude 可以为任务临时写自己的 harness。虽然不是当天新帖，但仍是今天 agent loop 讨论的关键背景。",
      "detail": "这条进入今日 digest 的原因是，它与 Addy、Boris 今天/近 7 天关于 loop、harness 的讨论形成同一条线。dynamic workflows 的核心不是“模型更聪明”，而是模型能在执行前构造一个临时流程架构，把复杂任务拆成可运行、可检查、可恢复的工作单元。",
      "why": "它解释了为什么当前 KOL 讨论从 prompt engineering 转向 workflow engineering。",
      "buzz": "公开 X status；超出 7 天，作为背景补充而非当天热点。",
      "x_src": [
        "https://x.com/trq212/status/2061907337154367865"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "kol-6",
      "dim": "kol",
      "title": "swyx：企业 AI 采用的关键在 deployed engineering，而不是单纯模型热度",
      "source": "X / swyx",
      "url": "https://x.com/swyx/status/2070606851377672675",
      "date": "2026-06-29",
      "heat": "medium",
      "tags": [
        "AI Engineering",
        "企业采用",
        "Agent"
      ],
      "summary": "swyx 近期 X status 强调 Deployed Engineering 是企业 AI adoption 的关键成分，并关联 AI Engineer World's Fair。",
      "detail": "这条观点与今天 OpenAI Work 和 Claude Code 的讨论形成互补：企业买的不是“会聊的模型”，而是能部署、能接权限、能审计、能稳定交付的工程体系。对 AI+金融尤其如此，金融场景需要权限、合规、留痕和可复核证据。",
      "why": "企业级 agent 的竞争焦点从模型参数转到部署工程。",
      "buzz": "公开 X status；近两周，作为趋势背景。",
      "x_src": [
        "https://x.com/swyx/status/2070606851377672675"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "paper-1",
      "dim": "paper",
      "title": "BlueFin：用真实金融表格任务评测 LLM Agent，最强模型平均也低于 50%",
      "orig": "BlueFin: Benchmarking LLM Agents on Financial Spreadsheets",
      "source": "arXiv",
      "url": "https://arxiv.org/html/2605.30907v1",
      "date": "2026-05-29",
      "heat": "high",
      "tags": [
        "金融Agent",
        "评测",
        "Spreadsheet"
      ],
      "summary": "BlueFin 构造 131 个专业金融表格任务和 3,225 条细粒度 rubric，用来评测 LLM agent 在创建、理解、修改财务工作簿上的能力。论文报告称当前前沿模型在挑战任务上的平均得分仍低于 50%。",
      "detail": "这篇论文回答的是一个很实际的问题：AI agent 到底能不能做金融分析师每天面对的 Excel 工作？作者没有只测问答，而是把任务放在真实工作簿里，覆盖 synthesis、manipulation、comprehension 三类能力，并用专家标注的细粒度 rubric 校验。关键发现很克制：虽然 LLM 在通用文本和代码上很强，但一到财务表格这种动态、格式复杂、公式依赖多、验证粒度细的环境，表现仍明显不足，尤其弱在 dynamic correctness，也就是改一个地方后能否让相关公式、格式、解释一起正确。对产品经理来说，这说明“AI 投行/AI 财务分析”不能只做聊天框或报告生成，必须有工作簿级别的操作日志、公式校验、单元格 diff、人工复核和任务级 rubric。对 GateAI/金融 agent 的启发是：评测应贴近真实 artifact，而不是只看文字答案。边界是，论文是 5 月版本，模型迭代快，具体分数会过期，但任务形态和评测方法仍有参考价值。 另一个值得注意的点是，作者没有把评测完全交给程序化断言，因为金融表格里很多质量问题需要专家判断：比如假设是否合理、解释是否完整、表格结构是否符合职业习惯。这说明金融 agent 的 eval 需要“机器可检查 + 专家 rubric”结合。对产品落地而言，最小可行版本可以先覆盖事实提取、公式一致性、引用来源和关键单元格变更审计，再逐步扩展到完整建模。",
      "why": "它直接命中 AI+金融 agent 的真实落地短板。",
      "buzz": "arXiv 一手论文，研究雷达命中。",
      "content_type": "paper",
      "depth": "deep",
      "key_points": [
        "131 个真实金融表格任务，比普通问答更贴近分析师工作",
        "3,225 条 rubric 支持细粒度评测",
        "当前模型弱在动态正确性和跨单元格一致性"
      ],
      "examples": [
        "让 agent 更新 DCF 模型时，不只改收入预测，还要同步公式、图表、注释和结论。"
      ],
      "product_implications": [
        "金融 agent 需要 artifact-level eval 和电子表格操作审计。"
      ],
      "limitations": [
        "模型分数会随新模型更新而变化；论文不等同生产系统效果。"
      ]
    },
    {
      "id": "paper-2",
      "dim": "paper",
      "title": "CLQT：把组合管理 Agent 评测从收益排名改成闭环诊断",
      "orig": "CLQT: A Closed-Loop, Cost-Aware, Strategy-Consistent Benchmark for Diagnostic Evaluation of LLM Portfolio-Management Agents",
      "source": "arXiv",
      "url": "https://arxiv.org/abs/2606.29771",
      "date": "2026-06-30",
      "heat": "high",
      "tags": [
        "组合管理",
        "交易Agent",
        "评测"
      ],
      "summary": "CLQT 认为只按固定窗口收益给交易 agent 排名是弱指标，因为市场路径会主导收益，且可能掩盖前视偏差。论文提出闭环、成本感知、策略一致的诊断式评测环境。",
      "detail": "这篇论文的价值在于把“AI 交易 agent 是否赚钱”这个常见问题拆得更专业。作者指出，固定窗口收益很容易误导：碰到单边行情，坏策略也可能赚钱；如果数据时间门没管好，还可能发生 look-ahead leakage。CLQT 因此把评测改成 gather、synthesize、allocate、execute、reflect 的五阶段闭环，每轮产出 DecisionRound，并通过可复算 hash chain 记录轨迹。它还引入 TimeGate、交易/融资成本、策略一致性评分、三层记忆、MCP 工具层和 mandate-aware synthesis。产品启发是：交易 agent 的评测不能只看收益曲线，而要能解释为什么下单、成本怎么算、记忆如何影响决策、是否违反策略约束。边界是，论文给的是 benchmark 方案，不代表某个 agent 已具备真实可交易优势。 对产品经理来说，CLQT 的重点不是又造了一个排行榜，而是把交易决策拆成可观察过程。一个 agent 为什么提高仓位、为什么忽略某条新闻、为什么把成本估低，都应该在轨迹里被审计。若没有这种过程证据，短期收益反而会误导用户相信一个不可解释的系统。尤其在合规场景里，可复算 hash chain 和时间门比漂亮的收益截图更接近可上线标准。",
      "why": "它为 AI 交易/投顾 agent 提供了更可靠的验收框架。",
      "buzz": "arXiv 近期论文，贴合 AI+金融锚点。",
      "content_type": "paper",
      "depth": "deep",
      "key_points": [
        "收益排名不是可靠评测目标",
        "引入时间门和成本建模控制泄漏与虚假 alpha",
        "每轮决策形成可复算轨迹"
      ],
      "examples": [
        "同一个 agent 在牛市里赚钱，不代表它会控制回撤；CLQT 会追问它每轮的证据、成本和策略一致性。"
      ],
      "product_implications": [
        "GateAI 若做交易辅助，应优先做诊断报告和证据链，而不是收益承诺。"
      ],
      "limitations": [
        "论文仍是评测环境；真实交易还受流动性、滑点、监管和用户适当性约束。"
      ]
    },
    {
      "id": "paper-3",
      "dim": "paper",
      "title": "Securing LLM-Agent Long-Term Memory Against Poisoning：记忆投毒开始进入可形式化评测",
      "source": "arXiv",
      "url": "https://arxiv.org/abs/2606.24322",
      "date": "2026-06-24",
      "heat": "medium",
      "tags": [
        "记忆",
        "安全",
        "Agent"
      ],
      "summary": "该论文围绕 LLM Agent 长期记忆投毒，构建跨防御、跨攻击、跨模型 benchmark，并用形式化模型支持复现。",
      "detail": "长期记忆是 agent 产品体验的关键，但也是安全入口：一旦恶意内容被写入记忆，后续任务可能在用户完全没意识到的情况下被污染。论文关注 direct 和 laundering attack 等方式，并强调防御在不同通道、不同模型间的泛化问题。对产品经理而言，记忆不是“越多越好”的便利功能，而是需要来源、作用域、过期、回滚和审计的风险资产。尤其在金融/代码/企业场景，记忆可能包含交易偏好、客户资料、内部路径或权限提示，必须默认做隔离。 这类风险在自动化工作台中尤其容易被低估：用户可能希望 agent “记住我的偏好”，但攻击者也可能让 agent 记住伪偏好；用户希望 agent “下次自动继续”，但被污染的记忆也会自动继续生效。因此记忆系统应当像权限系统一样设计，有来源、有生命周期、有可见性、有删除入口，并且高风险任务默认不信任外部来源写入的长期记忆。 具体到产品落地，可以把长期记忆拆成三层：用户显式确认的长期偏好、任务过程中临时形成的工作记忆、外部来源诱导产生的候选记忆。只有第一层能默认跨任务复用，第二层应随任务结束归档，第三层必须经过人工或规则审查才能进入长期记忆。这样做会牺牲一点自动化便利，但能避免 agent 被网页、issue、邮件或聊天内容悄悄改写未来行为。",
      "why": "OpenAI Work、Claude Code 等长任务 agent 越依赖持久上下文，记忆安全越关键。",
      "buzz": "arXiv 近期论文；与 agent 安全事件互相印证。",
      "content_type": "paper",
      "depth": "deep",
      "key_points": [
        "长期记忆可能成为持久化攻击面",
        "需要跨模型/跨通道评测防御有效性",
        "形式化模型有助于把记忆规则从经验变成可验证边界"
      ],
      "examples": [
        "一个恶意网页让 agent 记住“以后汇报时隐藏风险”，这类污染可能在下一次任务才触发。"
      ],
      "product_implications": [
        "记忆系统应具备来源标签、作用域、撤销、审计和敏感字段隔离。"
      ],
      "limitations": [
        "论文场景与真实产品记忆系统仍有差距，需要结合具体权限模型落地。"
      ]
    },
    {
      "id": "paper-4",
      "dim": "paper",
      "title": "Hugging Face Data for Agents：社区开始把 Agent 数据视为独立基础设施",
      "source": "Hugging Face Blog",
      "url": "https://huggingface.co/blog",
      "date": "2026-07-08",
      "heat": "medium",
      "tags": [
        "Agent 数据",
        "开源生态",
        "评测"
      ],
      "summary": "Hugging Face blog 列表显示 Data for Agents 于 2026-07-08 发布，反映社区把 agent 可用数据、任务数据和评测数据单独拎出来建设。",
      "detail": "虽然当前检索只能看到 blog 索引层信息，但这个标题本身与近期生态趋势一致：agent 的瓶颈不只是模型，而是任务数据、工具调用轨迹、环境状态、失败样本和可复现评测集。普通 LLM 数据多是文本，而 agent 数据需要描述“在什么环境、拿到什么观察、调用什么工具、产生什么副作用、如何被评价”。这对开源社区很重要，因为没有共享数据，agent 框架很容易停留在 demo 和主观体验。对产品经理而言，未来 agent 平台可能需要像维护 prompt 一样维护任务样本库、失败库和回归评测集。边界是，未打开具体文章前不能过度推断实现细节，因此这里只把它作为研究雷达信号。 对研发实现而言，agent 数据通常至少包括观察、动作、工具返回、计划、错误、人工干预、最终产物和验收结果。只保存最终答案会让系统无法学习为什么成功，也无法定位为什么失败。对产品团队而言，这意味着每个可复用 agent workflow 都应该配套最小样本集、反例集和回归测试，而不是等用户报错后再临时补规则。 这也是为什么很多 agent demo 看起来很强，但一到生产就不稳定：它们缺少跨天积累的真实任务数据、失败样本和人工纠错记录。数据层做不好，后续无论是微调、检索增强还是 workflow 优化，都只能依赖零散经验。",
      "why": "agent 数据基础设施会决定评测、训练和产品迭代速度。",
      "buzz": "Hugging Face 官方 blog 索引，日期 2026-07-08。",
      "content_type": "official_research",
      "depth": "deep",
      "key_points": [
        "agent 数据不同于普通文本数据",
        "任务轨迹、工具调用和评测结果需要一起沉淀",
        "开源社区正在补数据层短板"
      ],
      "examples": [
        "每日资讯工作台本身也需要把来源、证据、校验结果沉淀为可复跑数据。"
      ],
      "product_implications": [
        "建设 Agent 平台时，应同步设计样本库和失败回放，而不是上线后再补。"
      ],
      "limitations": [
        "当前只基于官方索引信息，未展开文章全文细节。"
      ]
    },
    {
      "id": "oss-1",
      "dim": "oss",
      "title": "TradingAgents v0.3.1：修复前视过滤、图路由崩溃安全和加密情绪源",
      "source": "GitHub / TauricResearch",
      "url": "https://github.com/tauricresearch/tradingagents",
      "date": "2026-07",
      "heat": "high",
      "tags": [
        "金融/量化Agent",
        "Trading",
        "开源"
      ],
      "summary": "TradingAgents GitHub README 显示 2026-07 v0.3.1 发布，包含 Alpha Vantage look-ahead filtering、graph-router crash-safety、checkpoint resume、crypto sentiment source、LLM retry budget 等稳定性修复。",
      "detail": "这类更新比“新增模型支持”更有价值，因为它直指交易 agent 的生产风险：前视数据会污染回测，图路由崩溃会中断多 agent 决策链，checkpoint resume 决定长任务是否可恢复，情绪源和 retry budget 决定真实数据环境下的韧性。对金融/量化 agent 来说，正确性和稳定性比花哨 demo 更关键。",
      "why": "它是当前 AI+金融开源专项中最贴近可运行投研/交易框架的项目之一。",
      "buzz": "GitHub 官方仓库；README 新闻区列出 2026-07 更新。",
      "content_type": "github_repo",
      "depth": "normal"
    },
    {
      "id": "oss-2",
      "dim": "oss",
      "title": "AI-Trader：把 AI agent 当成交易平台原生参与者，而不是普通聊天机器人",
      "source": "GitHub / HKUDS",
      "url": "https://github.com/HKUDS/AI-Trader",
      "date": "2026-07-10",
      "heat": "medium",
      "tags": [
        "金融/量化Agent",
        "交易平台",
        "开源"
      ],
      "summary": "AI-Trader 仓库将自己定义为 Agent-Native Trading Platform，强调任何 AI agent 都可以加入交易平台交换想法、训练交易技能。",
      "detail": "这个项目的产品视角值得关注：它不是只做一个“问答式交易助手”，而是把 agent 放进交易平台角色里，强调 agent 之间的交流、训练和能力接入。潜在启发是，未来交易 agent 平台可能需要标准接口、回测沙箱、风险约束和排行榜，而不是单一 bot。边界是，仓库口径偏愿景化，不能把它等同于真实盈利能力。",
      "why": "符合 AI+金融/交易 agent 锚点，且代表 agent-native 产品形态。",
      "buzz": "GitHub 官方仓库；需要后续跟踪活跃度和真实运行案例。",
      "content_type": "github_repo",
      "depth": "normal"
    },
    {
      "id": "oss-3",
      "dim": "oss",
      "title": "FinRobot：开源本地金融分析 assistant，面向数据获取、多 agent 分析和研报生成",
      "source": "GitHub / AI4Finance Foundation",
      "url": "https://github.com/ai4finance-foundation/finrobot",
      "date": "2026-07-10",
      "heat": "medium",
      "tags": [
        "金融Agent",
        "投研报告",
        "开源"
      ],
      "summary": "FinRobot 仓库描述为可本地部署的 AI assistant，可获取金融数据、运行多 agent LLM 分析，并生成专业 equity research reports。",
      "detail": "FinRobot 与 TradingAgents 的差别在于，它更偏投研报告和分析交付，而不是交易执行。对 GateAI 显式专家功能有直接参考意义：用户可能不需要 agent 直接下单，而是要一份证据充分、结构清晰、可追溯来源的研报。边界是，本地部署仍需要 API key、数据源和模板质量，报告是否专业取决于数据和评测链路。",
      "why": "它连接了 AI agent、金融数据和研报交付三件事。",
      "buzz": "GitHub 官方仓库，适合作为金融报告 skill 对标样本。",
      "content_type": "github_repo",
      "depth": "normal"
    },
    {
      "id": "oss-4",
      "dim": "oss",
      "title": "GitLost 事件提醒：GitHub Agentic Workflows 的权限与公开输入组合会造成结构性泄漏",
      "source": "The Hacker News",
      "url": "https://thehackernews.com/2026/07/public-github-issue-could-trick-github.html",
      "date": "2026-07-07",
      "heat": "high",
      "tags": [
        "Agent安全",
        "Prompt Injection",
        "GitHub"
      ],
      "summary": "Noma Security 展示 GitLost：攻击者只需在公开 issue 写入诱导内容，就可能让拥有跨仓库读权限的 GitHub Agentic Workflow 把私有仓库信息贴到公开评论中。",
      "detail": "这不是普通漏洞新闻，而是开源 agent 工作流必须吸取的架构教训：当 agent 同时具备私有数据访问、读取不可信输入、公开输出三件事，就构成 Simon Willison 所说的 lethal trifecta。过滤器可以降低风险，但不能替代权限最小化、输出审查和隔离。对每日资讯工作台和 GateAI agent 平台来说，任何自动读取外部网页、GitHub issue、X 帖子的 agent，都必须假设输入里可能有恶意指令。",
      "why": "agent 工作流越自动化，权限边界越重要。",
      "buzz": "可靠安全媒体 + 研究机构披露；非营销。",
      "content_type": "analysis",
      "depth": "normal"
    },
    {
      "id": "fin-1",
      "dim": "fin",
      "title": "Robinhood CEO 预计 AI agents 将接近人类交易员并管理投资组合",
      "source": "Economic Times",
      "url": "https://m.economictimes.com/tech/artificial-intelligence/robinhood-ceo-says-ai-agents-will-soon-rival-human-traders-manage-portfolio/articleshow/132209127.cms",
      "date": "2026-07-07",
      "heat": "medium",
      "tags": [
        "AI投顾",
        "交易Agent",
        "Robinhood"
      ],
      "summary": "Robinhood CEO Vlad Tenev 近日表示，AI agents 正快速进步，未来可分析市场数据、执行交易并优化投资组合。",
      "detail": "这代表零售券商视角：AI agent 被想象为个人投资者的自动化组合管理者。但从 CLQT 等论文看，交易 agent 不能只靠“会分析”就上线，必须有成本、滑点、策略一致性、风控、适当性和可解释轨迹。对产品而言，这类表态是市场需求信号，不是产品可直接放开的依据。",
      "why": "零售金融平台开始公开讨论 agent 管理组合，值得跟踪监管和产品边界。",
      "buzz": "可靠媒体报道，但属于高层观点，需谨慎解读。",
      "content_type": "analysis",
      "depth": "normal"
    },
    {
      "id": "fin-2",
      "dim": "fin",
      "title": "OpenAI 招募投行业务专家，Applied AI 向金融服务工作流下沉",
      "source": "Business Insider",
      "url": "https://www.businessinsider.com/openai-hiring-expert-investment-banking-job-pay-experience-2026-7",
      "date": "2026-07-08",
      "heat": "medium",
      "tags": [
        "投行",
        "企业AI",
        "金融Agent"
      ],
      "summary": "报道称 OpenAI 正招聘 investment banking 背景专家加入 Applied AI，工作内容涉及金融分析、估值、尽调、交易执行和客户材料。",
      "detail": "这条信号说明大模型公司不只卖 API，而是在把垂直行业专家纳入产品和评测流程。投行场景的关键不是“会写报告”，而是要理解 valuation、diligence、materials、compliance 和 client-ready 交付标准。对 GateAI 金融专家功能而言，行业专家、模板、样例和验收标准会比通用 prompt 更关键。",
      "why": "金融服务成为大厂 Applied AI 的垂直落地方向。",
      "buzz": "媒体报道；需后续用官方岗位页或 OpenAI 公开信息交叉验证。",
      "content_type": "analysis",
      "depth": "normal"
    },
    {
      "id": "fin-3",
      "dim": "fin",
      "title": "Bank of England 风险讨论：Agentic AI 交易可能需要 kill switch 和市场级风控",
      "source": "RepresentAI / Reuters 引述",
      "url": "https://representai.co.uk/2026/07/02/ai-in-finance-todays-top-stories-02-july-2026/",
      "date": "2026-07-02",
      "heat": "medium",
      "tags": [
        "监管",
        "风控",
        "AI交易"
      ],
      "summary": "近期 AI in Finance 摘要提到 Bank of England 关注 agentic AI 对市场的潜在冲击，并讨论 kill switches 等控制机制。",
      "detail": "这与 Robinhood 对 AI portfolio agent 的乐观形成对照：一边是产品和券商看到自动化管理组合的机会，另一边是监管担心多个 agent 在市场中相互作用造成连锁风险。产品启发是，交易 agent 即使只做辅助分析，也应内置“不可直接交易/需人工确认/风险阈值/异常暂停”的清晰边界。",
      "why": "监管视角会决定 AI 交易 agent 的可上线形态。",
      "buzz": "二手摘要来源，标注为监管讨论线索；后续应补 Reuters/BoE 一手链接。",
      "content_type": "analysis",
      "depth": "normal"
    },
    {
      "id": "fin-4",
      "dim": "fin",
      "title": "BlueFin 与 CLQT 共同指向：AI 金融 Agent 的核心卖点应是证据链与诊断，而非收益承诺",
      "source": "arXiv synthesis",
      "url": "https://arxiv.org/abs/2606.29771",
      "date": "2026-07-10",
      "heat": "high",
      "tags": [
        "金融Agent",
        "评测",
        "产品策略"
      ],
      "summary": "结合 BlueFin 和 CLQT 两篇近期论文，金融 agent 的可行路径更像“可复核工作流 + 诊断报告”，而不是直接承诺替用户赚钱。",
      "detail": "BlueFin 告诉我们，专业金融表格任务仍有大量动态正确性问题；CLQT 告诉我们，组合管理 agent 不能用短期收益简单排名。两者放在一起，结论很清楚：金融 agent 的第一阶段产品价值应该是减少人工整理、提高证据链完整度、暴露风险和形成可复盘决策轨迹，而不是自动交易收益。对 GateAI 来说，这也符合 Jeff 的边界：辅助分析 OK，交易引导不行。",
      "why": "这能把 AI+金融方向从营销叙事拉回可验收产品。",
      "buzz": "基于两篇一手论文综合判断。",
      "content_type": "analysis",
      "depth": "normal"
    }
  ],
  "kol_list": [
    {
      "handle": "@karpathy",
      "name": "Andrej Karpathy",
      "field": "LLM 教育/agent 思辨",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@ylecun",
      "name": "Yann LeCun",
      "field": "世界模型/深度学习",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@demishassabis",
      "name": "Demis Hassabis",
      "field": "DeepMind CEO",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@ilyasut",
      "name": "Ilya Sutskever",
      "field": "对齐(SSI)",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@fchollet",
      "name": "François Chollet",
      "field": "ARC-AGI/Keras",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@drfeifei",
      "name": "Fei-Fei Li",
      "field": "空间智能(World Labs)",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@OpenAI",
      "name": "OpenAI",
      "field": "OpenAI 官方研究/产品",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@sama",
      "name": "Sam Altman",
      "field": "OpenAI CEO",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@gdb",
      "name": "Greg Brockman",
      "field": "OpenAI 总裁",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@merettm",
      "name": "Jakub Pachocki",
      "field": "OpenAI 首席科学家",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@DarioAmodei",
      "name": "Dario Amodei",
      "field": "Anthropic CEO",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@alexalbert__",
      "name": "Alex Albert",
      "field": "Anthropic DevRel",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@OfficialLoganK",
      "name": "Logan Kilpatrick",
      "field": "Google AI Studio",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@arthurmensch",
      "name": "Arthur Mensch",
      "field": "Mistral CEO",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@miramurati",
      "name": "Mira Murati",
      "field": "Thinking Machines",
      "platform": "X",
      "status": "watch"
    },
    {
      "handle": "@trq212",
      "name": "Thariq Shihipar",
      "field": "Anthropic Claude Code/研究员长文",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@bcherny",
      "name": "Boris Cherny",
      "field": "Claude Code 作者/loop",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@swyx",
      "name": "Shawn Wang",
      "field": "Latent Space/AI 工程",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@simonw",
      "name": "Simon Willison",
      "field": "agent 安全/prompt injection",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@steipete",
      "name": "Peter Steinberger",
      "field": "loop engineering 推手",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@addyosmani",
      "name": "Addy Osmani",
      "field": "agentic engineering(Google)",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@mipsytipsy",
      "name": "Charity Majors",
      "field": "可观测性/AI 工程",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@omarsar0",
      "name": "Elvis Saravia",
      "field": "prompt(DAIR.AI)",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@natolambert",
      "name": "Nathan Lambert",
      "field": "post-training(Ai2)",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@jeremyphoward",
      "name": "Jeremy Howard",
      "field": "fast.ai/模型评测",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@Teknium",
      "name": "Teknium",
      "field": "Nous Research",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@Zai_org",
      "name": "Z.ai (智谱)",
      "field": "GLM 开源模型",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@jietang",
      "name": "唐杰",
      "field": "Z.ai/智谱 创始人与 GLM",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@Kimi_Moonshot",
      "name": "Kimi.ai",
      "field": "Moonshot/Kimi 官方模型更新",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@METR_Evals",
      "name": "METR",
      "field": "危险能力评测",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@apolloaievals",
      "name": "Apollo Research",
      "field": "对齐/欺骗评测",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@DrJimFan",
      "name": "Jim Fan",
      "field": "具身智能(NVIDIA)",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@JohnJumperSci",
      "name": "John Jumper",
      "field": "AI for science(诺奖→Anthropic)",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@chelseabfinn",
      "name": "Chelsea Finn",
      "field": "机器人(Physical Intelligence)",
      "platform": "X",
      "status": "watch"
    },
    {
      "handle": "@svlevine",
      "name": "Sergey Levine",
      "field": "机器人 RL",
      "platform": "X",
      "status": "watch"
    },
    {
      "handle": "@_akhaliq",
      "name": "AK",
      "field": "论文/demo 第一传播",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@rohanpaul_ai",
      "name": "Rohan Paul",
      "field": "AI 资讯/论文解读",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@kimmonismus",
      "name": "Chubby",
      "field": "AI 突发快报",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@mreflow",
      "name": "Matt Wolfe",
      "field": "AI 工具科普",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@sharbel",
      "name": "Sharbel",
      "field": "GitHub 增速榜/开源情报",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@seelffff",
      "name": "self.dll",
      "field": "开源 repo 速递",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@emollick",
      "name": "Ethan Mollick",
      "field": "AI 与职场(Wharton)",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@AndrewYNg",
      "name": "Andrew Ng",
      "field": "AI 教育/趋势",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@bindureddy",
      "name": "Bindu Reddy",
      "field": "企业 AI agent(Abacus)",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@a16z",
      "name": "a16z",
      "field": "AI 投资",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@martin_casado",
      "name": "Martin Casado",
      "field": "AI 投资/政策(a16z)",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@0xCodez",
      "name": "Codez",
      "field": "loop engineering 解读",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@sairahul1",
      "name": "Rahul",
      "field": "loop/agent 工程",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@AravSrinivas",
      "name": "Aravind Srinivas",
      "field": "Perplexity CEO",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@shawmakesmagic",
      "name": "Shaw Walters",
      "field": "Eliza 框架",
      "platform": "X",
      "status": "keep"
    },
    {
      "handle": "@aixbt_agent",
      "name": "aixbt",
      "field": "AI×crypto 情报 agent",
      "platform": "X",
      "status": "watch"
    },
    {
      "handle": "@KyleSamani",
      "name": "Kyle Samani",
      "field": "Multicoin/理性质疑",
      "platform": "X",
      "status": "watch"
    },
    {
      "handle": "@bengoertzel",
      "name": "Ben Goertzel",
      "field": "去中心化 AI/AGI",
      "platform": "X",
      "status": "watch"
    },
    {
      "handle": "@op7418",
      "name": "歸藏 (guizang.ai)",
      "field": "AI 视觉/资讯(AIGC Weekly)",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@dotey",
      "name": "宝玉 (Baoyu)",
      "field": "AI 工程/翻译",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@_zheergen",
      "name": "爱吃折耳根的Ace",
      "field": "AI+股票投研(UZI-Skill)",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "微博·歸藏的AI工具箱",
      "name": "歸藏",
      "field": "AI 工具",
      "platform": "微博",
      "status": "new"
    },
    {
      "handle": "微博·宝玉xp",
      "name": "宝玉",
      "field": "AI 工程",
      "platform": "微博",
      "status": "new"
    },
    {
      "handle": "即刻·orange.ai",
      "name": "Orange",
      "field": "AI 创业/内容",
      "platform": "即刻",
      "status": "watch"
    }
  ],
  "practice_list": [
    "对 GateAI 长任务：把任务计划、审批、文件产出、失败恢复和推送做成产品对象，而不是只暴露模型入口。",
    "对 AI+金融：优先建设可复算证据链、表格/报告 artifact 校验、成本与时间门评测，避免直接交易引导。",
    "对 Agent 安全：任何读取外部输入且能访问私有数据的流程，都需要最小权限、输出审查和人工 gate。"
  ]
};
