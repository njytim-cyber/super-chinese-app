import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFSRSStore } from '../stores';
import { speakChinese } from '../utils';
import './ReaderPage.css';

// Sample reading content (will be replaced with actual HSK-graded content)
const SAMPLE_CONTENT = {
    title: '我的一天',
    titlePinyin: 'Wǒ de yī tiān',
    titleMeaning: 'My Day',
    paragraphs: [
        {
            chinese: '今天早上我六点起床。',
            pinyin: 'Jīntiān zǎoshang wǒ liù diǎn qǐchuáng.',
            words: [
                { chinese: '今天', pinyin: 'jīntiān', meaning: 'today', hskLevel: 1 },
                { chinese: '早上', pinyin: 'zǎoshang', meaning: 'morning', hskLevel: 1 },
                { chinese: '我', pinyin: 'wǒ', meaning: 'I; me', hskLevel: 1 },
                { chinese: '六', pinyin: 'liù', meaning: 'six', hskLevel: 1 },
                { chinese: '点', pinyin: 'diǎn', meaning: "o'clock", hskLevel: 1 },
                { chinese: '起床', pinyin: 'qǐchuáng', meaning: 'to get up', hskLevel: 1 },
            ]
        },
        {
            chinese: '我吃了早饭，然后去学校。',
            pinyin: 'Wǒ chī le zǎofàn, ránhòu qù xuéxiào.',
            words: [
                { chinese: '我', pinyin: 'wǒ', meaning: 'I; me', hskLevel: 1 },
                { chinese: '吃', pinyin: 'chī', meaning: 'to eat', hskLevel: 1 },
                { chinese: '了', pinyin: 'le', meaning: '(particle)', hskLevel: 1 },
                { chinese: '早饭', pinyin: 'zǎofàn', meaning: 'breakfast', hskLevel: 2 },
                { chinese: '然后', pinyin: 'ránhòu', meaning: 'then', hskLevel: 2 },
                { chinese: '去', pinyin: 'qù', meaning: 'to go', hskLevel: 1 },
                { chinese: '学校', pinyin: 'xuéxiào', meaning: 'school', hskLevel: 1 },
            ]
        },
        {
            chinese: '下午三点半我回家了。',
            pinyin: 'Xiàwǔ sān diǎn bàn wǒ huí jiā le.',
            words: [
                { chinese: '下午', pinyin: 'xiàwǔ', meaning: 'afternoon', hskLevel: 1 },
                { chinese: '三', pinyin: 'sān', meaning: 'three', hskLevel: 1 },
                { chinese: '点', pinyin: 'diǎn', meaning: "o'clock", hskLevel: 1 },
                { chinese: '半', pinyin: 'bàn', meaning: 'half', hskLevel: 1 },
                { chinese: '我', pinyin: 'wǒ', meaning: 'I; me', hskLevel: 1 },
                { chinese: '回家', pinyin: 'huí jiā', meaning: 'to return home', hskLevel: 1 },
                { chinese: '了', pinyin: 'le', meaning: '(particle)', hskLevel: 1 },
            ]
        }
    ]
};

interface WordInfo {
    chinese: string;
    pinyin: string;
    meaning: string;
    hskLevel: number;
}

interface WordPopupProps {
    word: WordInfo;
    position: { x: number; y: number };
    onClose: () => void;
    onAddToDeck: () => void;
}

function WordPopup({ word, position, onClose, onAddToDeck }: WordPopupProps) {
    const { t } = useTranslation();

    const handleSpeak = () => {
        speakChinese(word.chinese);
    };

    return (
        <motion.div
            className="word-popup"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{
                left: Math.min(position.x, window.innerWidth - 220),
                top: position.y + 10
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="popup-header">
                <span className="popup-chinese">{word.chinese}</span>
                <button className="popup-speak-btn" onClick={handleSpeak}>🔊</button>
            </div>
            <div className="popup-pinyin">{word.pinyin}</div>
            <div className="popup-meaning">{word.meaning}</div>
            <div className="popup-hsk">HSK {word.hskLevel}</div>
            <div className="popup-actions">
                <button className="popup-add-btn" onClick={onAddToDeck}>
                    ➕ {t('reader.addToDeck', 'Add to Deck')}
                </button>
            </div>
        </motion.div>
    );
}

export function ReaderPage() {
    const { t } = useTranslation();
    const { addCard } = useFSRSStore();
    const [selectedWord, setSelectedWord] = useState<WordInfo | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [wordsKnown, setWordsKnown] = useState(0);
    const [wordsAdded, setWordsAdded] = useState<Set<string>>(new Set());

    const handleWordClick = useCallback((word: WordInfo, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setPopupPosition({ x: rect.left, y: rect.bottom });
        setSelectedWord(word);
    }, []);

    const handleClosePopup = useCallback(() => {
        setSelectedWord(null);
    }, []);

    const handleAddToDeck = useCallback(() => {
        if (selectedWord) {
            addCard(selectedWord.chinese);
            setWordsAdded(prev => new Set(prev).add(selectedWord.chinese));
            setWordsKnown(prev => prev + 1);
            setSelectedWord(null);
        }
    }, [selectedWord, addCard]);

    const renderWord = (word: WordInfo, index: number) => {
        const isAdded = wordsAdded.has(word.chinese);
        return (
            <span
                key={`${word.chinese}-${index}`}
                className={`reader-word ${isAdded ? 'added' : ''}`}
                onClick={(e) => handleWordClick(word, e)}
            >
                {word.chinese}
            </span>
        );
    };

    return (
        <div className="reader-page" onClick={handleClosePopup}>
            {/* Header */}
            <header className="reader-header">
                <h1 className="reader-title">{SAMPLE_CONTENT.title}</h1>
                <span className="reader-title-pinyin">{SAMPLE_CONTENT.titlePinyin}</span>
            </header>

            {/* Stats Bar */}
            <div className="reader-stats">
                <div className="stat-pill">
                    <span className="stat-icon">📖</span>
                    <span className="stat-value">{wordsKnown}</span>
                    <span className="stat-label">{t('reader.wordsAdded', 'words added')}</span>
                </div>
            </div>

            {/* Content */}
            <main className="reader-content">
                {SAMPLE_CONTENT.paragraphs.map((para, pIndex) => (
                    <motion.div
                        key={pIndex}
                        className="reader-paragraph"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: pIndex * 0.1 }}
                    >
                        <p className="paragraph-chinese">
                            {para.words.map((word, wIndex) => renderWord(word, wIndex))}
                        </p>
                        <p className="paragraph-pinyin">{para.pinyin}</p>
                    </motion.div>
                ))}
            </main>

            {/* Word Popup */}
            <AnimatePresence>
                {selectedWord && (
                    <WordPopup
                        word={selectedWord}
                        position={popupPosition}
                        onClose={handleClosePopup}
                        onAddToDeck={handleAddToDeck}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
