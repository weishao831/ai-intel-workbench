// 当日聚合数据（由 Daily Intelligence Workbench 生成）。
window.__DAILY__ = window.__DAILY__ || {};
window.__DAILY__["2026/07/20"] = {
  "date": "2026-07-20",
  "date_cn": "2026年7月20日 · 周一",
  "generated_at": "2026-07-20T17:06:11+08:00",
  "language": "zh",
  "quality_version": 2,
  "refresh_note": "本次重跑采用 X-first 双层证据：Gate CLI 和公开搜索只负责发现候选，少量具体 X status/article 再由交互式浏览器核验；定时任务不自动化访问 X，不复用登录态，不绕过登录墙或安全挑战。",
  "market_mood": "今天的主线不是又一个模型榜单，而是 AI 如何进入组织的执行层：Agent 的权限、工作流、评测、观测和人工接管正在一起成为产品边界。AGI 讨论也正在从时间线猜测转向标准、测试与部署责任。以下内容仅作技术与产品情报，不构成投资建议。",
  "dimensions": [
    {
      "key": "lab",
      "cn": "AI 大厂动态",
      "overview": "实验室与产业研究的重点从能力展示转向评测、治理和组织流程：模型进入真实系统后，权限、监控、审批和可回放性成为同等重要的产品能力。",
      "notes": "优先保留具体文章深链；研究索引页只作发现，不作为独立条目。"
    },
    {
      "key": "kol",
      "cn": "KOL 观点",
      "overview": "本轮以 X 为主入口，保留 5 条可逐帖复核的具体 status/article：Demis Hassabis 的 Frontier AI 长文，以及 Ethan Mollick、Stork.Ai 的近期讨论。",
      "notes": "KOL 条目 5/5 使用具体 X status/article；profile、with_replies、搜索页和 Gate CLI 摘要没有计入观点。"
    },
    {
      "key": "paper",
      "cn": "前沿论文",
      "overview": "Agent 评测正在从单次问答扩展到真实仓库、工具轨迹、任务环境和长期可靠性；评测基础设施本身开始成为研究对象。",
      "notes": "论文优先使用 arXiv 具体摘要页；预印本用于发现和产品假设，不等于生产性能证明。"
    },
    {
      "key": "oss",
      "cn": "开源项目",
      "overview": "开源侧的热度信号集中在 Agent 交易研究、工具调用和执行基础设施；热度用于发现，GitHub 仓库用于核对机制与限制。",
      "notes": "stars 或 Trending 不代表安全、成熟度或实盘适用性；金融项目必须先做权限、数据时点、模拟和审批隔离。"
    },
    {
      "key": "fin",
      "cn": "AI × 金融",
      "overview": "金融 Agent 的核心问题正在被拆成可执行工具、专业推理、数据时效、监管范围和人工复核，而不是只比较回答是否流畅。",
      "notes": "覆盖金融 Agent 评测与工作流治理；所有内容仅作技术与产品情报，不构成投资建议。"
    }
  ],
  "hot_topics_today": [
    {
      "title": "AI 进入组织执行层：Agent 权限和流程改造先于规模化",
      "heat": "high",
      "dims": [
        "lab",
        "kol"
      ],
      "summary": "近期企业讨论的共同点不是要不要用 AI，而是 Agent 能否在明确的任务范围、权限窗口、工具清单和责任链内工作。治理开始从一套静态政策，转向按角色、任务和风险动态授权。",
      "related": [
        "lab-3",
        "lab-4",
        "lab-5",
        "kol-2",
        "kol-5"
      ]
    },
    {
      "title": "AGI 讨论从时间线猜测转向标准、测试与部署责任",
      "heat": "high",
      "dims": [
        "lab",
        "kol"
      ],
      "summary": "Demis Hassabis 的长文与 X 上的跟进讨论，把 Frontier AI 的关键问题落到独立测试、标准机构、风险分级和部署责任。争论重点由什么时候到 AGI 转向如何证明系统足够安全。",
      "related": [
        "kol-1",
        "kol-3",
        "kol-4",
        "lab-2"
      ]
    },
    {
      "title": "Agent 能力增长后，生产可靠性成为真正瓶颈",
      "heat": "high",
      "dims": [
        "lab",
        "paper"
      ],
      "summary": "OpenAI 的自动化红队研究和 AgentCompass 等评测工作都说明，模型会不会完成一次任务只是起点；企业更需要知道它在真实环境中是否稳定、可回放、可解释并能在失败时降级。",
      "related": [
        "lab-1",
        "paper-1",
        "paper-2"
      ]
    },
    {
      "title": "金融 Agent 先做受控研究与工具调用，再谈自动执行",
      "heat": "medium",
      "dims": [
        "paper",
        "oss",
        "fin"
      ],
      "summary": "金融场景正在把 Agent 拆成数据读取、分析、订单草稿、模拟和真实执行等风险等级。评测和开源工具的共同启发是：可复现数据、限额、审批与审计必须先于自动下单。",
      "related": [
        "paper-2",
        "oss-1",
        "fin-1"
      ]
    }
  ],
  "items": [
    {
      "id": "lab-1",
      "dim": "lab",
      "title": "OpenAI GPT-Red：把自动化红队变成可持续的模型安全测试",
      "orig": "Unlocking self-improvement: GPT-Red",
      "source": "OpenAI Research",
      "url": "https://openai.com/index/unlocking-self-improvement-gpt-red/",
      "date": "2026-07-15",
      "heat": "high",
      "tags": [
        "模型安全",
        "红队",
        "Agent 可靠性"
      ],
      "summary": "OpenAI 介绍 GPT-Red，用自动化系统进行提示注入、越权和鲁棒性测试。重点不只是找到一个漏洞，而是让攻击样本生成、评估和修复验证形成可重复的回归闭环。",
      "detail": "GPT-Red 的产品意义在于把红队从一次性的安全演示推进为可以持续运行的测试基础设施。对 Agent 来说，风险往往不是模型单独回答了什么，而是它在拿到工具、外部文档或用户输入后是否会改变任务边界：例如把网页里的恶意指令当成系统指令，绕过审批调用高风险工具，或在失败后反复重试造成成本和权限扩散。自动化红队可以扩大攻击样本覆盖，但不能替代真实部署者对业务风险的定义。上线前仍需要固定版本、固定权限、固定工具集和人工审查，记录每次测试的输入、模型版本、工具轨迹、失败分类与修复结果。产品经理可以把它转成三类验收资产：安全回归集、按风险等级的阻断规则、以及每次发布都要通过的可追溯报告。这样，模型能力升级不会默默把 Agent 的攻击面一起扩大。落到每日情报工作台本身，Gate CLI 返回的标题、摘要和 URL 也应被视为待测输入：先检查 URL 是否是具体帖子，过滤占位数字 ID，再进入浏览器或原文核对；任何一层失败，都不能因为语言模型已经生成了流畅总结而放行。更长期的做法是把安全回归与内容质量回归放在同一个运行记录里，分别标注来源真实性、时间新鲜度、上下文完整度和安全风险。从产品落地看，今天这些材料都可以转换成同一张验收清单：来源是否能回到原文，日期是否在数据截止日之前，模型或 Agent 的输入和工具是否可复现，权限是否只覆盖当前任务，失败后是否能中止并恢复，最后的判断是否由明确责任人确认。对情报工作台，这张清单还要增加候选是否来自真实近期讨论、是否经过具体页面核验、是否与过去七期重复、是否有独立来源支撑热点。这样做的目的不是把每条新闻写成合规报告，而是让“值得关注”能够被解释、被复查，也能在下一次运行中根据失败记录调整搜索词和来源优先级。",
      "why": "Agent 进入企业后，安全验收需要从人工抽查变成可持续的回归测试。",
      "why_now": "OpenAI 官方页面于 2026-07-15 发布，直接对应近期的 Agent 安全与可靠性讨论。",
      "buzz": "官方研究发布。",
      "content_type": "official_research",
      "depth": "deep",
      "topic_cluster": "agent-reliability",
      "recency_role": "current",
      "key_points": [
        "自动化红队扩大攻击样本覆盖",
        "提示注入与越权应进入回归集",
        "测试结果需要和模型版本及工具轨迹绑定"
      ],
      "examples": [
        "在同一权限和工具集合下，对每个模型版本运行提示注入、越权调用和失败重试测试。"
      ],
      "product_implications": [
        "建立发布前安全回归门",
        "为高风险工具配置独立阻断规则",
        "保存模型、提示、工具和修复结果的版本关系"
      ],
      "limitations": [
        "自动化测试不能证明系统在所有真实业务上下文中安全",
        "研究结果不等于任一企业部署的合规结论"
      ],
      "meta": {}
    },
    {
      "id": "lab-2",
      "dim": "lab",
      "title": "DeepMind 的 Bioresilience：前沿 AI 治理连接生物安全与科研基础设施",
      "orig": "Our approach to bioresilience",
      "source": "Google DeepMind",
      "url": "https://deepmind.google/blog/our-approach-to-bioresilience/",
      "date": "2026-07-16",
      "heat": "high",
      "tags": [
        "Frontier AI",
        "生物安全",
        "治理"
      ],
      "summary": "Google DeepMind 讨论如何把模型滥用防护、科研合作和生物安全韧性放在同一个体系里。对 AGI 议题的启发是，能力治理不再只是模型发布时的一次检查。",
      "detail": "Bioresilience 把前沿模型的风险放到了一个更具体的现实系统里：模型可能帮助科学研究提速，也可能降低某些高风险知识的获取门槛。应对方式不能只靠在模型输出端加一条拒答规则，而要把模型能力边界、使用场景、用户身份、工具权限、专家参与和事件响应组合起来。对产品团队而言，这意味着安全应当在工作流层表达：什么问题允许回答，什么问题必须转人工，哪些外部工具可用，哪些数据和实验步骤需要额外授权，以及发生异常时如何保留证据并通知责任人。它也说明 AGI 的治理不是单个公司可以独立完成的产品功能，而需要研究机构、政府、行业和专业领域共同建立测试与应急机制。保留这类更新，是为了避免只追逐模型参数和发布日期，而忽略能力进入真实社会系统后产生的连锁责任。这对组织产品还有一个边界：越接近高影响领域，越不能把“模型拒答率”当成唯一安全指标。需要同时看误拒绝、漏拦截、专家升级是否及时、工具是否仍被绕过，以及事件发生后能否重建完整经过。对于每天的雷达，应该把标准、测试、风险分级和责任主体作为可持续追踪的结构化字段，而不是只在文章摘要里写一句“注意安全”。从产品落地看，今天这些材料都可以转换成同一张验收清单：来源是否能回到原文，日期是否在数据截止日之前，模型或 Agent 的输入和工具是否可复现，权限是否只覆盖当前任务，失败后是否能中止并恢复，最后的判断是否由明确责任人确认。对情报工作台，这张清单还要增加候选是否来自真实近期讨论、是否经过具体页面核验、是否与过去七期重复、是否有独立来源支撑热点。这样做的目的不是把每条新闻写成合规报告，而是让“值得关注”能够被解释、被复查，也能在下一次运行中根据失败记录调整搜索词和来源优先级。",
      "why": "Frontier AI 的治理需要覆盖能力、场景、身份和事件响应，而不只是输出过滤。",
      "why_now": "Google DeepMind 官方页面于 2026-07-16 更新，位于近期 AGI 安全与责任讨论窗口内。",
      "buzz": "官方博客。",
      "content_type": "official_research",
      "depth": "deep",
      "topic_cluster": "frontier-governance",
      "recency_role": "current",
      "key_points": [
        "生物安全是 Frontier AI 治理的现实案例",
        "安全要延伸到身份、工具和事件响应",
        "单一模型拒答不能替代系统治理"
      ],
      "examples": [
        "高风险科研请求进入专家复核，并记录用户身份、数据来源和工具调用链。"
      ],
      "product_implications": [
        "把风险分级和人工升级设计成工作流状态",
        "为敏感领域设置领域专家和事件响应机制"
      ],
      "limitations": [
        "官方框架是治理方向，不是某个产品或司法辖区的完整合规方案"
      ],
      "meta": {}
    },
    {
      "id": "lab-3",
      "dim": "lab",
      "title": "企业 AI 进入生产前，治理规则正在从防泄露升级到管 Agent 行为",
      "orig": "Why AI coding agents keep stalling before production and the governance controls that fix it",
      "source": "TechRadar Pro",
      "url": "https://www.techradar.com/pro/why-ai-coding-agents-keep-stalling-before-production-and-the-governance-controls-that-fix-it",
      "date": "2026-07-13",
      "heat": "high",
      "tags": [
        "企业 AI",
        "编码 Agent",
        "治理"
      ],
      "summary": "企业编码 Agent 迟迟进不了生产，原因往往不是模型不会写代码，而是权限、MCP 工具、身份、日志和审批没有形成可运营的控制面。",
      "detail": "这类企业分析把 Agent 的落地阻力指向一个经常被低估的层面：组织已经有身份系统、代码仓库、部署流程和合规要求，但 Agent 进入后会同时触碰这些系统。若仍按普通聊天机器人管理，只给它一个宽泛的服务账号，企业就很难回答谁授权了什么、Agent 实际调用了哪些工具、变更经过了哪一层审批，以及失败后能否快速回滚。更合理的设计是把任务范围和工具范围绑定：只允许 Agent 访问完成当前任务所需的仓库和环境，读写权限分离，高风险操作需要人确认，所有调用都有可检索日志。MCP 的价值是标准化工具连接，但标准化连接本身不等于安全授权。对 B 端产品来说，真正的竞争力可能从模型能做多少转移到组织能否放心让它做什么，包括权限模板、沙箱、变更预览、审计和异常接管。这也解释了为什么很多 POC 看起来成功，却没有进入生产：演示只验证了模型能完成一条 happy path，真正上线需要验证组织能否持续运营这条路径。验收时至少要覆盖权限过期、工具不可用、上下文冲突、审批超时、错误回滚和用户撤销授权等失败状态。工作台可以把这些失败模式作为反向搜索词，让情报从模型发布新闻转向企业真实阻力。从产品落地看，今天这些材料都可以转换成同一张验收清单：来源是否能回到原文，日期是否在数据截止日之前，模型或 Agent 的输入和工具是否可复现，权限是否只覆盖当前任务，失败后是否能中止并恢复，最后的判断是否由明确责任人确认。对情报工作台，这张清单还要增加候选是否来自真实近期讨论、是否经过具体页面核验、是否与过去七期重复、是否有独立来源支撑热点。这样做的目的不是把每条新闻写成合规报告，而是让“值得关注”能够被解释、被复查，也能在下一次运行中根据失败记录调整搜索词和来源优先级。",
      "why": "直接回答 AI 怎么进入一个组织：关键不是接入一个模型，而是建立 Agent 的运营控制面。",
      "why_now": "文章发表于 2026-07-13，正处于本周企业 AI 讨论窗口。",
      "buzz": "行业分析。",
      "content_type": "analysis",
      "depth": "deep",
      "topic_cluster": "organization-ai",
      "recency_role": "current",
      "key_points": [
        "生产阻力来自权限与运营控制",
        "MCP 连接能力不能替代授权设计",
        "任务范围、工具范围与审批应绑定"
      ],
      "examples": [
        "代码 Agent 只能在临时分支读取指定仓库，合并和部署必须由人确认。"
      ],
      "product_implications": [
        "建设 Agent 身份、权限模板和审计日志",
        "提供工具调用预览、沙箱和一键中止"
      ],
      "limitations": [
        "行业分析不替代企业自身的安全、合规和架构评估"
      ],
      "meta": {}
    },
    {
      "id": "lab-4",
      "dim": "lab",
      "title": "BCG：受监管行业的企业 Agent 需要分层编排与治理运营层",
      "orig": "Building enterprise AI agents in regulated industries",
      "source": "Boston Consulting Group",
      "url": "https://www.bcg.com/publications/2026/building-enterprise-ai-agents-in-regulated-industries",
      "date": "2026-07-20",
      "heat": "high",
      "tags": [
        "企业 AI",
        "多 Agent",
        "受监管行业"
      ],
      "summary": "BCG 将企业 Agent 的规模化拆成多 Agent 编排、共享意图与记忆、权限评估，以及独立的治理和运营层。受监管行业需要先把责任边界做成架构。",
      "detail": "企业 Agent 的难题会在规模化后暴露：一个 Agent 处理客户请求，另一个读取内部知识，第三个调用交易或审批工具，它们之间的上下文、权限和责任不能靠提示词约定。分层编排和治理运营层的启发是把 Agent 系统视为一个组织化的执行网络，而不是多个聊天窗口的简单叠加。每个 Agent 应有清晰的角色、输入输出、可用工具和最大权限；编排器负责任务拆解与状态传递，治理层负责身份、授权、评测、观察和事件处理。共享记忆也必须区分临时任务上下文、团队知识和敏感业务数据，不能因为方便协作就全部互通。一旦进入跨部门、跨系统和受监管场景，就需要角色目录、权限矩阵、评测集、审计回放和人工升级路径。对产品架构而言，治理运营层不应只是后台设置页，而应能回答四个可观测问题：现在有哪些 Agent 在运行，它们代表谁；本次任务获得了哪些数据和工具权限；出现异常时谁能暂停、接管和复盘；版本升级后哪些评测重新通过。只有这些问题能够被日志和界面直接回答，多 Agent 才从概念演示变成组织可以承担的生产能力。从产品落地看，今天这些材料都可以转换成同一张验收清单：来源是否能回到原文，日期是否在数据截止日之前，模型或 Agent 的输入和工具是否可复现，权限是否只覆盖当前任务，失败后是否能中止并恢复，最后的判断是否由明确责任人确认。对情报工作台，这张清单还要增加候选是否来自真实近期讨论、是否经过具体页面核验、是否与过去七期重复、是否有独立来源支撑热点。这样做的目的不是把每条新闻写成合规报告，而是让“值得关注”能够被解释、被复查，也能在下一次运行中根据失败记录调整搜索词和来源优先级。",
      "why": "把 AI 进入组织后的多 Agent 协作、权限和责任链结构化。",
      "why_now": "BCG 页面于 2026-07-20 发布，直接对应今天的企业 Agent 讨论。",
      "buzz": "行业研究。",
      "content_type": "analysis",
      "depth": "deep",
      "topic_cluster": "organization-ai",
      "recency_role": "current",
      "key_points": [
        "多 Agent 规模化需要分层编排",
        "治理与运营层应独立存在",
        "共享记忆必须按敏感度和任务范围分层"
      ],
      "examples": [
        "客户服务 Agent 可生成退款建议，但退款执行工具必须由受限审批 Agent 调用。"
      ],
      "product_implications": [
        "先设计 Agent 角色目录与权限矩阵",
        "把评测、日志、授权和人工升级做成平台能力"
      ],
      "limitations": [
        "框架提供方向，具体落地仍取决于组织流程和监管要求"
      ],
      "meta": {}
    },
    {
      "id": "lab-5",
      "dim": "lab",
      "title": "PwC：Agent workforce 的权限应按角色、交互和任务范围动态治理",
      "orig": "Agent workforce governance",
      "source": "PwC",
      "url": "https://www.pwc.com/us/en/industries/tmt/library/trust-and-safety-outlook/ai-agents-workforce-governance.html",
      "date": "2026-07-17",
      "heat": "high",
      "tags": [
        "企业 AI",
        "Agent 治理",
        "权限"
      ],
      "summary": "PwC 建议把 AI Agent 当作组织中的新型工作角色治理：权限窗口缩短、任务范围明确、交互被监控，并保留责任和追踪关系。",
      "detail": "当 Agent 从助手变成可以连续执行任务的数字劳动力，传统静态账号和一次性授权会变得危险。治理可以拆成角色、交互和任务范围三层：Agent 身份需要有负责人、业务目的和生命周期；每次任务只授予必要的工具与数据权限，并尽量使用短时、可撤销的授权窗口；对 Agent 与用户、其他 Agent、外部系统之间的交互进行监控，能够在异常时中止并定位责任。监控不只是保存聊天文本，还包括调用了什么、读写了什么、是否改变了任务目标、是否触发了人工升级。组织不是在购买一个更聪明的聊天框，而是在引入一个需要入职、授权、监督和退出机制的新执行主体。动态授权也不等于每次都弹窗打断用户。更好的体验是先由组织定义风险策略：低风险只读任务自动通过，中风险写入草稿或临时空间，高风险跨系统执行必须展示影响范围并由责任人确认。这样，治理规则既能缩短准备时间，也能避免把所有 Agent 都做成无法使用的审批机器人。从产品落地看，今天这些材料都可以转换成同一张验收清单：来源是否能回到原文，日期是否在数据截止日之前，模型或 Agent 的输入和工具是否可复现，权限是否只覆盖当前任务，失败后是否能中止并恢复，最后的判断是否由明确责任人确认。对情报工作台，这张清单还要增加候选是否来自真实近期讨论、是否经过具体页面核验、是否与过去七期重复、是否有独立来源支撑热点。这样做的目的不是把每条新闻写成合规报告，而是让“值得关注”能够被解释、被复查，也能在下一次运行中根据失败记录调整搜索词和来源优先级。实际界面还应支持权限快照、任务暂停和责任转移，否则动态治理只停留在政策层。",
      "why": "把 Agent 作为组织角色治理，为权限、责任和审计提供产品化边界。",
      "why_now": "PwC 页面于 2026-07-17 更新，处在当前企业治理讨论窗口。",
      "buzz": "行业治理观点。",
      "content_type": "analysis",
      "depth": "deep",
      "topic_cluster": "organization-ai",
      "recency_role": "current",
      "key_points": [
        "Agent 需要明确负责人和生命周期",
        "权限应短时、最小化、可撤销",
        "监控需要覆盖跨系统交互与责任链"
      ],
      "examples": [
        "报销 Agent 只能在当前申请范围内读票据，提交付款前必须重新授权并由员工确认。"
      ],
      "product_implications": [
        "提供 Agent 注册、授权、暂停和退出流程",
        "以任务为单位生成可审计的权限快照"
      ],
      "limitations": [
        "治理框架需要结合企业 IAM、隐私和监管政策实施"
      ],
      "meta": {}
    },
    {
      "id": "kol-1",
      "dim": "kol",
      "title": "Demis Hassabis：Frontier AI 需要独立标准、测试和跨机构责任机制",
      "orig": "A Framework for Frontier AI and the Dawning of a New Age",
      "source": "X / Demis Hassabis",
      "url": "https://x.com/demishassabis/status/2076957440109625718",
      "date": "2026-07-14",
      "heat": "high",
      "tags": [
        "X",
        "AGI",
        "Frontier AI",
        "治理"
      ],
      "summary": "Demis Hassabis 在 X 发布并指向一篇长文，讨论 Frontier AI 进入新阶段后，需要独立标准机构、能力评测、风险分级与国际协作来承接 AGI 级别的责任。",
      "detail": "这篇长文的关键不是给出 AGI 的具体日期，而是提出一套面对能力跃迁的治理框架。其逻辑可以拆成四层：先承认 Frontier AI 的能力会快速增长，并可能进入科学、经济和公共系统；再建立独立、可复核的能力与安全测试，使外界不必完全依赖发布方自己的声明；随后按能力和风险对系统进行分级，把不同部署场景对应到不同的限制、监控和人工责任；最后通过标准机构、政府、研究者和产业合作，把安全要求变成可以持续更新的公共基础设施。对产品团队来说，最值得迁移的不是宏大叙事，而是先定义什么要测、谁来测、测不过怎么办：模型能力、工具权限、数据范围、外部影响和人工接管都应进入发布门槛。因此，AGI 相关情报的质量门不能只判断来源是不是一位知名人物，还要判断观点是否包含可验证的机制、时间范围和责任条件。对这条长文，最可复用的产品问题是：独立测试的对象是什么、标准能否被外部复现、风险分级是否会改变权限、以及部署者是否有明确的停止条件。把这些问题保留下来，后续遇到新的模型发布或政策变化时才有真正的比较基准。从产品落地看，今天这些材料都可以转换成同一张验收清单：来源是否能回到原文，日期是否在数据截止日之前，模型或 Agent 的输入和工具是否可复现，权限是否只覆盖当前任务，失败后是否能中止并恢复，最后的判断是否由明确责任人确认。对情报工作台，这张清单还要增加候选是否来自真实近期讨论、是否经过具体页面核验、是否与过去七期重复、是否有独立来源支撑热点。这样做的目的不是把每条新闻写成合规报告，而是让“值得关注”能够被解释、被复查，也能在下一次运行中根据失败记录调整搜索词和来源优先级。",
      "why": "把 AGI 讨论从时间线猜测转成可验证的标准、测试和部署责任。",
      "why_now": "X 页面显示该条发布于 2026-07-14；本轮于 2026-07-20 通过交互式浏览器打开具体 status 并核对正文与作者。",
      "buzz": "X status；浏览器交互式核验。",
      "content_type": "x_article",
      "depth": "deep",
      "topic_cluster": "frontier-governance",
      "recency_role": "current",
      "x_src": [
        "https://x.com/demishassabis/status/2076957440109625718"
      ],
      "evidence": {
        "provider": "interactive_browser",
        "verified_url": "https://x.com/demishassabis/status/2076957440109625718",
        "verified_at": "2026-07-20",
        "published_at": "2026-07-14",
        "direct": true
      },
      "key_points": [
        "AGI 讨论重点转向标准与测试",
        "需要独立、可复核的能力与安全评估",
        "部署责任要由机构协作承接"
      ],
      "examples": [
        "发布前同时报告能力评测、滥用风险、工具权限和人工接管条件。"
      ],
      "product_implications": [
        "把模型发布门槛拆成能力、风险、权限和责任四类检查",
        "为高影响 Agent 预留独立评测与事件响应机制"
      ],
      "limitations": [
        "这是个人框架与倡议，不等于已生效的监管标准",
        "X 长文讨论不能直接证明某个模型已经达到 AGI"
      ],
      "meta": {
        "readable_copy": "https://demishassabis.substack.com/p/a-framework-for-frontier-ai-and-the-dawning-of-a-new-age"
      }
    },
    {
      "id": "kol-2",
      "dim": "kol",
      "title": "Ethan Mollick：开放模型扩散会让 CISO 的准备窗口变短",
      "orig": "Ethan Mollick on open-model diffusion and CISO preparation",
      "source": "X / Ethan Mollick",
      "url": "https://x.com/emollick/status/2079030868413182298",
      "date": "2026-07-20",
      "heat": "high",
      "tags": [
        "X",
        "企业 AI",
        "安全",
        "开放模型"
      ],
      "summary": "Ethan Mollick 提醒，类似 Mythos 级别的开放模型一旦扩散，企业 CISO 可能没有太多时间准备。观点把模型能力变化直接连接到了组织安全准备。",
      "detail": "这条观点没有把开放模型只当成更便宜的模型选择，而是把它视为企业安全准备的时间问题。闭源模型的能力提升通常经过供应商的发布、策略和访问控制；开放模型扩散后，员工、供应商和攻击者可能在更短时间内获得相近能力，组织原有的检测、数据分级、代码审查、外部工具控制和事件响应未必同步升级。安全能力不能等模型进入内部以后才补，需要预先知道哪些数据能被模型读取，哪些工具调用必须阻断，如何发现影子 AI 使用，以及当新模型进入组织时如何快速完成回归测试。这里不应把模型强直接当成必然造成事故，而应把它作为缩短准备周期的风险信号，推动治理从审批文档走向持续监控和演练。",
      "why": "把开放模型扩散的能力变化转译成企业准备周期、影子 AI 和安全控制问题。",
      "why_now": "X 搜索结果显示该帖约于 2026-07-20 发布；本轮通过具体 status 页面核对作者和正文。",
      "buzz": "X status；浏览器交互式核验。",
      "content_type": "x_status",
      "depth": "normal",
      "topic_cluster": "organization-ai",
      "recency_role": "current",
      "x_src": [
        "https://x.com/emollick/status/2079030868413182298"
      ],
      "evidence": {
        "provider": "interactive_browser",
        "verified_url": "https://x.com/emollick/status/2079030868413182298",
        "verified_at": "2026-07-20",
        "published_at": "2026-07-20",
        "direct": true
      },
      "key_points": [
        "开放模型扩散会缩短企业准备窗口",
        "影子 AI 与数据边界需要提前治理",
        "能力信号应转成持续回归和应急演练"
      ],
      "examples": [
        "新模型进入企业前自动跑敏感数据、代码仓库和工具调用回归集。"
      ],
      "product_implications": [
        "建设模型准入清单与影子 AI 发现",
        "把 CISO 的准备工作变成可观测的控制面"
      ],
      "limitations": [
        "这是风险判断，不是对某一模型扩散速度或事故概率的预测"
      ],
      "meta": {}
    },
    {
      "id": "kol-3",
      "dim": "kol",
      "title": "Ethan Mollick：闭源 Frontier AI 获得审批，开放模型却缺少对应约束",
      "orig": "Ethan Mollick on regulation asymmetry between closed and open frontier models",
      "source": "X / Ethan Mollick",
      "url": "https://x.com/emollick/status/2078847609309991342",
      "date": "2026-07-19",
      "heat": "high",
      "tags": [
        "X",
        "AGI",
        "开放模型",
        "监管"
      ],
      "summary": "Ethan Mollick 讨论美国监管对闭源 Frontier 模型的批准与约束正在增长，但对开放模型的对应治理不足，形成新的政策不对称。",
      "detail": "这条观点把 Frontier AI 治理中的结构性矛盾说得很清楚：闭源模型通常由少数公司发布，监管可以围绕发布方、访问接口和部署场景建立责任；开放模型一旦公开权重，模型能力可能被下载、改造和部署到不同环境，原有监管接口就变得模糊。它并不意味着开放模型应该一概禁止，而是提醒产品和政策设计不能只盯着发布瞬间的许可。对组织而言，现实回应是建立模型来源、版本、微调方式、数据权限和部署位置的资产清单，并按能力风险而不是是不是 API 来设定控制。模型路由、工具权限、敏感数据和人工审批应当解耦，避免换一个开放模型就绕过原有安全边界。",
      "why": "补足 AGI 讨论中的开放模型治理视角，连接政策不对称与企业模型准入。",
      "why_now": "X 页面显示该帖发布于 2026-07-19；本轮通过具体 status 页面核对作者、时间和可见正文。",
      "buzz": "X status；浏览器交互式核验。",
      "content_type": "x_status",
      "depth": "normal",
      "topic_cluster": "frontier-governance",
      "recency_role": "current",
      "x_src": [
        "https://x.com/emollick/status/2078847609309991342"
      ],
      "evidence": {
        "provider": "interactive_browser",
        "verified_url": "https://x.com/emollick/status/2078847609309991342",
        "verified_at": "2026-07-20",
        "published_at": "2026-07-19",
        "direct": true
      },
      "key_points": [
        "闭源与开放模型的监管接口不同",
        "治理应按能力和部署风险，而不是只按 API 形态",
        "模型路由不应绕过工具和数据安全边界"
      ],
      "examples": [
        "企业给开放权重模型建立与闭源模型相同的敏感数据、工具和版本准入检查。"
      ],
      "product_implications": [
        "建立模型资产与部署位置清单",
        "将模型准入、工具权限和数据分级分开治理"
      ],
      "limitations": [
        "帖文是政策观察，不是法律意见或监管结论"
      ],
      "meta": {}
    },
    {
      "id": "kol-4",
      "dim": "kol",
      "title": "Stork.Ai：Demis 的 Frontier AI 框架把安全工作拆成可执行步骤",
      "orig": "Stork.Ai commentary on Demis Hassabis's frontier AI safety framework",
      "source": "X / Stork.Ai",
      "url": "https://x.com/usestork/status/2079050635396227366",
      "date": "2026-07-20",
      "heat": "medium",
      "tags": [
        "X",
        "AGI",
        "安全框架"
      ],
      "summary": "Stork.Ai 对 Demis Hassabis 的四步 Frontier AI 安全框架做了近期二次解读，强调标准、测试、责任与部署协作的连续关系。",
      "detail": "这条内容不是 Demis 的原始主张，而是一个近期 X 上的二次解释，因此证据等级低于原始长文，但它能反映讨论如何被产品和创业团队重新包装。其有价值的地方在于把宏观治理框架翻译成执行问题：测试什么能力、谁来定义失败、部署时怎样限制权限、出了问题由谁负责。对工作台设计来说，这类二次讨论可以帮助发现行业共识正在形成的词汇，但不能代替一手来源；最终摘要必须同时保留原始长文和二次解读的链接，明确哪些是作者原话、哪些是本条作者的推演。",
      "why": "展示 AGI 安全框架如何在 X 上被转译成产品执行语言，同时保留二手证据边界。",
      "why_now": "X 页面显示该帖发布于 2026-07-20；本轮通过具体 status 页面核对作者、时间和可见正文。",
      "buzz": "X status；浏览器交互式核验。",
      "content_type": "x_status",
      "depth": "normal",
      "topic_cluster": "frontier-governance",
      "recency_role": "current",
      "x_src": [
        "https://x.com/usestork/status/2079050635396227366"
      ],
      "evidence": {
        "provider": "interactive_browser",
        "verified_url": "https://x.com/usestork/status/2079050635396227366",
        "verified_at": "2026-07-20",
        "published_at": "2026-07-20",
        "direct": true
      },
      "key_points": [
        "二次解读能反映讨论扩散方向",
        "必须区分原始主张和转述",
        "治理框架需要翻译成测试、权限和责任"
      ],
      "examples": [
        "在摘要中分别标记 Demis 原文、Stork 解读和工作台的产品推论。"
      ],
      "product_implications": [
        "给社媒条目增加 evidence_level 和 source_role",
        "热点聚合保留原始来源与二次传播链"
      ],
      "limitations": [
        "这是二手解读，不应单独支撑 Frontier AI 治理结论"
      ],
      "meta": {}
    },
    {
      "id": "kol-5",
      "dim": "kol",
      "title": "Ethan Mollick：AI 在学术中的混乱也可能打开新洞见的黄金时期",
      "orig": "Ethan Mollick on AI in academia and new insights",
      "source": "X / Ethan Mollick",
      "url": "https://x.com/emollick/status/2079070674073633017",
      "date": "2026-07-20",
      "heat": "medium",
      "tags": [
        "X",
        "组织变革",
        "科研 Agent"
      ],
      "summary": "Ethan Mollick 认为 AI 进入学术会制造混乱，但也可能带来新的洞见与研究方式。这个观点把组织适应成本和能力红利放在同一张图里。",
      "detail": "AI 进入组织最容易被忽略的不是工具功能，而是评价标准、协作方式和责任分配会一起改变。AI 进入学术会制造署名、原创性、质量判断和工作分工的混乱，同时也可能让更多人探索以前成本过高的问题。对企业和研究产品，这意味着不能只在流程末端加一个 AI 使用声明，而要重新设计哪些工作适合机器生成、哪些工作需要人的判断、如何记录贡献和证据，以及如何让复核者快速看到模型做过什么。组织变革的成功标准也不应只是使用率，而要看新流程是否提高了问题发现、知识组合和决策质量。AI 真正改变组织，往往不是替代一个岗位，而是重排任务、权力和验证环节。",
      "why": "把 AI 进入组织的问题从工具采用扩展到评价、分工和知识生产方式。",
      "why_now": "X 搜索结果显示该帖约于 2026-07-20 发布；本轮通过具体 status 页面核对作者和正文。",
      "buzz": "X status；浏览器交互式核验。",
      "content_type": "x_status",
      "depth": "normal",
      "topic_cluster": "organization-ai",
      "recency_role": "current",
      "x_src": [
        "https://x.com/emollick/status/2079070674073633017"
      ],
      "evidence": {
        "provider": "interactive_browser",
        "verified_url": "https://x.com/emollick/status/2079070674073633017",
        "verified_at": "2026-07-20",
        "published_at": "2026-07-20",
        "direct": true
      },
      "key_points": [
        "组织采用会伴随评价和责任混乱",
        "AI 可能同时扩大生产力与新洞见",
        "工作流要记录贡献、证据和复核责任"
      ],
      "examples": [
        "研究助手输出草稿时同时保存来源、修改记录和最终由谁确认。"
      ],
      "product_implications": [
        "把 AI 使用记录和人工复核嵌入组织流程",
        "用问题发现和决策质量衡量采用，而非只看调用量"
      ],
      "limitations": [
        "观点适用于组织变革讨论，不代表学术界已有统一共识"
      ],
      "meta": {}
    },
    {
      "id": "paper-1",
      "dim": "paper",
      "title": "AgentCompass：把 Agent 评测拆成 Benchmark、Harness 与 Environment",
      "orig": "AgentCompass: A Unified Evaluation Framework for Language Agents",
      "source": "arXiv",
      "url": "https://arxiv.org/abs/2607.13705",
      "date": "2026-07-17",
      "heat": "high",
      "tags": [
        "Agent",
        "评测",
        "Benchmark"
      ],
      "summary": "AgentCompass 将 Agent 评测组织为任务基准、执行 Harness 和环境三部分，并覆盖 20 多个基准与多个能力维度，强调跨任务、跨环境的统一比较。",
      "detail": "Agent 评测经常陷入两个极端：只看一个最终答案，或者把不同工具、不同提示和不同环境下的分数直接放在一起比较。AgentCompass 将评测对象拆成三个可替换但必须协同的部分：Benchmark 定义任务和成功标准，Harness 负责调度模型、工具、上下文和记录轨迹，Environment 提供真实或仿真的数据、权限和反馈。这样才有机会回答模型能力差异与环境或执行器差异分别贡献了多少。论文把能力维度扩展到规划、工具使用、记忆、协作和可靠性，说明 Agent 产品验收不应只有准确率。对工作台而言，每个候选条目的验证过程也可以视为一个小型 Harness：记录查询、来源、筛选理由、浏览器核验和最终入选；结果变差时，能定位是发现源、执行链还是质量门出了问题。这个拆分也给采集系统一个直接启发：候选发现、页面读取、事实抽取、去重和摘要生成不应该全部由一个不可见的 Agent 步骤完成。每一层都要有输入输出和失败状态，才能判断“没抓到重点”究竟是搜索词太窄、来源 provider 太弱、浏览器没有打开完整页面，还是过滤器把真正的新内容误删了。从产品落地看，今天这些材料都可以转换成同一张验收清单：来源是否能回到原文，日期是否在数据截止日之前，模型或 Agent 的输入和工具是否可复现，权限是否只覆盖当前任务，失败后是否能中止并恢复，最后的判断是否由明确责任人确认。对情报工作台，这张清单还要增加候选是否来自真实近期讨论、是否经过具体页面核验、是否与过去七期重复、是否有独立来源支撑热点。这样做的目的不是把每条新闻写成合规报告，而是让“值得关注”能够被解释、被复查，也能在下一次运行中根据失败记录调整搜索词和来源优先级。",
      "why": "为为什么最近抓不到重点提供工程化解释：发现、执行环境和质量门必须分开评估。",
      "why_now": "arXiv 页面显示该预印本于 2026-07-17 生成，属于本周新研究。",
      "buzz": "arXiv 预印本。",
      "content_type": "paper",
      "depth": "deep",
      "topic_cluster": "agent-reliability",
      "recency_role": "current",
      "key_points": [
        "评测由任务、Harness 和 Environment 共同决定",
        "不能把不同执行环境的分数直接比较",
        "Agent 评测需要规划、工具、记忆与可靠性维度"
      ],
      "examples": [
        "对每日情报工作台记录 Gate CLI 候选、浏览器核验、过滤原因和最终 digest 的完整链路。"
      ],
      "product_implications": [
        "为发现链、核验链和质量门分别设置指标",
        "保存可回放的运行轨迹和失败分类"
      ],
      "limitations": [
        "预印本框架仍需在具体业务数据和来源上验证",
        "统一评测不代表任何一个基准足以覆盖生产风险"
      ],
      "meta": {}
    },
    {
      "id": "paper-2",
      "dim": "paper",
      "title": "Agentic Coding Tools 的早期采用集中在少数仓库，真实扩散仍很有限",
      "orig": "Early Adoption of Agentic Coding Tools",
      "source": "arXiv",
      "url": "https://arxiv.org/abs/2607.14037",
      "date": "2026-07-15",
      "heat": "high",
      "tags": [
        "编码 Agent",
        "采用",
        "软件工程"
      ],
      "summary": "论文分析 25,264 个 Agentic Pull Requests 和 2,361 个仓库，指出 Agent 编码贡献的早期采用集中在少数项目，多数仓库仍只有很少的 Agent PR。",
      "detail": "大家都在使用编码 Agent 与 Agent 已经改变大多数软件组织是两件不同的事。研究用 Pull Request 作为可观测信号，描绘出早期采用的集中度：少数仓库贡献了较多 Agent 协助的变更，但更广泛的仓库中 Agent PR 仍然有限。这个结果对产品判断很重要，单个明星团队的高使用率不能直接外推到整个企业。组织引入 Agent 时，需要观察试点团队的任务类型、审查方式和失败模式，再评估能否迁移到遗留系统、受限仓库和高合规项目。PR 数量增加也不等于生产效率增加，冲突、返工、审查负担和维护成本都应一起测量。产品上应该提供小范围沙箱、任务分级、变更预览、自动测试和回滚，而不是默认 Agent 可以直接修改主干。对于组织工作台，采用度量至少应形成三条线：使用量看团队是否尝试，交付质量看变更是否通过测试和审查，组织影响看维护成本、知识沉淀和责任分配是否改善。只有三条线一起变好，才能把单点的 Agent 成功故事升级为可复制的流程。情报采集也应采用相同原则：不能只看抓到多少条，还要看重点命中率和用户是否愿意继续阅读。从产品落地看，今天这些材料都可以转换成同一张验收清单：来源是否能回到原文，日期是否在数据截止日之前，模型或 Agent 的输入和工具是否可复现，权限是否只覆盖当前任务，失败后是否能中止并恢复，最后的判断是否由明确责任人确认。对情报工作台，这张清单还要增加候选是否来自真实近期讨论、是否经过具体页面核验、是否与过去七期重复、是否有独立来源支撑热点。这样做的目的不是把每条新闻写成合规报告，而是让“值得关注”能够被解释、被复查，也能在下一次运行中根据失败记录调整搜索词和来源优先级。",
      "why": "为企业 AI 采用提供基准：早期成功案例不能替代跨团队扩散和质量验证。",
      "why_now": "arXiv 页面显示该预印本于 2026-07-15 生成，仍在当前一周窗口内。",
      "buzz": "arXiv 预印本。",
      "content_type": "paper",
      "depth": "deep",
      "topic_cluster": "organization-ai",
      "recency_role": "current",
      "key_points": [
        "Agent 编码采用集中在少数仓库",
        "PR 数量不等于效率提升",
        "迁移需要测量返工、冲突和审查负担"
      ],
      "examples": [
        "在试点中同时记录 Agent PR、人工修改、回滚、测试失败和合并周期。"
      ],
      "product_implications": [
        "按任务和仓库风险分级开放 Agent",
        "把审查与维护成本纳入采用看板"
      ],
      "limitations": [
        "GitHub PR 行为是采用代理指标，不能完整代表企业内部工作流"
      ],
      "meta": {}
    },
    {
      "id": "oss-1",
      "dim": "oss",
      "title": "Vibe-Trading：开源热度把交易研究 Agent 推到近期关注面",
      "orig": "HKUDS/Vibe-Trading",
      "source": "GitTrend + GitHub",
      "url": "https://github.com/HKUDS/Vibe-Trading",
      "date": "2026-07-18",
      "heat": "medium",
      "tags": [
        "金融/量化Agent",
        "开源",
        "交易研究"
      ],
      "summary": "GitTrend 的近期趋势页将 HKUDS/Vibe-Trading 列为新近升温的 AI 交易研究项目。这里的信号是讨论和工程兴趣正在集中，不是策略收益或实盘成熟度证明。",
      "detail": "Vibe-Trading 的价值首先在于发现：开源社区正在尝试把行情、研究、策略生成和交易工作流组合成更贴近自然语言的 Agent 体验。趋势页面只能告诉我们哪些项目正在被讨论，必须继续进入具体 GitHub 仓库核对代码结构、数据来源、回测方式、执行权限和维护状态。金融场景尤其要警惕把能生成交易想法包装成能稳定赚钱：如果没有冻结历史数据、避免前视偏差、模拟账户、限额、人工审批和可回滚机制，Agent 只是在把不确定性更快地传递到下一步。值得观察的方向是研究与执行分离：Agent 先生成带证据的研究草稿和可复现回测，只有人工确认、风险检查和模拟结果通过后，才进入更高风险的工具层。",
      "why": "补上近期 X/GitHub 讨论中 AI+金融开源项目的发现信号，同时明确热度与可用性边界。",
      "why_now": "GitTrend 趋势页于 2026-07-18 显示该项目近期升温；GitHub 仓库作为机制核验入口。",
      "buzz": "GitTrend 热度 + GitHub 仓库。",
      "content_type": "github_repo",
      "depth": "normal",
      "topic_cluster": "finance-agent",
      "recency_role": "current",
      "potential": "潜力新星",
      "key_points": [
        "开源热度可用于发现早期项目",
        "金融 Agent 必须把研究和执行分层",
        "热度不代表策略收益或实盘成熟度"
      ],
      "examples": [
        "先让项目生成带数据日期和回测参数的研究报告，再将订单能力保持在模拟环境。"
      ],
      "product_implications": [
        "把 GitHub Trending 作为发现源而非结论源",
        "金融 Agent 默认采用研究、模拟、审批、执行状态机"
      ],
      "limitations": [
        "GitTrend 是热度信号；项目安全、回测和维护质量仍需独立审查",
        "不能据此推断投资收益"
      ],
      "meta": {
        "discovery_url": "https://gittrend.io/trending/ai-agent"
      }
    },
    {
      "id": "fin-1",
      "dim": "fin",
      "title": "CFAgentBench：金融 Agent 的能力会在多步工具链和人工审批下显著分化",
      "orig": "CFAgentBench: A Comprehensive Benchmark for Financial Agents",
      "source": "arXiv",
      "url": "https://arxiv.org/abs/2606.22000",
      "date": "2026-06-20",
      "heat": "medium",
      "tags": [
        "AI × 金融",
        "评测",
        "工具调用",
        "人工审批"
      ],
      "summary": "CFAgentBench 用可执行金融环境、真实金融工具和人工审批护栏评估 Agent，关注从研究到执行的完整流程；它更适合作为当前组织 Agent 治理讨论的背景基线。",
      "detail": "金融 Agent 的难点不在于能否回答一个问题，而在于它是否能在数据、工具、权限和人工决策共同组成的环境中稳定完成多步任务。CFAgentBench 将金融数据源、分析工具和执行环境组合起来，并把人工审批作为高风险步骤的一部分。研究 Agent 可能要查询多个数据源，形成假设，调用计算工具，再生成订单或风险建议；任何一步的时点错误、权限越界、意图误解或证据缺失，都可能让最终结论失效。评测应区分单步正确率、长链任务完成率、工具选择、数据新鲜度、人工介入后的恢复能力和审计完整性。人工审批也不应只是点一下确认，而应看到订单参数、引用数据、风险限额、模型版本和可替代方案。论文较早，但能为本周的组织 Agent 治理和开源交易工具讨论提供验收基线。这条基线与本周的组织治理新证据结合后，形成了一个清晰的金融 Agent 评测顺序：先验证数据和工具是否可用，再验证分析过程能否解释，随后验证建议是否通过限额和人工审批，最后才在模拟环境观察稳定性。任何一步没有证据，都不应把下一步的自动化权限默认打开。从产品落地看，今天这些材料都可以转换成同一张验收清单：来源是否能回到原文，日期是否在数据截止日之前，模型或 Agent 的输入和工具是否可复现，权限是否只覆盖当前任务，失败后是否能中止并恢复，最后的判断是否由明确责任人确认。对情报工作台，这张清单还要增加候选是否来自真实近期讨论、是否经过具体页面核验、是否与过去七期重复、是否有独立来源支撑热点。这样做的目的不是把每条新闻写成合规报告，而是让“值得关注”能够被解释、被复查，也能在下一次运行中根据失败记录调整搜索词和来源优先级。",
      "why": "为近期金融 Agent 的权限、审批、工具链讨论提供可执行评测背景。",
      "why_now": "论文发布于 2026-06-20，超过近 7 天窗口，因此仅以 background 身份保留，并与本周金融 Agent 治理新证据绑定。",
      "buzz": "arXiv 预印本；背景基线。",
      "content_type": "paper",
      "depth": "deep",
      "topic_cluster": "finance-agent",
      "recency_role": "background",
      "key_points": [
        "金融 Agent 需要在真实工具环境中评测",
        "多步任务和人工审批会暴露能力差异",
        "审批界面必须展示数据、权限和模型上下文"
      ],
      "examples": [
        "审批前展示行情时间戳、订单参数、限额、引用证据和模型版本。"
      ],
      "product_implications": [
        "把工具调用、人工审批和异常恢复纳入验收",
        "用状态机区分研究、建议、模拟和执行"
      ],
      "limitations": [
        "预印本基准不能替代具体机构的合规和风险评估",
        "背景论文不应单独作为今日新闻"
      ],
      "meta": {}
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
      "handle": "@levie",
      "name": "Aaron Levie",
      "field": "企业 AI/组织工作流(Box)",
      "platform": "X",
      "status": "new"
    },
    {
      "handle": "@satyanadella",
      "name": "Satya Nadella",
      "field": "企业 AI/组织与平台(Microsoft)",
      "platform": "X",
      "status": "new"
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
    "把情报链拆成发现、核验、入选和推送四个状态；Gate CLI 只能提供候选，不能直接变成观点。",
    "为每条 X 内容保存具体 status/article、作者、发布时间、浏览器核验时间和证据 provider；profile 与搜索页只能做导航。",
    "把 AI 进入组织加入固定雷达：权限窗口、工具范围、责任链、审计回放、人工接管和模型准入必须每天观察。",
    "本次运行只更新本地工作台，不调用 Lark 推送。"
  ]
};
