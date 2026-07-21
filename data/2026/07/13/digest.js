// 当日聚合数据（由 Daily Intelligence Workbench 生成）。
window.__DAILY__ = window.__DAILY__ || {};
window.__DAILY__["2026/07/13"] = {
  "date": "2026-07-13",
  "date_cn": "2026年7月13日 · 周一",
  "generated_at": "2026-07-13",
  "language": "zh",
  "refresh_note": "按 Asia/Taipei 日期生成；已先执行研究雷达与 KOL X-first 检索，优先官方、arXiv、Hugging Face、GitHub 和公开 X status。",
  "market_mood": "今天的主线是 agent 从模型演示走向可审计的工作系统：大厂开始把语音、编程和科研工作台整合为产品入口；金融方向则更值得关注评测、权限、回放和人工审批，而非收益叙事。",
  "dimensions": [
    {
      "key": "lab",
      "cn": "AI 大厂动态",
      "overview": "大厂消息集中在可交付 agent：OpenAI 同时更新 GPT-5.6 与 GPT-Live；Anthropic 继续公开 Claude Code 的形成过程，并把科研工作台、治理讨论放进产品线。",
      "notes": "优先 OpenAI、Anthropic 官方页面；发布日期在近两周，产品可用范围以各官方说明为准。"
    },
    {
      "key": "kol",
      "cn": "KOL 观点",
      "overview": "公开讨论仍围绕 agent 的命名、harness/loop 和从内部工具变成产品的路径。",
      "notes": "X-first 已执行：4/4 条目带公开 x.com status，比例 100%。本轮对当天可检索到的具体 status 覆盖有限，采用近 7 天已核验帖子，不用二手转载替代。"
    },
    {
      "key": "paper",
      "cn": "前沿论文",
      "overview": "研究雷达的共同结论是：金融 Agent 的关键瓶颈并非单次回答，而是复杂工作簿处理、上下文老化、可复跑与可审计轨迹。",
      "notes": "采用 Hugging Face Papers/arXiv 一手条目；论文结果是受控评测或作者报告，不能外推为真实交易效果。"
    },
    {
      "key": "oss",
      "cn": "热门开源项目",
      "overview": "开源金融 Agent 正在补齐状态持久化、检查点恢复、可审计交易前审批及跨资产工作台。",
      "notes": "优先 GitHub 官方仓库；所有涉及订单或收益的项目均为实验软件，不构成投资建议。"
    },
    {
      "key": "fin",
      "cn": "AI × 金融",
      "overview": "金融与加密的高价值信号是“受治理的自主性”：A2A 支付、交易 agent、合规回放和安全 guard 需要先定义权限、证据与人工确认。",
      "notes": "优先论文和开源项目的一手说明；市场表现、未来采用和盈利能力均未做推断。"
    }
  ],
  "hot_topics_today": [
    {
      "title": "Agent 产品竞争转向可交付工作流",
      "heat": "high",
      "dims": [
        "lab",
        "kol",
        "oss"
      ],
      "summary": "从 GPT-Live、Claude Code 的公开复盘到交易 agent 的检查点与审批，竞争重点正在从一次回答转为可见进度、状态恢复和可追溯交付。",
      "related": [
        "lab-1",
        "lab-3",
        "kol-2",
        "oss-1"
      ]
    },
    {
      "title": "金融 Agent 要先解决评测与审计",
      "heat": "high",
      "dims": [
        "paper",
        "oss",
        "fin"
      ],
      "summary": "BlueFin、InKH、DFAH 与 TradingAgents 都把真实任务、上下文失效、回放和显式风控放到模型能力之前。",
      "related": [
        "paper-1",
        "paper-2",
        "paper-3",
        "fin-2"
      ]
    },
    {
      "title": "Agent 权限边界成为产品默认项",
      "heat": "medium",
      "dims": [
        "lab",
        "oss",
        "fin"
      ],
      "summary": "跨应用、科研工具和交易执行都意味着外部副作用；需要让审批、白名单、限额、日志和停止能力成为默认 UI。",
      "related": [
        "lab-4",
        "oss-2",
        "fin-1"
      ]
    }
  ],
  "items": [
    {
      "id": "lab-1",
      "dim": "lab",
      "title": "OpenAI 发布 GPT-5.6 与 GPT-Live，分别瞄准高难工作和自然语音交互",
      "orig": "GPT-5.6 / Introducing GPT-Live",
      "source": "OpenAI",
      "url": "https://openai.com/news/research/",
      "date": "2026-07-09",
      "heat": "high",
      "tags": [
        "Agent",
        "推理",
        "语音"
      ],
      "summary": "OpenAI 官方研究/新闻索引显示，7 月 8 日发布 GPT-Live 和对应 system card，7 月 9 日发布 GPT-5.6；前者强调自然语音交互，后者面向更高强度的编程、科学与网络安全工作。",
      "detail": "两个更新可放在同一个产品趋势里看：一端是把人与模型的实时沟通做得更自然，另一端是提高复杂任务的单位 token 产出。对产品团队真正重要的不是型号名称，而是交互层和任务层要分开设计。语音更适合澄清、协作与过程确认；复杂模型更适合规划、代码、研究与交付物生成。若让它们直接触发文件写入、外部调用或金融动作，则仍需要权限、审计和人工批准。",
      "why": "说明大厂同时在补“交互入口”和“复杂执行”两层 agent 能力。",
      "buzz": "官方索引，一手来源。",
      "content_type": "news",
      "depth": "normal",
      "key_points": [
        "GPT-Live 配有 system card",
        "GPT-5.6 面向编程、科学和安全任务",
        "产品需把对话交互与副作用操作分层"
      ],
      "limitations": [
        "官方索引不足以说明不同套餐、地区或接口的可用性。"
      ]
    },
    {
      "id": "lab-2",
      "dim": "lab",
      "title": "OpenAI 把编码评测中的噪声问题单独公开，提醒不要只看单一榜单",
      "orig": "Separating signal from noise in coding evaluations",
      "source": "OpenAI Research",
      "url": "https://openai.com/news/research/",
      "date": "2026-07-08",
      "heat": "high",
      "tags": [
        "评测",
        "编码",
        "可靠性"
      ],
      "summary": "OpenAI 在研究索引中发布“Separating signal from noise in coding evaluations”，把编码评测的信号与噪声作为独立议题。",
      "detail": "这对 agent 产品的意义很直接：一次跑通的 demo、单一 benchmark 分数和真实交付质量不是同一件事。团队应记录任务类型、运行成本、失败模式、人工返工和可复跑率；模型更新后还要做回归比较。对于带工具的 agent，评测对象也不能只有最后答案，还应覆盖调用轨迹、权限使用和异常恢复。一个可用的评测集应保留真实任务的约束，例如仓库规模、既有测试、依赖版本、允许写入的目录和人工验收标准；否则模型可能只是在更干净的环境里表现变好。还应区分“模型不知道”和“系统没有给到足够上下文/工具”的失败，分别改模型、知识层或流程。对外展示能力时，用通过率区间、样本量、失败类型与复测结果替代一个孤立的最高分，能减少用户对自动化范围的误解。",
      "why": "评测方法决定产品是否会被“看似进步、实际不稳定”的指标误导。",
      "content_type": "official_research",
      "depth": "deep",
      "key_points": [
        "编码评测存在信号与噪声区分问题",
        "应比较任务级稳定性而非只看单次分数",
        "工具调用轨迹应进入评估"
      ],
      "examples": [
        "同一修复任务重复运行十次，同时记录测试通过率、改动范围和人工回滚率。"
      ],
      "product_implications": [
        "为长任务增加可回放 run log 与版本化基准集。"
      ],
      "limitations": [
        "仅从官方研究索引确认题目与日期，具体方法需以原文为准。"
      ]
    },
    {
      "id": "lab-3",
      "dim": "lab",
      "title": "Anthropic 公开 Claude Code 从内部 CLI 到编码 agent 的形成过程",
      "orig": "The Making of Claude Code",
      "source": "Anthropic Newsroom",
      "url": "https://www.anthropic.com/news",
      "date": "2026-07-06",
      "heat": "high",
      "tags": [
        "Claude Code",
        "Agent",
        "产品化"
      ],
      "summary": "Anthropic 官方新闻室发布 The Making of Claude Code，讲述该工具从内部 CLI 到面向开发者的编码 agent 的过程。",
      "detail": "这类“产品形成史”比一次功能发布更有参考价值：成熟 agent 往往不是一次性设计完成，而是在内部高频使用、研究与工程磨合中形成。对做业务 agent 的团队来说，先把目标任务做成可观测的内部工作流，再决定哪些步骤对外开放，通常比先做万能聊天入口可靠。尤其要保留中途暂停、修改任务、查看计划和复用产物的能力。",
      "why": "说明 agent 产品的护城河不只是模型，而是持续使用后沉淀的工作流和失败处理。",
      "content_type": "news",
      "depth": "normal",
      "key_points": [
        "Claude Code 起源于内部使用",
        "研究、工程与早期用户共同塑形",
        "可观测工作流是对外产品化前提"
      ],
      "limitations": [
        "官方故事不等于完整技术实现或所有用户场景。"
      ]
    },
    {
      "id": "lab-4",
      "dim": "lab",
      "title": "Anthropic 将 Claude Science 定位为可产出可审计 artifact 的科研工作台",
      "orig": "Claude Science",
      "source": "Anthropic Newsroom",
      "url": "https://www.anthropic.com/news",
      "date": "2026-06-30",
      "heat": "medium",
      "tags": [
        "科研",
        "Artifact",
        "审计"
      ],
      "summary": "Anthropic 官方说明 Claude Science 是可定制的科研工作台，整合常用工具和包，并强调产出可审计的 artifacts 与灵活计算资源。",
      "detail": "“可审计 artifact”是比“回答更聪明”更可落地的产品定义。科研、金融和企业场景都需要用户看到输入、工具、版本、计算过程和最后结论之间的关系。若系统不能说明数据从哪里来、用了哪些工具、何时被人修改，就难以进入高风险工作流。对产品经理而言，artifact 可以是报告、表格、代码、研究记录和结构化证据包，而不是一段聊天文字。",
      "why": "为高信任场景提供了 agent 交付物的产品范式。",
      "content_type": "news",
      "depth": "normal",
      "key_points": [
        "强调可审计产物",
        "整合科研工具与计算资源",
        "适用于高信任工作流的产品参考"
      ],
      "limitations": [
        "具体能力和可用地区以官方产品页面为准。"
      ]
    },
    {
      "id": "kol-1",
      "dim": "kol",
      "title": "Simon Willison：ChatGPT Work、Codex、Claude Code 等命名已让用户产生入口混乱",
      "source": "X / Simon Willison",
      "url": "https://x.com/simonw/status/2075348941215006888",
      "date": "2026-07-09",
      "heat": "high",
      "tags": [
        "产品命名",
        "用户心智",
        "Agent"
      ],
      "summary": "Simon Willison 在公开 X status 中表示，ChatGPT、ChatGPT Codex、ChatGPT Work、Claude、Claude Code、Claude Cowork 的命名关系令人困惑。",
      "detail": "这是一条典型的产品信号：当能力快速叠加时，用户首先遇到的是“我该从哪个入口开始”。业务平台若同时暴露助手、agent、skill、插件、工作流和自动化，需要用任务目标而非内部技术名组织入口，并在运行前讲清它会读取什么、输出什么、是否会执行动作。",
      "why": "命名和入口会直接影响 agent 能力的发现与信任。",
      "x_src": [
        "https://x.com/simonw/status/2075348941215006888"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "kol-2",
      "dim": "kol",
      "title": "Addy Osmani：agentic engineering 已从 prompt 转向 harness、loop 与 software factory",
      "source": "X / Addy Osmani",
      "url": "https://x.com/addyosmani/status/2074927530482835916",
      "date": "2026-07-09",
      "heat": "high",
      "tags": [
        "Harness",
        "Loop",
        "Agentic Engineering"
      ],
      "summary": "Addy Osmani 的公开 X status 指出，讨论已经从 prompt 转向 harnesses、loops、fleets 与 software factories。",
      "detail": "把这条翻成产品语言，就是不要把一次提示词当成产品能力。稳定交付依赖任务模板、外部工具、状态保存、日志、重试、审批和质量门槛。对金融或企业 agent，最好先定义“每次运行要留下哪些证据”和“出错时谁能停下它”，再讨论自动化程度。",
      "why": "反映 agent 从演示走向工程系统的主流共识。",
      "x_src": [
        "https://x.com/addyosmani/status/2074927530482835916"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "kol-3",
      "dim": "kol",
      "title": "Boris Cherny 回顾 Claude Code 从安全研究起源到开发者产品",
      "source": "X / Boris Cherny",
      "url": "https://x.com/bcherny/status/2074247226038063316",
      "date": "2026-07-07",
      "heat": "medium",
      "tags": [
        "Claude Code",
        "开发者工具",
        "安全"
      ],
      "summary": "Boris Cherny 在公开 X status 中引述 Claude Code 的形成故事：从 Anthropic 的安全研究起步，逐渐构建并发布为开发者产品。",
      "detail": "对业务团队的启发是，高风险能力常常先在内部受控环境中形成有效边界，再对外扩展。把 agent 先用于内部资料归纳、测试、报告草稿或模拟交易，而非直接接管生产动作，更容易积累真实失败案例和治理规则。",
      "why": "解释了受控试用如何成为 agent 产品化的一部分。",
      "x_src": [
        "https://x.com/bcherny/status/2074247226038063316"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "kol-4",
      "dim": "kol",
      "title": "OpenAI 官方 X 将 ChatGPT Work 定义为由 Codex 驱动的新工作方式",
      "source": "X / OpenAI",
      "url": "https://x.com/OpenAI/status/2075274271845404744",
      "date": "2026-07-09",
      "heat": "high",
      "tags": [
        "Work",
        "Codex",
        "Agent"
      ],
      "summary": "OpenAI 官方公开 X status 将 ChatGPT Work 描述为由 Codex 驱动的新 agent 与新的完成工作方式。",
      "detail": "即使不把营销措辞当作能力承诺，这仍体现了产品入口变化：模型被包装为能承接工作包的 agent。用户侧关键体验将是进度可见、范围可改、产物可验收和关键动作可批准，而不是只看到一段对话。",
      "why": "大厂正在把 agent 放在“完成工作”的心智下，而非单纯对话。",
      "x_src": [
        "https://x.com/OpenAI/status/2075274271845404744"
      ],
      "content_type": "x_status",
      "depth": "normal"
    },
    {
      "id": "paper-1",
      "dim": "paper",
      "title": "BlueFin：用真实金融工作簿任务评测 LLM Agent",
      "orig": "BlueFin: Benchmarking LLM Agents on Financial Spreadsheets",
      "source": "Hugging Face Papers / arXiv",
      "url": "https://huggingface.co/papers/2605.30907",
      "date": "2026-05-29",
      "heat": "high",
      "tags": [
        "金融",
        "评测",
        "Spreadsheet"
      ],
      "summary": "BlueFin 为专业金融工作簿中的综合、操作与理解任务建立评测，包含 131 个复杂任务和 3,225 条细粒度标准，并由专家验证评分。",
      "detail": "BlueFin 的价值在于把“会不会做金融表格”从一个模糊问题拆成可评测的职业任务。金融人士的工作不是只填一个数，而是跨文件检索、理解口径、修改公式、核对一致性、输出解释。论文提示当前模型即使在其他领域表现不错，在这种复杂工作流上仍会暴露短板。产品上应将 agent 定位为辅助分析与初稿工具，并在关键公式、数据口径、估值假设和最终输出处保留人工复核。",
      "why": "为 AI 投研/财务 agent 提供了比通用问答更贴近工作的评测标尺。",
      "content_type": "paper",
      "depth": "deep",
      "key_points": [
        "131 个专业金融工作簿任务",
        "3,225 条细粒度评分标准",
        "LM judge 经过专家人工验证"
      ],
      "examples": [
        "让 agent 对多个工作簿中的预测假设做一致性检查，再由分析师确认改动。"
      ],
      "product_implications": [
        "把公式引用、输入来源和人工复核状态做成报告中的可见字段。"
      ],
      "limitations": [
        "评测成绩不代表实际投资收益，也不能替代合规流程。"
      ]
    },
    {
      "id": "paper-2",
      "dim": "paper",
      "title": "InKH：金融 LLM Agent 的上下文应由系统吸收，而不是反复让用户补课",
      "orig": "Absorbing Complexity: An Interaction-Native Knowledge Harness for Financial LLM Agents",
      "source": "Hugging Face Papers / arXiv",
      "url": "https://huggingface.co/papers/2606.01886",
      "date": "2026-06-01",
      "heat": "high",
      "tags": [
        "金融 Agent",
        "记忆",
        "可追溯"
      ],
      "summary": "InKH 提出以结构化知识、时间图记忆、失效机制和可读审计面来管理用户、市场和工具事件，目标是减少陈旧上下文与重复澄清。",
      "detail": "这篇论文的产品直觉很清楚：金融 agent 如果每次都要求用户重说风险偏好、组合状态、历史判断和市场假设，就把系统复杂度转嫁给用户。作者提出把事件转成可管理的知识，并给知识设置成熟、衰减和写入时失效规则。即便报告的指标来自受控合成基准，这个架构原则仍值得借鉴：记忆要有来源、有效期、可见审计面和删除/纠错机制，不能只是无限堆积的聊天记录。",
      "why": "直接对应投研、交易准备和风控中的上下文老化问题。",
      "content_type": "paper",
      "depth": "deep",
      "key_points": [
        "事件流转为结构化知识",
        "时间图记忆配合失效机制",
        "保留人类可读的审计表面"
      ],
      "examples": [
        "当用户修改风险上限时，旧仓位建议及其推导依据应标记为待重新验证。"
      ],
      "product_implications": [
        "记忆条目应显示来源、写入时间、有效期与撤销入口。"
      ],
      "limitations": [
        "作者的性能数字来自受控基准，不构成现实交易或生产 SLA。"
      ]
    },
    {
      "id": "paper-3",
      "dim": "paper",
      "title": "DFAH：金融 Agent 的可重复决策与正确性需要分开评估",
      "orig": "Replayable Financial Agents: A Determinism-Faithfulness Assurance Harness",
      "source": "Hugging Face Papers / GitHub",
      "url": "https://huggingface.co/papers/2601.15322",
      "date": "2026-03-07",
      "heat": "medium",
      "tags": [
        "可回放",
        "合规",
        "评测"
      ],
      "summary": "DFAH 提出同时测量工具调用轨迹、决策一致性和证据忠实度；论文报告同一输入下的确定性与正确性并不必然相关。",
      "detail": "许多团队会把“每次给出同样答案”误解为可靠，也会把“某次答对”误解为可审计。DFAH 的思路是把二者拆开：先看 agent 是否调用同样工具、参数是否一致、结论是否一致，再看结论是否被证据支持且符合事实。这对于金融、合规、风控等场景很实用，因为审计通常需要复现当时为何做出某个判断。产品实现上至少要留存输入快照、数据版本、工具调用、输出和审核结果。",
      "why": "为高风险 agent 的质量指标提供了可执行的拆分方法。",
      "content_type": "paper",
      "depth": "deep",
      "key_points": [
        "轨迹确定性、决策确定性和准确性分开测量",
        "可回放依赖输入、工具和数据版本",
        "稳定并不等于正确"
      ],
      "examples": [
        "对同一异常交易案例重复运行，比较取数工具、参数、证据和最终分流结论。"
      ],
      "product_implications": [
        "为高风险任务保存不可变 run snapshot，并在界面显示数据版本。"
      ],
      "limitations": [
        "论文是评测框架，不是对任何商用金融 agent 的认证。"
      ]
    },
    {
      "id": "oss-1",
      "dim": "oss",
      "title": "TradingAgents 继续把多 Agent 投研框架补向结构化输出、检查点与决策日志",
      "source": "GitHub / TauricResearch",
      "url": "https://github.com/TauricResearch/TradingAgents",
      "date": "2026-05-01",
      "heat": "high",
      "tags": [
        "交易 Agent",
        "LangGraph",
        "检查点"
      ],
      "summary": "TradingAgents 的官方仓库说明近期版本增加结构化决策 agent、LangGraph checkpoint resume、持久化决策日志、跨模型提供商和非美股 alpha 基准等能力。",
      "detail": "该项目值得关注的并非“让 AI 预测涨跌”，而是它把真实工作流中最容易缺失的工程能力公开化：中断后从节点恢复、记录历史决策、在后续同标的分析中回看结果、将最终决策归一到结构化格式。这些能力会让系统更容易复盘，但不能自动解决数据质量、前视偏差或模型幻觉。实际使用必须先选模拟/研究模式，并设置数据来源、交易权限和人工批准。",
      "why": "是金融 Agent 从角色扮演走向可恢复工作流的开源例子。",
      "content_type": "github_repo",
      "depth": "normal",
      "key_points": [
        "支持 checkpoint resume",
        "有持久化 decision log",
        "明确声明不构成投资建议"
      ],
      "limitations": [
        "仓库功能与回测不等于真实可交易 alpha。"
      ]
    },
    {
      "id": "oss-2",
      "dim": "oss",
      "title": "OpenAlice 用 Trading-as-Git 与 guard pipeline 把交易执行显式化",
      "source": "GitHub / TraderAlice",
      "url": "https://github.com/TraderAlice/OpenAlice",
      "date": "2026-06-01",
      "heat": "high",
      "tags": [
        "交易 Agent",
        "审批",
        "风控"
      ],
      "summary": "OpenAlice 是覆盖研究、建仓、管理与退出的 AI 交易 agent；仓库强调订单需经过版本历史、安全检查和用户明确批准。",
      "detail": "它的产品设计比“自动下单”更值得看：把订单先作为可审查变更，再进入执行；同时设置最大仓位、冷却期和标的白名单等 guard。这非常接近高风险 agent 应有的默认模式——先拟议、再校验、后批准，而不是由模型直接制造不可逆副作用。项目仍处于活跃开发并明确警示勿在不了解风险时实盘使用。",
      "why": "给 AI+金融产品提供了可视化审批和权限护栏的具体参考。",
      "content_type": "github_repo",
      "depth": "normal",
      "key_points": [
        "交易先进入版本化审查",
        "有最大仓位、冷却期和白名单 guard",
        "明确要求用户批准"
      ],
      "limitations": [
        "实验项目，不适合据此进行实盘或收益承诺。"
      ]
    },
    {
      "id": "oss-3",
      "dim": "oss",
      "title": "DFAH 开源工具把金融 Agent 的回放与证据忠实度落到测试项",
      "source": "GitHub / IBM Client Engineering",
      "url": "https://github.com/ibm-client-engineering/output-drift-financial-llms/blob/main/DFAH.md",
      "date": "2026-05-01",
      "heat": "medium",
      "tags": [
        "金融",
        "测试",
        "审计"
      ],
      "summary": "DFAH 的开源说明列出 action、signature、decision determinism 与 accuracy 等测试维度，帮助团队检查相同输入下的行为漂移。",
      "detail": "适合作为自建 agent 的验收清单：测试不应只问“答案看起来好吗”，还要问是否用了同一工具和参数、是否可给出相同决策、证据是否支持结论。将这些结果落到每次 run 的报表，才能在模型或提示词升级后识别质量回退。",
      "why": "将论文式指标转成可操作的工程检查点。",
      "content_type": "github_repo",
      "depth": "normal",
      "limitations": [
        "工具本身不能替代真实数据质量与人工合规审核。"
      ]
    },
    {
      "id": "oss-4",
      "dim": "oss",
      "title": "GitHub Agentic Workflows 将仓库数据分析与项目状态更新组织为持续 AI 工作流",
      "source": "GitHub",
      "url": "https://github.github.com/gh-aw/slides/20260224-github-agentic-workflows.pdf",
      "date": "2026-06-01",
      "heat": "medium",
      "tags": [
        "Workflow",
        "GitHub",
        "持续运行"
      ],
      "summary": "GitHub 的 Agentic Workflows 材料将 workflow 描述为 Continuous AI 的构建块，可分析仓库数据并自动更新项目状态。",
      "detail": "对信息工作台和产品研发来说，这类思路强调“持续运行”而非单次回答：定时输入、稳定输出、变更记录和异常提醒组成闭环。若工作流会写入项目状态，应加入最小权限、变更预览和回滚入口，尤其不能让模型在无确认时改动高影响配置。",
      "why": "与每日情报这种定时、可验证、可推送的任务形态高度相关。",
      "content_type": "analysis",
      "depth": "normal",
      "limitations": [
        "演示材料不代表所有 GitHub 功能的公开可用性。"
      ]
    },
    {
      "id": "fin-1",
      "dim": "fin",
      "title": "A2A Finance 讨论区块链支付与信任基础设施如何服务自主 Agent",
      "orig": "Agent-to-Agent Finance: Blockchain Payments and Trust Infrastructure for Autonomous AI Agents",
      "source": "arXiv",
      "url": "https://arxiv.org/abs/2607.00245",
      "date": "2026-06-30",
      "heat": "high",
      "tags": [
        "A2A",
        "区块链",
        "信任"
      ],
      "summary": "论文将区块链 A2A 支付、agent registry、可追溯钱包、确定性推理与 DeFi intent 等放在自主 agent 的金融基础设施框架下讨论。",
      "detail": "这类框架的实际价值取决于信任层是否完整：身份如何注册、谁为钱包动作负责、怎样设限额、怎样让第三方复核来源和意图。支付通道本身不会自动带来安全与合规；当 agent 能转账或代表用户谈判时，身份、授权、撤销、审计和争议处理要先于规模化。",
      "why": "是 AI+加密从“发 token”转向 agent 协作基础设施的研究信号。",
      "content_type": "paper",
      "depth": "deep",
      "key_points": [
        "讨论 A2A 支付与信任基础设施",
        "涉及 registry、钱包与 provenance",
        "强调市场基础设施而非单点模型"
      ],
      "examples": [
        "一个研究 agent 只能申请预算，真正签名转账需经过独立风控 agent 和用户审批。"
      ],
      "product_implications": [
        "将 agent 身份、权限额度、审计回执做成可读产品对象。"
      ],
      "limitations": [
        "为论文框架，尚不能证明真实市场基础设施已成熟。"
      ]
    },
    {
      "id": "fin-2",
      "dim": "fin",
      "title": "AI 金融市场架构研究强调：系统性影响取决于分布、耦合与治理",
      "orig": "AI Agents in Financial Markets: Architecture, Applications, and Systemic Implications",
      "source": "arXiv",
      "url": "https://arxiv.org/abs/2603.13942",
      "date": "2026-03-14",
      "heat": "medium",
      "tags": [
        "金融市场",
        "治理",
        "多 Agent"
      ],
      "summary": "该研究认为，金融 agent 的系统性影响不只取决于模型智能程度，更取决于各机构如何部署、耦合与治理这些 agent。",
      "detail": "这为产品范围划了边界：单个投研助手即使不直接下单，也可能通过同源数据、相似策略和自动化传播放大市场行为。开发者应避免把“更智能”直接等同于“更可自主”，而是按任务风险分级：信息整理可自动化，建议需解释，执行需限额和审批，跨账户/跨 agent 联动需额外治理。",
      "why": "帮助 AI+金融团队从系统层而非单 agent 层理解风险。",
      "content_type": "analysis",
      "depth": "normal",
      "limitations": [
        "理论框架不提供对具体市场事件的预测。"
      ]
    },
    {
      "id": "fin-3",
      "dim": "fin",
      "title": "OpenAI Economic Research Exchange 寻求用受治理的协作研究衡量 AI 对经济的真实影响",
      "source": "OpenAI",
      "url": "https://openai.com/index/economic-research-exchange/",
      "date": "2026-06-08",
      "heat": "medium",
      "tags": [
        "经济",
        "研究",
        "治理"
      ],
      "summary": "OpenAI 发起 Economic Research Exchange，支持外部研究者在结构化项目、隐私保护和明确里程碑下研究 AI 对工作、企业和机构的影响。",
      "detail": "它没有直接回答“AI 会怎样改变金融”，但给出一个较成熟的方法论：把影响判断从轶事和营销转向可复核的研究设计、数据治理和阶段性产出。对于企业内部做 AI ROI 或金融工作流试点，也应先定义生产率、错误率、风险事件和人机分工的测量口径。",
      "why": "强调 AI 经济影响需要证据与治理，而不是仅凭能力发布推断。",
      "content_type": "analysis",
      "depth": "normal",
      "limitations": [
        "项目是研究资助与协作计划，不代表已得出的经济结论。"
      ]
    },
    {
      "id": "fin-4",
      "dim": "fin",
      "title": "StockAgent 用模拟真实环境研究 LLM 多 Agent 的交易行为，并强调避免测试泄漏",
      "source": "Hugging Face Papers / arXiv",
      "url": "https://huggingface.co/papers/2407.18957",
      "date": "2024-07-15",
      "heat": "low",
      "tags": [
        "交易模拟",
        "多 Agent",
        "前视偏差"
      ],
      "summary": "StockAgent 构建 LLM 多 agent 模拟交易环境，尝试避免模型利用测试期已知信息，并研究宏观、政策、公司基本面和事件对交易行为的影响。",
      "detail": "虽然论文较早，但“防止测试泄漏”仍是 AI 交易产品的底线。任何展示回测表现的 agent 都应说明数据截止时间、新闻可用时间、复权和幸存者偏差处理方式。把项目定位为策略研究与教育模拟比定位为自动赚钱系统更可信。",
      "why": "为今天关于金融 agent 评测与可回放的讨论补充了长期基础。",
      "content_type": "analysis",
      "depth": "normal",
      "limitations": [
        "论文较早且为模拟研究，不能视为当前交易策略推荐。"
      ]
    }
  ],
  "practice_list": [
    {
      "title": "本周可执行：给一个高风险 Agent 补 run snapshot",
      "summary": "记录输入、数据版本、工具调用、审批人与最终产物；同一案例重复运行并比较漂移。"
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
  ]
};
