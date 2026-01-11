/**
 * Encouragement Messages
 * Curated Chinese/English messages for feedback
 */

export interface Encouragement {
    chinese: string;
    english: string;
    emoji: string;
}

/** Shown after correct answers */
export const CORRECT_ENCOURAGEMENTS: Encouragement[] = [
    { chinese: '太棒了!', english: 'Awesome!', emoji: '🎉' },
    { chinese: '做得好!', english: 'Well done!', emoji: '⭐' },
    { chinese: '正确!', english: 'Correct!', emoji: '✅' },
    { chinese: '厉害!', english: 'Amazing!', emoji: '🌟' },
    { chinese: '继续加油!', english: 'Keep it up!', emoji: '💪' },
    { chinese: '很好!', english: 'Very good!', emoji: '👍' },
    { chinese: '完美!', english: 'Perfect!', emoji: '💯' },
    { chinese: '你真聪明!', english: "You're smart!", emoji: '🧠' },
];

/** Shown during streaks */
export const STREAK_ENCOURAGEMENTS: Encouragement[] = [
    { chinese: '连击!', english: 'Combo!', emoji: '🔥' },
    { chinese: '连续答对!', english: 'Streak!', emoji: '⚡' },
    { chinese: '势如破竹!', english: 'Unstoppable!', emoji: '🚀' },
    { chinese: '你太强了!', english: "You're on fire!", emoji: '💥' },
];

/** Shown at milestones */
export const MILESTONE_ENCOURAGEMENTS: Encouragement[] = [
    { chinese: '里程碑达成!', english: 'Milestone reached!', emoji: '🏆' },
    { chinese: '新纪录!', english: 'New record!', emoji: '📈' },
    { chinese: '突破自我!', english: 'Breaking through!', emoji: '🎯' },
];

/** Shown after incorrect answers */
export const TRY_AGAIN_MESSAGES: Encouragement[] = [
    { chinese: '再试一次!', english: 'Try again!', emoji: '🔄' },
    { chinese: '别灰心!', english: "Don't give up!", emoji: '💪' },
    { chinese: '差一点点!', english: 'Almost there!', emoji: '🎯' },
    { chinese: '没关系!', english: "It's okay!", emoji: '😊' },
];

/**
 * Get a random encouragement from a category
 */
export function getRandomEncouragement(
    category: 'correct' | 'streak' | 'milestone' | 'tryAgain'
): Encouragement {
    const lists = {
        correct: CORRECT_ENCOURAGEMENTS,
        streak: STREAK_ENCOURAGEMENTS,
        milestone: MILESTONE_ENCOURAGEMENTS,
        tryAgain: TRY_AGAIN_MESSAGES
    };
    const list = lists[category];
    return list[Math.floor(Math.random() * list.length)];
}
