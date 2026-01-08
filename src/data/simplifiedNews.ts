/**
 * Simplified News Articles
 * Real-world news topics simplified for HSK 5-6 learners
 * Part of the Intermediate Plateau bridge content
 */

export interface NewsArticle {
    id: string;
    title: string;
    titleEn: string;
    category: 'tech' | 'culture' | 'society' | 'economy' | 'environment' | 'health';
    level: 5 | 6;
    date: string;
    wordCount: number;
    summary: string;
    content: string[];
    vocabulary: NewsVocab[];
    discussionQuestions: string[];
}

export interface NewsVocab {
    word: string;
    pinyin: string;
    meaning: string;
    context: string;
}

export const SIMPLIFIED_NEWS: NewsArticle[] = [
    {
        id: 'ev-china',
        title: '中国电动汽车走向世界',
        titleEn: 'Chinese EVs Go Global',
        category: 'tech',
        level: 5,
        date: '2025-12',
        wordCount: 320,
        summary: '中国电动汽车在海外市场越来越受欢迎，本文分析其成功原因。',
        content: [
            '近年来，中国电动汽车品牌在国际市场上取得了令人瞩目的成绩。比亚迪、蔚来等公司的产品已经出口到欧洲、东南亚和拉丁美洲等地区。',
            '分析人士认为，中国电动车成功的主要原因有三点：首先，价格具有竞争力，同等配置的车型比欧美品牌便宜20%到40%；其次，电池技术领先，续航里程和充电速度都有明显优势；第三，智能化程度高，车载系统功能丰富。',
            '然而，中国品牌也面临一些挑战。部分国家对中国产品存在偏见，消费者对新品牌的信任需要时间建立。此外，一些地区正在考虑提高关税，这可能影响价格优势。',
            '业内专家预测，未来五年内，中国品牌有望占据全球电动车市场30%以上的份额。这不仅是商业上的成功，也代表着中国制造业向高端转型的重要一步。'
        ],
        vocabulary: [
            { word: '令人瞩目', pinyin: 'lìngrén zhǔmù', meaning: 'remarkable', context: '取得了令人瞩目的成绩' },
            { word: '竞争力', pinyin: 'jìngzhēnglì', meaning: 'competitiveness', context: '价格具有竞争力' },
            { word: '续航里程', pinyin: 'xùháng lǐchéng', meaning: 'driving range', context: '续航里程和充电速度' },
            { word: '智能化', pinyin: 'zhìnénghuà', meaning: 'intelligent/smart', context: '智能化程度高' },
            { word: '偏见', pinyin: 'piānjiàn', meaning: 'bias/prejudice', context: '对中国产品存在偏见' },
            { word: '关税', pinyin: 'guānshuì', meaning: 'tariff', context: '提高关税' },
            { word: '份额', pinyin: 'fèn\'é', meaning: 'market share', context: '市场30%以上的份额' },
            { word: '转型', pinyin: 'zhuǎnxíng', meaning: 'transformation', context: '向高端转型' }
        ],
        discussionQuestions: [
            '你认为电动汽车会完全取代燃油车吗？为什么？',
            '在你的国家，人们对中国品牌的电动车有什么看法？',
            '除了价格，消费者购买汽车时还会考虑哪些因素？'
        ]
    },
    {
        id: 'aging-society',
        title: '老龄化社会的新机遇',
        titleEn: 'New Opportunities in an Aging Society',
        category: 'society',
        level: 5,
        date: '2025-11',
        wordCount: 350,
        summary: '面对人口老龄化的挑战，社会各界正在探索新的解决方案和商业机会。',
        content: [
            '根据最新统计数据，中国60岁以上人口已超过2.8亿，占总人口的近20%。人口老龄化给社会带来了养老、医疗等方面的压力，但同时也创造了新的经济机遇。',
            '在养老服务领域，"智慧养老"正在成为新趋势。各种智能设备可以监测老人的健康状况，遇到紧急情况自动报警。一些社区还建立了日间照料中心，让老人白天有人陪伴，晚上可以回家与家人团聚。',
            '老年教育市场也在快速发展。许多老年大学开设了智能手机使用、短视频制作、书法绘画等课程，帮助老人与时代接轨。一些年轻创业者还专门开发了适合老人使用的简化版应用程序。',
            '专家指出，积极应对老龄化不仅需要政府的政策支持，也需要全社会的参与。子女应该多关心父母的精神需求，社区应该为老人创造更多社交机会。让老人"老有所养、老有所乐"是全社会共同的责任。'
        ],
        vocabulary: [
            { word: '老龄化', pinyin: 'lǎolínghuà', meaning: 'aging (of population)', context: '人口老龄化' },
            { word: '统计数据', pinyin: 'tǒngjì shùjù', meaning: 'statistics', context: '最新统计数据' },
            { word: '智慧养老', pinyin: 'zhìhuì yǎnglǎo', meaning: 'smart elderly care', context: '智慧养老正在成为新趋势' },
            { word: '监测', pinyin: 'jiāncè', meaning: 'to monitor', context: '监测老人的健康状况' },
            { word: '日间照料', pinyin: 'rìjiān zhàoliào', meaning: 'day care', context: '日间照料中心' },
            { word: '与时代接轨', pinyin: 'yǔ shídài jiēguǐ', meaning: 'keep up with the times', context: '帮助老人与时代接轨' },
            { word: '创业者', pinyin: 'chuàngyèzhě', meaning: 'entrepreneur', context: '年轻创业者' },
            { word: '精神需求', pinyin: 'jīngshén xūqiú', meaning: 'emotional needs', context: '精神需求' }
        ],
        discussionQuestions: [
            '你的国家也面临人口老龄化的问题吗？情况如何？',
            '你认为智能科技能够完全解决养老问题吗？',
            '年轻人应该如何更好地照顾年迈的父母？'
        ]
    },
    {
        id: 'ai-jobs',
        title: '人工智能时代的就业变革',
        titleEn: 'Employment Changes in the AI Era',
        category: 'economy',
        level: 6,
        date: '2025-12',
        wordCount: 400,
        summary: '人工智能正在重塑就业市场，哪些职业将消失，哪些新机会正在出现？',
        content: [
            '人工智能技术的飞速发展正在深刻改变全球就业格局。世界经济论坛发布的报告预测，到2030年，AI将取代约8500万个工作岗位，但同时也将创造9700万个新岗位。这意味着就业市场将经历一次大规模的结构性调整。',
            '从受影响最大的行业来看，制造业的流水线工人、银行的柜台职员、以及从事重复性数据录入工作的员工面临较高的被替代风险。然而，需要创造力、情感交流和复杂决策的职业，如心理咨询师、艺术创作者、高级管理人员等，在可预见的未来仍难以被AI完全取代。',
            '与此同时，许多全新的职业正在涌现。AI训练师、数据标注员、提示词工程师等岗位需求急剧增加。此外，能够将AI技术与传统行业相结合的复合型人才极为抢手。',
            '面对这一趋势，专家建议劳动者主动拥抱变化，通过终身学习不断更新技能。政府和企业也应该承担起责任，为转型期的员工提供培训和过渡支持。历史经验表明，每一次技术革命最终都创造了比消失更多的就业机会，关键在于如何平稳度过调整期。'
        ],
        vocabulary: [
            { word: '重塑', pinyin: 'chóngsù', meaning: 'to reshape', context: '正在重塑就业市场' },
            { word: '就业格局', pinyin: 'jiùyè géjú', meaning: 'employment landscape', context: '改变全球就业格局' },
            { word: '结构性调整', pinyin: 'jiégòuxìng tiáozhěng', meaning: 'structural adjustment', context: '结构性调整' },
            { word: '替代风险', pinyin: 'tìdài fēngxiǎn', meaning: 'replacement risk', context: '被替代风险' },
            { word: '复合型人才', pinyin: 'fùhéxíng réncái', meaning: 'interdisciplinary talents', context: '复合型人才极为抢手' },
            { word: '终身学习', pinyin: 'zhōngshēn xuéxí', meaning: 'lifelong learning', context: '终身学习不断更新技能' },
            { word: '过渡支持', pinyin: 'guòdù zhīchí', meaning: 'transition support', context: '培训和过渡支持' },
            { word: '平稳度过', pinyin: 'píngwěn dùguò', meaning: 'smoothly get through', context: '平稳度过调整期' }
        ],
        discussionQuestions: [
            '你认为你的职业会被AI取代吗？为什么？',
            '政府应该如何帮助因技术变革而失业的人？',
            '终身学习对现代人来说有多重要？你是怎么做的？'
        ]
    },
    {
        id: 'carbon-neutral',
        title: '碳中和目标下的生活改变',
        titleEn: 'Lifestyle Changes Under Carbon Neutrality Goals',
        category: 'environment',
        level: 6,
        date: '2025-10',
        wordCount: 380,
        summary: '为实现碳中和目标，从政府到个人都在做出改变，这将如何影响我们的日常生活？',
        content: [
            '中国承诺2060年前实现碳中和，这一宏伟目标正在从政策层面渗透到普通人的日常生活中。从能源结构到消费观念，一场静悄悄的革命正在发生。',
            '在能源领域，可再生能源的比重持续上升。风能、太阳能发电成本大幅下降，越来越多的家庭开始安装屋顶光伏板。新能源汽车保有量已突破2000万辆，配套的充电设施也在快速普及。',
            '消费观念的转变同样显著。"低碳生活"从一个口号变成了许多人的实际选择。自带购物袋、减少一次性用品、选择公共交通或骑行出行，这些环保行为正在成为新的社会风尚。一些城市还推出了"碳积分"制度，市民可以通过绿色出行等行为累积积分，兑换各种奖励。',
            '当然，转型过程中也存在挑战。高能耗产业的工人面临就业压力，部分传统产品价格上涨增加了生活成本。如何在发展与减排之间找到平衡，是政策制定者需要持续思考的问题。但多数专家认为，低碳转型从长远来看将带来更清洁的环境和更可持续的经济发展模式。'
        ],
        vocabulary: [
            { word: '碳中和', pinyin: 'tàn zhōnghé', meaning: 'carbon neutrality', context: '碳中和目标' },
            { word: '宏伟', pinyin: 'hóngwěi', meaning: 'grand/ambitious', context: '宏伟目标' },
            { word: '渗透', pinyin: 'shèntòu', meaning: 'to permeate', context: '渗透到日常生活中' },
            { word: '可再生能源', pinyin: 'kě zàishēng néngyuán', meaning: 'renewable energy', context: '可再生能源的比重' },
            { word: '光伏板', pinyin: 'guāngfú bǎn', meaning: 'solar panel', context: '屋顶光伏板' },
            { word: '普及', pinyin: 'pǔjí', meaning: 'to popularize', context: '快速普及' },
            { word: '社会风尚', pinyin: 'shèhuì fēngshàng', meaning: 'social trend', context: '新的社会风尚' },
            { word: '可持续', pinyin: 'kě chíxù', meaning: 'sustainable', context: '可持续的经济发展' }
        ],
        discussionQuestions: [
            '你在日常生活中采取了哪些环保行动？',
            '你认为个人的环保行为对环境保护有多大作用？',
            '发展中国家应该如何平衡经济发展和环境保护？'
        ]
    }
];

export default SIMPLIFIED_NEWS;
