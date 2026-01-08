/**
 * Unscripted Dialogue Transcripts
 * Natural conversations for listening comprehension
 * Features realistic speech patterns, fillers, and colloquialisms
 */

export interface DialogueTranscript {
    id: string;
    title: string;
    titleEn: string;
    context: string;
    level: 4 | 5 | 6;
    duration: string;
    speakers: Speaker[];
    dialogue: DialogueLine[];
    vocabulary: DialogueVocab[];
    culturalNotes: string[];
}

export interface Speaker {
    id: string;
    name: string;
    role: string;
}

export interface DialogueLine {
    speaker: string;
    text: string;
    translation: string;
    notes?: string;
}

export interface DialogueVocab {
    word: string;
    pinyin: string;
    meaning: string;
    usage: string;
}

export const DIALOGUE_TRANSCRIPTS: DialogueTranscript[] = [
    {
        id: 'coffee-chat',
        title: '周末聚会约咖啡',
        titleEn: 'Making Weekend Plans',
        context: '两位好朋友正在微信语音聊天，商量周末一起出去玩的事情。',
        level: 4,
        duration: '2:30',
        speakers: [
            { id: 'A', name: '小美', role: '女性，25岁，上班族' },
            { id: 'B', name: '小林', role: '男性，26岁，程序员' }
        ],
        dialogue: [
            { speaker: 'A', text: '喂，小林啊，你周末有空吗？', translation: 'Hey, Xiaolin, are you free this weekend?', notes: '喂 is a common phone greeting' },
            { speaker: 'B', text: '嗯...让我想想。周六上午可能要加班，但下午应该没事。怎么了？', translation: 'Hmm... let me think. I might have to work overtime Saturday morning, but the afternoon should be fine. What\'s up?', notes: '怎么了 is a casual way to ask what\'s going on' },
            { speaker: 'A', text: '那个...我发现了一家新开的咖啡店，网上评价特别好，想约你一起去尝尝。', translation: 'Well... I found a newly opened coffee shop. The online reviews are great, I want to invite you to try it.', notes: '那个 is a filler word like "um"' },
            { speaker: 'B', text: '哦是吗？在哪儿啊？离我们公司远不远？', translation: 'Oh really? Where is it? Is it far from our office?', notes: '' },
            { speaker: 'A', text: '就在那个...你知道吧，购物中心那边，走路大概十分钟吧。', translation: 'It\'s at that... you know, near the shopping center, about ten minutes walk.', notes: '你知道吧 is filler, like "you know"' },
            { speaker: 'B', text: '行行行，那就周六下午三点怎么样？我加完班直接过去。', translation: 'Okay okay, how about 3 PM Saturday? I\'ll head over right after work.', notes: 'Repeating 行 shows enthusiastic agreement' },
            { speaker: 'A', text: '没问题！对了，他们家的提拉米苏据说超级好吃，你一定要试试！', translation: 'No problem! By the way, their tiramisu is supposedly amazing, you have to try it!', notes: '据说 indicates hearsay' },
            { speaker: 'B', text: '好好好，我最近正好想吃甜点呢。那就这么定了啊！', translation: 'Great great, I\'ve been wanting dessert lately. Let\'s set it then!', notes: '这么定了 means "it\'s settled"' },
            { speaker: 'A', text: '嗯嗯，那到时候见！先这样啊，拜拜！', translation: 'Mm-hm, see you then! That\'s all for now, bye bye!', notes: '先这样 is a casual way to end a call' },
            { speaker: 'B', text: '好的好的，周六见！', translation: 'Okay okay, see you Saturday!', notes: '' }
        ],
        vocabulary: [
            { word: '加班', pinyin: 'jiābān', meaning: 'to work overtime', usage: '周六可能要加班' },
            { word: '评价', pinyin: 'píngjià', meaning: 'review/rating', usage: '网上评价特别好' },
            { word: '尝尝', pinyin: 'chángchang', meaning: 'to taste/try', usage: '想约你一起去尝尝' },
            { word: '据说', pinyin: 'jùshuō', meaning: 'it is said', usage: '据说超级好吃' },
            { word: '正好', pinyin: 'zhènghǎo', meaning: 'just right/happens to', usage: '我正好想吃甜点' }
        ],
        culturalNotes: [
            '中国朋友之间常用语音通话而不是打字，因为更加亲切方便',
            '重复词语（如"好好好"、"行行行"）表示热情的同意',
            '用"先这样"结束通话是很常见的礼貌用语'
        ]
    },
    {
        id: 'job-discussion',
        title: '同事间的工作交流',
        titleEn: 'Colleagues Discussing Work',
        context: '两位同事在茶水间碰面，聊起了最近的工作情况和公司变化。',
        level: 5,
        duration: '3:15',
        speakers: [
            { id: 'A', name: '张姐', role: '女性，35岁，市场部经理' },
            { id: 'B', name: '李明', role: '男性，28岁，市场部员工' }
        ],
        dialogue: [
            { speaker: 'A', text: '哎，李明，听说了吗？公司要进行架构调整。', translation: 'Hey, Li Ming, did you hear? The company is going to restructure.', notes: '哎 is an attention-getting interjection' },
            { speaker: 'B', text: '啊？真的假的？我还一点消息都没听到呢。是什么样的调整？', translation: 'Huh? Really? I haven\'t heard anything at all. What kind of restructuring?', notes: '真的假的 expresses disbelief' },
            { speaker: 'A', text: '据说是要把几个部门合并，然后成立一个新的事业部。具体方案好像还没定。', translation: 'Supposedly they\'re merging several departments and creating a new business unit. The specific plan hasn\'t been decided yet.', notes: '' },
            { speaker: 'B', text: '这...这会影响到我们部门吗？说实话，我有点担心自己的位置。', translation: 'This... will it affect our department? Honestly, I\'m a bit worried about my position.', notes: '说实话 means "to be honest"' },
            { speaker: 'A', text: '你放心啦，你最近那个项目做得那么漂亮，领导都看在眼里的。而且咱们市场部应该不会有太大变化。', translation: 'Relax, your recent project was done so well, the bosses have noticed. Besides, our marketing department probably won\'t change much.', notes: '漂亮 here means "excellent/well-done"' },
            { speaker: 'B', text: '希望吧...对了张姐，你觉得这次调整对公司是好事还是坏事？', translation: 'I hope so... By the way Zhang Jie, do you think this restructuring is good or bad for the company?', notes: '' },
            { speaker: 'A', text: '怎么说呢，从长远来看应该是必要的。现在市场竞争这么激烈，不变的话恐怕会落后。', translation: 'How should I put it, from a long-term view it\'s probably necessary. With competition so fierce, if we don\'t change we might fall behind.', notes: '怎么说呢 is a hedging phrase' },
            { speaker: 'B', text: '也是啊。那我们是不是应该多表现表现，争取给领导留个好印象？', translation: 'That\'s true. Should we show off more and try to leave a good impression on the bosses?', notes: 'Reduplication for emphasis' },
            { speaker: 'A', text: '哈哈，想法是没错，但别太刻意了。做好本职工作最重要。好了，我得回去开会了，回头聊！', translation: 'Haha, the idea is right, but don\'t be too deliberate. Doing your job well is most important. Alright, I need to go back for a meeting, chat later!', notes: '刻意 means deliberate/intentional' }
        ],
        vocabulary: [
            { word: '架构调整', pinyin: 'jiàgòu tiáozhěng', meaning: 'restructuring', usage: '公司要进行架构调整' },
            { word: '合并', pinyin: 'hébìng', meaning: 'to merge', usage: '把几个部门合并' },
            { word: '事业部', pinyin: 'shìyèbù', meaning: 'business unit', usage: '成立新的事业部' },
            { word: '看在眼里', pinyin: 'kàn zài yǎnlǐ', meaning: 'to notice/observe', usage: '领导都看在眼里' },
            { word: '本职工作', pinyin: 'běnzhí gōngzuò', meaning: 'one\'s own job duties', usage: '做好本职工作最重要' }
        ],
        culturalNotes: [
            '在中国职场，称呼年长同事为"X姐"或"X哥"表示尊重和亲近',
            '茶水间是同事之间交流信息和闲聊的常见场所',
            '中国职场文化中，给领导留下好印象很重要'
        ]
    },
    {
        id: 'apartment-hunt',
        title: '看房和租房谈判',
        titleEn: 'Apartment Hunting Negotiation',
        context: '一位年轻人正在和房东看房并讨论租房条件。',
        level: 5,
        duration: '4:00',
        speakers: [
            { id: 'A', name: '小王', role: '男性，24岁，刚毕业的大学生' },
            { id: 'B', name: '房东', role: '女性，50岁，房屋业主' }
        ],
        dialogue: [
            { speaker: 'B', text: '小伙子，你看这房子怎么样？采光不错吧，通风也好。', translation: 'Young man, what do you think of this apartment? The lighting is good, right? Good ventilation too.', notes: '小伙子 is a friendly way to address a young man' },
            { speaker: 'A', text: '嗯，确实挺亮堂的。不过我想问一下，这个月租4500，能不能便宜点？', translation: 'Yeah, it is quite bright. But I wanted to ask, this monthly rent of 4500, can it be cheaper?', notes: '亮堂 means bright/well-lit' },
            { speaker: 'B', text: '哎呀，这个价格已经很实在了！你看这地段，地铁站走路五分钟，周围超市、餐馆都有。', translation: 'Aiya, this price is already very fair! Look at this location, five minutes walk to the subway, supermarkets and restaurants nearby.', notes: '实在 means honest/reasonable' },
            { speaker: 'A', text: '我知道位置是挺好的，但是我刚毕业嘛，收入有限。您看能不能4000？我可以一次付半年的。', translation: 'I know the location is good, but I just graduated, my income is limited. Could you do 4000? I can pay half a year at once.', notes: 'Offering advance payment as negotiation tactic' },
            { speaker: 'B', text: '半年一付啊...这样吧，看你这小伙子挺实在的，4200，不能再少了。', translation: 'Paying half a year at once... Okay, you seem like an honest young man, 4200, can\'t go lower.', notes: '' },
            { speaker: 'A', text: '谢谢阿姨！那水电煤气是另算的吧？网费呢？', translation: 'Thanks auntie! So water, electricity, and gas are separate? What about internet?', notes: 'Calling older women 阿姨 is respectful' },
            { speaker: 'B', text: '对，水电煤气你自己交，网络的话这栋楼有光纤，你自己开户就行。', translation: 'Right, you pay your own utilities. For internet, this building has fiber optic, you just need to set up an account.', notes: '开户 means to open an account' },
            { speaker: 'A', text: '好的好的。对了阿姨，我能养个小猫吗？就是那种很安静的。', translation: 'Okay okay. By the way auntie, can I keep a small cat? The quiet kind.', notes: '' },
            { speaker: 'B', text: '嗯...猫的话应该没问题，但是你得保证不能破坏家具啊，退房的时候要恢复原样。', translation: 'Hmm... a cat should be fine, but you have to guarantee no damage to furniture, and restore everything when you move out.', notes: '恢复原样 means to restore to original condition' },
            { speaker: 'A', text: '放心吧阿姨，我一定爱护！那我们什么时候签合同？', translation: 'Don\'t worry auntie, I\'ll definitely take care of it! So when do we sign the contract?', notes: '' }
        ],
        vocabulary: [
            { word: '采光', pinyin: 'cǎiguāng', meaning: 'natural lighting', usage: '采光不错' },
            { word: '地段', pinyin: 'dìduàn', meaning: 'location/area', usage: '这个地段' },
            { word: '收入有限', pinyin: 'shōurù yǒuxiàn', meaning: 'limited income', usage: '收入有限' },
            { word: '水电煤气', pinyin: 'shuǐdiàn méiqì', meaning: 'utilities', usage: '水电煤气另算' },
            { word: '光纤', pinyin: 'guāngxiān', meaning: 'fiber optic', usage: '这栋楼有光纤' }
        ],
        culturalNotes: [
            '在中国租房时讨价还价是很正常的，提出比期望低的价格是常见策略',
            '提前付多月租金通常可以获得折扣',
            '许多房东对养宠物有限制，租客需要事先确认'
        ]
    }
];

export default DIALOGUE_TRANSCRIPTS;
