/**
 * HSK Data Enrichment Script
 * Parses CC-CEDICT dictionary and enriches HSK word data with pinyin and meanings
 * 
 * Run: npx tsx src/data/enrichHSK.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CEDICTEntry {
    traditional: string;
    simplified: string;
    pinyin: string;
    definitions: string[];
}

interface EnrichedHSKItem {
    id: number;
    character: string;
    level: number;
    pinyin?: string;
    meaning?: string;
}

// Parse a single CC-CEDICT line
function parseCEDICTLine(line: string): CEDICTEntry | null {
    // Strip trailing \r if present
    const cleanLine = line.replace(/\r$/, '');

    // Format: TRADITIONAL SIMPLIFIED [pinyin] /definition1/definition2/.../
    // Example: 愛 爱 [ai4] /to love/to be fond of/
    const match = cleanLine.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/);
    if (!match) return null;

    return {
        traditional: match[1],
        simplified: match[2],
        pinyin: match[3],
        definitions: match[4].split('/').filter(d => d.trim())
    };
}

// Load and parse CC-CEDICT
async function loadCEDICT(filepath: string): Promise<Map<string, CEDICTEntry>> {
    console.log('Loading CC-CEDICT...');

    let content: string;

    if (filepath.endsWith('.gz')) {
        const compressed = fs.readFileSync(filepath);
        const decompressed = zlib.gunzipSync(compressed);
        content = decompressed.toString('utf-8');
    } else {
        content = fs.readFileSync(filepath, 'utf-8');
    }

    const dict = new Map<string, CEDICTEntry>();
    // Use explicit LF character for reliable line splitting
    const LF = String.fromCharCode(10);
    const lines = content.split(LF);

    for (const line of lines) {
        if (line.startsWith('#') || !line.trim()) continue;

        const entry = parseCEDICTLine(line);
        if (entry) {
            // Index by simplified Chinese
            dict.set(entry.simplified, entry);
        }
    }

    console.log(`  Loaded ${dict.size} entries`);
    return dict;
}

// Read existing HSK data file and extract words
function extractHSKWords(filepath: string): { words: Array<{ id: number, character: string, level: number }>, chars: Array<{ id: number, character: string, level: number }> } {
    const content = fs.readFileSync(filepath, 'utf-8');

    const words: Array<{ id: number, character: string, level: number }> = [];
    const chars: Array<{ id: number, character: string, level: number }> = [];

    // Parse HSK1_WORDS array
    const wordsMatch = content.match(/export const HSK\d_WORDS: HSKItem\[\] = \[([\s\S]*?)\];/);
    if (wordsMatch) {
        const wordsContent = wordsMatch[1];
        const itemRegex = /\{\s*id:\s*(\d+),\s*character:\s*'([^']+)',\s*level:\s*(\d+)\s*\}/g;
        let match;
        while ((match = itemRegex.exec(wordsContent)) !== null) {
            words.push({
                id: parseInt(match[1]),
                character: match[2],
                level: parseInt(match[3])
            });
        }
    }

    // Parse HSK1_CHARS array
    const charsMatch = content.match(/export const HSK\d_CHARS: HSKItem\[\] = \[([\s\S]*?)\];/);
    if (charsMatch) {
        const charsContent = charsMatch[1];
        const itemRegex = /\{\s*id:\s*(\d+),\s*character:\s*'([^']+)',\s*level:\s*(\d+)\s*\}/g;
        let match;
        while ((match = itemRegex.exec(charsContent)) !== null) {
            chars.push({
                id: parseInt(match[1]),
                character: match[2],
                level: parseInt(match[3])
            });
        }
    }

    return { words, chars };
}

// Generate enriched TypeScript module
function generateEnrichedModule(
    level: number,
    words: EnrichedHSKItem[],
    chars: EnrichedHSKItem[]
): string {
    let output = `/**
 * HSK Level ${level} Vocabulary (Enriched)
 * Auto-generated with pinyin and meanings from CC-CEDICT
 * Words: ${words.length}, Characters: ${chars.length}
 */

export interface HSKItem {
    id: number;
    character: string;
    level: number;
    pinyin?: string;
    meaning?: string;
}

export const HSK${level}_WORDS: HSKItem[] = [\n`;

    for (const word of words) {
        const pinyin = word.pinyin ? `'${word.pinyin.replace(/'/g, "\\'")}'` : 'undefined';
        const meaning = word.meaning ? `'${word.meaning.replace(/'/g, "\\'")}'` : 'undefined';
        output += `    { id: ${word.id}, character: '${word.character}', level: ${word.level}, pinyin: ${pinyin}, meaning: ${meaning} },\n`;
    }

    output += `];

export const HSK${level}_CHARS: HSKItem[] = [\n`;

    for (const char of chars) {
        const pinyin = char.pinyin ? `'${char.pinyin.replace(/'/g, "\\'")}'` : 'undefined';
        const meaning = char.meaning ? `'${char.meaning.replace(/'/g, "\\'")}'` : 'undefined';
        output += `    { id: ${char.id}, character: '${char.character}', level: ${char.level}, pinyin: ${pinyin}, meaning: ${meaning} },\n`;
    }

    output += `];

export const HSK${level}_WORD_COUNT = ${words.length};
export const HSK${level}_CHAR_COUNT = ${chars.length};
`;

    return output;
}

// Main execution
async function main() {
    const rawDir = path.join(__dirname, 'raw');
    const cedictPath = path.join(rawDir, 'cedict_ts.u8.gz');

    // Load CC-CEDICT
    const cedict = await loadCEDICT(cedictPath);

    let totalEnriched = 0;
    let totalMissing = 0;

    // Process each HSK level
    for (let level = 1; level <= 6; level++) {
        const dataPath = path.join(__dirname, `hsk${level}_data.ts`);

        if (!fs.existsSync(dataPath)) {
            console.log(`  Skipping Level ${level} (file not found)`);
            continue;
        }

        console.log(`Processing HSK ${level}...`);
        const { words, chars } = extractHSKWords(dataPath);

        // Enrich words
        const enrichedWords: EnrichedHSKItem[] = words.map(word => {
            const entry = cedict.get(word.character);
            if (entry) {
                totalEnriched++;
                return {
                    ...word,
                    pinyin: entry.pinyin,
                    meaning: entry.definitions[0] // Use first definition
                };
            } else {
                totalMissing++;
                return word;
            }
        });

        // Enrich chars
        const enrichedChars: EnrichedHSKItem[] = chars.map(char => {
            const entry = cedict.get(char.character);
            if (entry) {
                return {
                    ...char,
                    pinyin: entry.pinyin,
                    meaning: entry.definitions[0]
                };
            }
            return char;
        });

        // Generate enriched module
        const moduleContent = generateEnrichedModule(level, enrichedWords, enrichedChars);
        const outputPath = path.join(__dirname, `hsk${level}_enriched.ts`);

        fs.writeFileSync(outputPath, moduleContent, 'utf-8');
        console.log(`  Generated hsk${level}_enriched.ts (${enrichedWords.filter(w => w.pinyin).length}/${enrichedWords.length} words enriched)`);
    }

    console.log(`\nDone! Enriched ${totalEnriched} entries. ${totalMissing} entries not found in CC-CEDICT.`);
}

main().catch(console.error);
