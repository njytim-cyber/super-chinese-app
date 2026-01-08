// Audio utilities for the app

// Web Audio API context singleton
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
};

// Success sound frequencies (ascending happy tones: C5, E5, G5, C6)
const SUCCESS_FREQUENCIES = [523.25, 659.25, 783.99, 1046.50];

/**
 * Play a success tone based on the character index
 * Higher index = higher pitch for escalating celebration
 */
export const playSuccessSound = (index: number): void => {
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.frequency.value = SUCCESS_FREQUENCIES[index] || SUCCESS_FREQUENCIES[0];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.warn('Audio playback failed:', e);
    }
};

/**
 * Speak a Chinese character using Web Speech API
 */
export const speakChinese = (text: string): void => {
    if (!('speechSynthesis' in window)) return;

    try {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Try to find a Chinese voice
        const voices = window.speechSynthesis.getVoices();
        const chineseVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'));
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        }

        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.warn('Speech synthesis failed:', e);
    }
};

// Pre-load voices when available
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}
