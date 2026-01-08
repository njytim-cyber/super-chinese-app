/**
 * Bridge Content for Intermediate Learners
 * Simplified passages that bridge HSK 4-6 for the intermediate plateau
 */

export interface BridgePassage {
    id: string;
    title: string;
    titleEn: string;
    level: 4 | 5 | 6;
    content: string;
    vocabulary: string[];
    questions: {
        question: string;
        options: string[];
        correctIndex: number;
    }[];
}

export const BRIDGE_PASSAGES: BridgePassage[] = [
    {
        id: 'daily-routine',
        title: '我的一天',
        titleEn: 'My Day',
        level: 4,
        content: `我每天早上六点半起床。起床以后，我先洗脸刷牙，然后吃早饭。早饭以后，我骑自行车去上班。我的工作是在一家电脑公司当程序员。

中午的时候，我和同事一起去公司附近的餐厅吃午饭。下午我继续工作，晚上六点下班。

回家以后，我先休息一会儿，然后做晚饭。吃完晚饭，我会看一个小时的书或者看电视。十一点左右，我就准备睡觉了。

虽然每天的生活很有规律，但是我觉得很充实。周末的时候，我会和朋友一起出去玩，或者在家里学习中文。`,
        vocabulary: ['起床', '洗脸', '刷牙', '程序员', '同事', '规律', '充实'],
        questions: [
            {
                question: '作者每天几点起床？',
                options: ['六点', '六点半', '七点', '七点半'],
                correctIndex: 1
            },
            {
                question: '作者的工作是什么？',
                options: ['老师', '医生', '程序员', '厨师'],
                correctIndex: 2
            },
            {
                question: '作者周末喜欢做什么？',
                options: ['加班工作', '和朋友出去玩或学中文', '睡觉', '看电影'],
                correctIndex: 1
            }
        ]
    },
    {
        id: 'travel-memory',
        title: '难忘的旅行',
        titleEn: 'An Unforgettable Trip',
        level: 5,
        content: `去年夏天，我和家人一起去了云南旅行。这是我第一次去中国的西南部，那里的风景让我非常惊讶。

我们首先去了昆明，那是云南的省会。昆明被称为"春城"，因为那里一年四季气候都很温暖。我们参观了著名的石林，那些巨大的石头形状各异，非常壮观。

接下来，我们乘火车去了大理。大理古城保留了很多历史文化，我们在那里逛了很多特色小店，还品尝了当地的美食。洱海的日出特别美，我拍了很多照片。

这次旅行让我对中国的文化和自然有了更深的了解。我希望将来有机会再去其他地方看看。`,
        vocabulary: ['难忘', '风景', '惊讶', '省会', '春城', '壮观', '保留', '品尝'],
        questions: [
            {
                question: '作者去云南旅行是什么时候？',
                options: ['今年', '去年夏天', '去年冬天', '前年'],
                correctIndex: 1
            },
            {
                question: '昆明为什么被称为"春城"？',
                options: ['因为有很多花', '因为一年四季气候温暖', '因为在春天建成', '因为是首都'],
                correctIndex: 1
            },
            {
                question: '作者在大理做了什么？',
                options: ['只拍照', '逛小店和品尝美食', '爬山', '学习中文'],
                correctIndex: 1
            }
        ]
    },
    {
        id: 'technology-change',
        title: '科技改变生活',
        titleEn: 'Technology Changes Life',
        level: 6,
        content: `随着科技的快速发展，我们的日常生活发生了巨大的变化。二十年前，人们主要通过写信和打电话来联系。而现在，社交媒体和即时通讯软件让人与人之间的交流变得更加便捷。

在购物方面，电子商务的兴起改变了消费者的行为习惯。越来越多的人选择在网上购物，因为这样既节省时间又方便比较价格。移动支付的普及更是让人们出门不再需要携带现金。

人工智能的应用也在各个领域不断扩展。从智能语音助手到自动驾驶汽车，技术正在以前所未有的速度改变着我们的世界。

然而，我们也需要注意科技带来的一些问题，比如隐私保护和网络安全。如何在享受科技便利的同时保护个人信息，是每个人都需要思考的问题。`,
        vocabulary: ['科技', '发展', '社交媒体', '便捷', '电子商务', '消费者', '人工智能', '隐私'],
        questions: [
            {
                question: '文章主要讨论什么话题？',
                options: ['旅行经历', '科技对生活的影响', '学习方法', '健康问题'],
                correctIndex: 1
            },
            {
                question: '根据文章，移动支付的普及带来了什么变化？',
                options: ['人们更喜欢用信用卡', '人们出门不需要带现金', '商店变少了', '物价上涨'],
                correctIndex: 1
            },
            {
                question: '文章认为科技发展需要注意什么问题？',
                options: ['价格太贵', '隐私保护和网络安全', '学习太难', '没有工作'],
                correctIndex: 1
            }
        ]
    }
];

export default BRIDGE_PASSAGES;
