/**
 * Graded Reader Content
 * Stories with progressive difficulty from HSK 4 to HSK 6
 * Designed to bridge the Intermediate Plateau
 */

export interface GradedStory {
    id: string;
    title: string;
    titleEn: string;
    level: 4 | 5 | 6;
    category: 'daily_life' | 'travel' | 'culture' | 'tech' | 'history' | 'dialogue';
    wordCount: number;
    estimatedMinutes: number;
    content: StoryParagraph[];
    vocabulary: VocabItem[];
}

export interface StoryParagraph {
    text: string;
    translation?: string;
}

export interface VocabItem {
    word: string;
    pinyin: string;
    meaning: string;
    level: number;
}

export const GRADED_STORIES: GradedStory[] = [
    // HSK 4 - Daily Life
    {
        id: 'coffee-shop',
        title: '咖啡店的下午',
        titleEn: 'An Afternoon at the Coffee Shop',
        level: 4,
        category: 'daily_life',
        wordCount: 280,
        estimatedMinutes: 3,
        content: [
            {
                text: '周末的下午，我喜欢一个人去咖啡店坐坐。那里有舒服的沙发和轻轻的音乐，是一个放松的好地方。',
                translation: 'On weekend afternoons, I like to sit alone at the coffee shop. There are comfortable sofas and soft music—it\'s a great place to relax.'
            },
            {
                text: '我通常会点一杯拿铁咖啡，然后找一个靠窗的位置坐下。从窗户可以看到外面的街道，看着来来往往的人们，我觉得很有意思。',
                translation: 'I usually order a latte and find a seat by the window. I can see the street outside, watching people come and go—I find it very interesting.'
            },
            {
                text: '有时候我会带一本书，有时候只是发发呆，看看手机。服务员认识我了，每次看到我都会微笑着打招呼。',
                translation: 'Sometimes I bring a book, sometimes I just zone out or look at my phone. The servers recognize me now and greet me with a smile every time.'
            },
            {
                text: '这样的下午让我感到平静和满足。在忙碌的生活中，有这样一个放松的时间真的很重要。',
                translation: 'Afternoons like this make me feel calm and content. In a busy life, having time to relax like this is really important.'
            }
        ],
        vocabulary: [
            { word: '舒服', pinyin: 'shūfu', meaning: 'comfortable', level: 4 },
            { word: '放松', pinyin: 'fàngsōng', meaning: 'to relax', level: 4 },
            { word: '通常', pinyin: 'tōngcháng', meaning: 'usually', level: 4 },
            { word: '靠窗', pinyin: 'kào chuāng', meaning: 'by the window', level: 4 },
            { word: '来来往往', pinyin: 'láilái wǎngwǎng', meaning: 'coming and going', level: 5 },
            { word: '发呆', pinyin: 'fādāi', meaning: 'to zone out', level: 4 },
            { word: '微笑', pinyin: 'wēixiào', meaning: 'to smile', level: 4 },
            { word: '平静', pinyin: 'píngjìng', meaning: 'calm', level: 5 },
            { word: '满足', pinyin: 'mǎnzú', meaning: 'satisfied', level: 4 }
        ]
    },

    // HSK 4 - Dialogue
    {
        id: 'restaurant-order',
        title: '在餐厅点菜',
        titleEn: 'Ordering at a Restaurant',
        level: 4,
        category: 'dialogue',
        wordCount: 200,
        estimatedMinutes: 2,
        content: [
            {
                text: '服务员：欢迎光临！请问几位？\n客人：两位，请给我们一个靠窗的位置。',
                translation: 'Server: Welcome! How many people?\nCustomer: Two, please give us a window seat.'
            },
            {
                text: '服务员：好的，请跟我来。这是菜单，需要点什么？\n客人：我们先看看。请问你们的招牌菜是什么？',
                translation: 'Server: Okay, please follow me. Here\'s the menu, what would you like?\nCustomer: Let us look first. What\'s your signature dish?'
            },
            {
                text: '服务员：我们的糖醋排骨很受欢迎，红烧肉也不错。\n客人：那来一份糖醋排骨，一份清炒时蔬，再要两碗米饭。',
                translation: 'Server: Our sweet and sour ribs are popular, and the braised pork is good too.\nCustomer: Then we\'ll have sweet and sour ribs, stir-fried vegetables, and two bowls of rice.'
            },
            {
                text: '服务员：好的，请稍等。需要喝点什么吗？\n客人：来两杯柠檬水吧，谢谢。',
                translation: 'Server: Okay, please wait. Would you like something to drink?\nCustomer: Two glasses of lemon water, thanks.'
            }
        ],
        vocabulary: [
            { word: '欢迎光临', pinyin: 'huānyíng guānglín', meaning: 'welcome', level: 4 },
            { word: '菜单', pinyin: 'càidān', meaning: 'menu', level: 4 },
            { word: '招牌菜', pinyin: 'zhāopái cài', meaning: 'signature dish', level: 5 },
            { word: '糖醋', pinyin: 'tángcù', meaning: 'sweet and sour', level: 4 },
            { word: '排骨', pinyin: 'páigǔ', meaning: 'ribs', level: 4 },
            { word: '红烧肉', pinyin: 'hóngshāo ròu', meaning: 'braised pork', level: 5 },
            { word: '清炒', pinyin: 'qīngchǎo', meaning: 'stir-fried', level: 5 },
            { word: '时蔬', pinyin: 'shíshū', meaning: 'seasonal vegetables', level: 5 }
        ]
    },

    // HSK 5 - Culture
    {
        id: 'tea-culture',
        title: '中国茶文化',
        titleEn: 'Chinese Tea Culture',
        level: 5,
        category: 'culture',
        wordCount: 380,
        estimatedMinutes: 4,
        content: [
            {
                text: '中国是茶的故乡，茶文化已经有几千年的历史。从古代开始，喝茶就不仅仅是为了解渴，更是一种生活方式和文化传统。',
                translation: 'China is the homeland of tea, and tea culture has a history of thousands of years. Since ancient times, drinking tea hasn\'t been just about quenching thirst—it\'s a way of life and cultural tradition.'
            },
            {
                text: '中国茶主要分为六大类：绿茶、红茶、乌龙茶、白茶、黄茶和黑茶。每种茶都有独特的香味和口感。比如，绿茶清淡爽口，红茶醇厚温暖，乌龙茶香气复杂迷人。',
                translation: 'Chinese tea is mainly divided into six categories: green, black, oolong, white, yellow, and dark tea. Each has its unique aroma and taste. For example, green tea is light and refreshing, black tea is mellow and warm, and oolong tea has a complex, charming aroma.'
            },
            {
                text: '茶道是中国传统文化的重要组成部分。泡茶的过程讲究水温、茶量、时间的把握。好的茶艺师能够通过这些细节展现茶的最佳风味。',
                translation: 'The tea ceremony is an important part of Chinese traditional culture. Brewing tea requires attention to water temperature, tea amount, and timing. Skilled tea masters can bring out the best flavor through these details.'
            },
            {
                text: '在日常生活中，茶也是人际交往的重要媒介。朋友相聚、商务洽谈，甚至解决矛盾，都可以在一杯茶中进行。"以茶会友"这句话很好地说明了茶在社会生活中的作用。',
                translation: 'In daily life, tea is also an important medium for social interaction. Friends gathering, business negotiations, even resolving conflicts—all can happen over tea. "Meeting friends through tea" perfectly describes tea\'s role in social life.'
            }
        ],
        vocabulary: [
            { word: '故乡', pinyin: 'gùxiāng', meaning: 'homeland', level: 5 },
            { word: '解渴', pinyin: 'jiěkě', meaning: 'to quench thirst', level: 5 },
            { word: '传统', pinyin: 'chuántǒng', meaning: 'tradition', level: 5 },
            { word: '独特', pinyin: 'dútè', meaning: 'unique', level: 5 },
            { word: '醇厚', pinyin: 'chúnhòu', meaning: 'mellow', level: 6 },
            { word: '茶道', pinyin: 'chádào', meaning: 'tea ceremony', level: 5 },
            { word: '讲究', pinyin: 'jiǎngjiu', meaning: 'to be particular about', level: 5 },
            { word: '人际交往', pinyin: 'rénjì jiāowǎng', meaning: 'interpersonal relations', level: 6 },
            { word: '媒介', pinyin: 'méijiè', meaning: 'medium', level: 6 },
            { word: '洽谈', pinyin: 'qiàtán', meaning: 'to negotiate', level: 6 }
        ]
    },

    // HSK 5 - Travel
    {
        id: 'guilin-trip',
        title: '桂林山水甲天下',
        titleEn: 'Guilin\'s Scenery is the Best Under Heaven',
        level: 5,
        category: 'travel',
        wordCount: 420,
        estimatedMinutes: 5,
        content: [
            {
                text: '"桂林山水甲天下"这句话在中国家喻户晓。去年夏天，我终于有机会亲眼见证这里的美景。',
                translation: '"Guilin\'s scenery is the best under heaven" is a saying known to every household in China. Last summer, I finally had the chance to witness the beauty here with my own eyes.'
            },
            {
                text: '漓江是桂林最著名的景点之一。我坐船沿着漓江顺流而下，两岸是连绵起伏的喀斯特山峰。这些山峰形态各异，有的像骆驼，有的像大象，让人惊叹大自然的鬼斧神工。',
                translation: 'The Li River is one of Guilin\'s most famous attractions. I took a boat down the river, with continuous karst peaks on both sides. These peaks come in various shapes—some like camels, some like elephants—making you marvel at nature\'s masterwork.'
            },
            {
                text: '清晨的漓江尤其美丽。薄雾笼罩着山水，渔民划着竹筏在江上捕鱼。那画面如诗如画，仿佛置身于中国传统水墨画之中。',
                translation: 'The Li River is especially beautiful at dawn. Thin mist covers the mountains and water, fishermen paddle bamboo rafts on the river. The scene is like poetry and painting, as if you\'re inside a traditional Chinese ink painting.'
            },
            {
                text: '除了漓江，阳朔也是必去之地。西街充满了各种特色小店和餐厅，游客可以品尝当地美食，购买手工艺品。晚上在江边骑自行车，凉风习习，让人心旷神怡。',
                translation: 'Besides the Li River, Yangshuo is also a must-visit. West Street is full of unique shops and restaurants where tourists can taste local food and buy handicrafts. Riding a bicycle by the river at night with a gentle breeze is refreshing and uplifting.'
            },
            {
                text: '这次旅行让我深刻体会到中国自然风光的壮丽。如果你有机会，一定要亲自去桂林看看。',
                translation: 'This trip gave me a deep appreciation of China\'s magnificent natural scenery. If you have the chance, you must go see Guilin for yourself.'
            }
        ],
        vocabulary: [
            { word: '家喻户晓', pinyin: 'jiāyù hùxiǎo', meaning: 'known to every household', level: 5 },
            { word: '亲眼', pinyin: 'qīnyǎn', meaning: 'with one\'s own eyes', level: 5 },
            { word: '见证', pinyin: 'jiànzhèng', meaning: 'to witness', level: 5 },
            { word: '顺流而下', pinyin: 'shùnliú ér xià', meaning: 'to go downstream', level: 6 },
            { word: '连绵起伏', pinyin: 'liánmián qǐfú', meaning: 'rolling, continuous', level: 6 },
            { word: '喀斯特', pinyin: 'kāsītè', meaning: 'karst', level: 6 },
            { word: '形态各异', pinyin: 'xíngtài gèyì', meaning: 'different shapes', level: 6 },
            { word: '鬼斧神工', pinyin: 'guǐfǔ shéngōng', meaning: 'nature\'s masterwork', level: 6 },
            { word: '薄雾', pinyin: 'bówù', meaning: 'thin mist', level: 5 },
            { word: '心旷神怡', pinyin: 'xīnkuàng shényí', meaning: 'refreshed and happy', level: 6 }
        ]
    },

    // HSK 6 - Technology
    {
        id: 'ai-life',
        title: '人工智能如何改变我们的生活',
        titleEn: 'How AI is Changing Our Lives',
        level: 6,
        category: 'tech',
        wordCount: 520,
        estimatedMinutes: 6,
        content: [
            {
                text: '人工智能（AI）正在以前所未有的速度改变着我们的生活方式。从智能手机上的语音助手到自动驾驶汽车，AI技术已经渗透到日常生活的方方面面。',
                translation: 'Artificial Intelligence (AI) is changing our way of life at an unprecedented pace. From voice assistants on smartphones to self-driving cars, AI technology has permeated every aspect of daily life.'
            },
            {
                text: '在医疗领域，AI正在协助医生进行疾病诊断。通过分析大量的医学影像和病历数据，AI系统能够发现人眼可能忽略的微小病变，从而提高诊断的准确性和效率。',
                translation: 'In healthcare, AI is assisting doctors with disease diagnosis. By analyzing large amounts of medical images and patient records, AI systems can detect tiny lesions that human eyes might miss, improving diagnostic accuracy and efficiency.'
            },
            {
                text: '教育行业也因AI而发生了深刻变革。个性化学习平台能够根据学生的学习进度和弱点，量身定制学习方案。这种因材施教的方式使得教育更加高效和公平。',
                translation: 'The education industry has also undergone profound changes due to AI. Personalized learning platforms can tailor study plans based on students\' progress and weaknesses. This individualized approach makes education more efficient and equitable.'
            },
            {
                text: '当然，AI的发展也带来了一些值得思考的问题。隐私保护、就业冲击、算法偏见等议题日益引起公众的关注。如何在享受AI便利的同时规避其潜在风险，是我们必须面对的挑战。',
                translation: 'Of course, AI development also raises some thought-provoking issues. Privacy protection, employment impact, and algorithmic bias are increasingly drawing public attention. How to enjoy AI\'s convenience while avoiding its potential risks is a challenge we must face.'
            },
            {
                text: '展望未来，AI将继续深入影响社会的各个层面。与其担忧被技术取代，不如积极学习和适应，让自己成为AI时代的受益者而非旁观者。',
                translation: 'Looking ahead, AI will continue to deeply influence all levels of society. Rather than worrying about being replaced by technology, it\'s better to actively learn and adapt, making yourself a beneficiary of the AI era rather than a bystander.'
            }
        ],
        vocabulary: [
            { word: '前所未有', pinyin: 'qiánsuǒwèiyǒu', meaning: 'unprecedented', level: 6 },
            { word: '渗透', pinyin: 'shèntòu', meaning: 'to permeate', level: 6 },
            { word: '协助', pinyin: 'xiézhù', meaning: 'to assist', level: 5 },
            { word: '诊断', pinyin: 'zhěnduàn', meaning: 'diagnosis', level: 5 },
            { word: '病变', pinyin: 'bìngbiàn', meaning: 'lesion', level: 6 },
            { word: '深刻变革', pinyin: 'shēnkè biàngé', meaning: 'profound change', level: 6 },
            { word: '量身定制', pinyin: 'liángshēn dìngzhì', meaning: 'tailor-made', level: 6 },
            { word: '因材施教', pinyin: 'yīncái shījiào', meaning: 'teach according to aptitude', level: 6 },
            { word: '算法偏见', pinyin: 'suànfǎ piānjiàn', meaning: 'algorithmic bias', level: 6 },
            { word: '规避', pinyin: 'guībì', meaning: 'to avoid/evade', level: 6 },
            { word: '旁观者', pinyin: 'pángguānzhě', meaning: 'bystander', level: 6 }
        ]
    },

    // HSK 6 - History/Culture
    {
        id: 'silk-road',
        title: '丝绸之路的历史与遗产',
        titleEn: 'History and Legacy of the Silk Road',
        level: 6,
        category: 'history',
        wordCount: 480,
        estimatedMinutes: 5,
        content: [
            {
                text: '丝绸之路是古代连接东西方文明的重要贸易通道，其名称源于中国向西方出口的珍贵丝绸。这条道路不仅促进了商品的流通，更成为文化、宗教和思想交流的桥梁。',
                translation: 'The Silk Road was an important trade route connecting East and West civilizations in ancient times, named after the precious silk China exported to the West. This road not only facilitated the flow of goods but also became a bridge for cultural, religious, and intellectual exchange.'
            },
            {
                text: '丝绸之路大约形成于公元前2世纪的汉朝时期。张骞出使西域被认为是丝绸之路正式开通的标志。此后，大量的商人、使节和僧侣沿着这条道路往来于东西方之间。',
                translation: 'The Silk Road formed around the 2nd century BC during the Han Dynasty. Zhang Qian\'s mission to the Western Regions is considered the official opening of the Silk Road. Thereafter, numerous merchants, envoys, and monks traveled between East and West along this route.'
            },
            {
                text: '通过丝绸之路，中国的丝绸、瓷器、茶叶传入西方，而西方的玻璃、香料、宗教则传入中国。佛教便是通过丝绸之路从印度传入中国，对中国文化产生了深远的影响。',
                translation: 'Through the Silk Road, Chinese silk, porcelain, and tea were introduced to the West, while Western glass, spices, and religions came to China. Buddhism reached China from India via the Silk Road, profoundly influencing Chinese culture.'
            },
            {
                text: '如今，"一带一路"倡议承载着古代丝绸之路的精神遗产，旨在促进沿线国家的经济合作与文化交流。这条古老的道路正以新的形式焕发着生机与活力。',
                translation: 'Today, the Belt and Road Initiative carries the spiritual legacy of the ancient Silk Road, aiming to promote economic cooperation and cultural exchange among participating countries. This ancient road is revitalizing in new forms.'
            }
        ],
        vocabulary: [
            { word: '贸易通道', pinyin: 'màoyì tōngdào', meaning: 'trade route', level: 6 },
            { word: '促进', pinyin: 'cùjìn', meaning: 'to promote', level: 5 },
            { word: '流通', pinyin: 'liútōng', meaning: 'circulation', level: 5 },
            { word: '汉朝', pinyin: 'Hàncháo', meaning: 'Han Dynasty', level: 5 },
            { word: '出使', pinyin: 'chūshǐ', meaning: 'to be sent as envoy', level: 6 },
            { word: '西域', pinyin: 'Xīyù', meaning: 'Western Regions', level: 6 },
            { word: '使节', pinyin: 'shǐjié', meaning: 'envoy', level: 6 },
            { word: '僧侣', pinyin: 'sēnglǚ', meaning: 'monks', level: 6 },
            { word: '瓷器', pinyin: 'cíqì', meaning: 'porcelain', level: 5 },
            { word: '倡议', pinyin: 'chàngyì', meaning: 'initiative', level: 6 },
            { word: '焕发', pinyin: 'huànfā', meaning: 'to radiate/revitalize', level: 6 }
        ]
    }
];

export default GRADED_STORIES;
