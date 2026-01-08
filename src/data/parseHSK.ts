/**
 * HSK Data Parser
 * Parses the raw wordlist.txt and charlist.txt from elkmovie/hsk30
 * and generates TypeScript modules for each HSK level
 * 
 * Run: npx tsx src/data/parseHSK.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface HSKWord {
    id: number;
    character: string;
    level: number;
}

interface HSKChar {
    id: number;
    character: string;
    level: number;
}

// Parse the wordlist.txt file
function parseWordlist(filepath: string): HSKWord[] {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    const words: HSKWord[] = [];
    let currentLevel = 0;

    for (const line of lines) {
        const trimmed = line.trim();

        // Check for level headers (e.g., "一级词汇表", "二级词汇表")
        if (trimmed.includes('级词汇表')) {
            const levelMatch = trimmed.match(/([一二三四五六七])级/);
            if (levelMatch) {
                const levelMap: Record<string, number> = {
                    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7
                };
                currentLevel = levelMap[levelMatch[1]] || 0;
            }
            continue;
        }

        // Parse word entries (format: "1 爱" or "1\t爱")
        const match = trimmed.match(/^(\d+)\s+(.+)$/);
        if (match && currentLevel > 0) {
            const id = parseInt(match[1]);
            let character = match[2];

            // Handle variants like "爸爸｜爸" - take the first form
            if (character.includes('｜')) {
                character = character.split('｜')[0];
            }

            // Remove grammar annotations like "（形）" "（动）"
            character = character.replace(/（[^）]+）/g, '').trim();

            words.push({ id, character, level: currentLevel });
        }
    }

    return words;
}

// Parse the charlist.txt file
function parseCharlist(filepath: string): HSKChar[] {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    const chars: HSKChar[] = [];
    let currentLevel = 0;

    for (const line of lines) {
        const trimmed = line.trim();

        // Check for level headers (e.g., "一级汉字表", "二级汉字表")
        if (trimmed.includes('级汉字表')) {
            const levelMatch = trimmed.match(/([一二三四五六七])级/);
            if (levelMatch) {
                const levelMap: Record<string, number> = {
                    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7
                };
                currentLevel = levelMap[levelMatch[1]] || 0;
            }
            continue;
        }

        // Parse char entries (format: "1\t爱")
        const match = trimmed.match(/^(\d+)\t(.+)$/);
        if (match && currentLevel > 0) {
            const id = parseInt(match[1]);
            const character = match[2].trim();
            chars.push({ id, character, level: currentLevel });
        }
    }

    return chars;
}

// Group words by level
function groupByLevel<T extends { level: number }>(items: T[]): Map<number, T[]> {
    const grouped = new Map<number, T[]>();
    for (const item of items) {
        if (!grouped.has(item.level)) {
            grouped.set(item.level, []);
        }
        grouped.get(item.level)!.push(item);
    }
    return grouped;
}

// Generate TypeScript module for a level
function generateLevelModule(level: number, words: HSKWord[], chars: HSKChar[]): string {
    const levelChars = chars.filter(c => c.level === level);

    let output = `/**
 * HSK Level ${level} Vocabulary
 * Auto-generated from elkmovie/hsk30 data
 * Words: ${words.length}, Characters: ${levelChars.length}
 */

export interface HSKItem {
    id: number;
    character: string;
    level: number;
}

export const HSK${level}_WORDS: HSKItem[] = [\n`;

    for (const word of words) {
        output += `    { id: ${word.id}, character: '${word.character}', level: ${word.level} },\n`;
    }

    output += `];

export const HSK${level}_CHARS: HSKItem[] = [\n`;

    for (const char of levelChars) {
        output += `    { id: ${char.id}, character: '${char.character}', level: ${char.level} },\n`;
    }

    output += `];

export const HSK${level}_WORD_COUNT = ${words.length};
export const HSK${level}_CHAR_COUNT = ${levelChars.length};
`;

    return output;
}

// Main execution
async function main() {
    const rawDir = path.join(__dirname, 'raw');
    const wordlistPath = path.join(rawDir, 'wordlist.txt');
    const charlistPath = path.join(rawDir, 'charlist.txt');

    console.log('Parsing wordlist.txt...');
    const words = parseWordlist(wordlistPath);
    console.log(`  Found ${words.length} words`);

    console.log('Parsing charlist.txt...');
    const chars = parseCharlist(charlistPath);
    console.log(`  Found ${chars.length} characters`);

    const wordsByLevel = groupByLevel(words);
    const charsByLevel = groupByLevel(chars);

    // Generate modules for each level
    for (let level = 1; level <= 7; level++) {
        const levelWords = wordsByLevel.get(level) || [];
        const levelChars = charsByLevel.get(level) || [];

        if (levelWords.length === 0 && levelChars.length === 0) {
            console.log(`  Skipping Level ${level} (no data)`);
            continue;
        }

        const moduleContent = generateLevelModule(level, levelWords, chars);
        const outputPath = path.join(__dirname, `hsk${level}_data.ts`);

        fs.writeFileSync(outputPath, moduleContent, 'utf-8');
        console.log(`  Generated hsk${level}_data.ts (${levelWords.length} words, ${levelChars.filter(c => c.level === level).length} chars)`);
    }

    console.log('\nDone! HSK data modules generated.');
}

main().catch(console.error);
