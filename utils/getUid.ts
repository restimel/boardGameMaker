/* Define the range of printable UTF-8 characters */
function generateBaseChars(length: number) {
    const chars: string[] = [];
    const specialChars = [
        0x200B, /* Zero Width Space */
        0x200C, /* Zero Width Non-Joiner, ZWNJ */
        0x200D, /* Zero Width Joiner, ZWJ */
        0x200E, /* Left-to-Right Mark, LRM */
        0x200F, /* Right-to-Left Mark (RLM) */
        0x2028, /* Line separator */
        0x2029, /* Paragraph separator */
        0x202A, /* Left-to-Right Embedding (LRE) */
        0x202B, /* Right-to-Left Embedding (RLE) */
        0x202D, /* Left-to-Right Override (LRO) */
        0x202E, /* Right-to-Left Override (RLO) */
        0x2060, /* Word Joiner (WJ) */
        0xFFFD, /* Replacement Character */
        '\\', /* to avoid escaping in json */
        '"', /* to avoid escaping in json */
    ];

    for (let charIdx = 0x0020; chars.length < length; charIdx++) {
        /* Skip non-printable characters */
        if (
            (charIdx >= 0x0080 && charIdx <= 0x009F) || /* C1 control characters */
            charIdx === 0x00AD || /* Soft Hyphen */
            (charIdx >= 0x0300 && charIdx <= 0x036F) || /* Combining Diacritical Marks */
            (charIdx >= 0x0590 && charIdx <= 0x05FF) || /* Hebrew */
            (charIdx >= 0x0600 && charIdx <= 0x06FF) || /* Arabic */
            (charIdx >= 0x0700 && charIdx <= 0x074F) || /* Syriac */
            (charIdx >= 0x0750 && charIdx <= 0x077F) || /* Arabic Supplement */
            (charIdx >= 0x0780 && charIdx <= 0x07BF) || /* Thaana */
            (charIdx >= 0x07C0 && charIdx <= 0x07FF) || /* N'Ko */
            (charIdx >= 0x0800 && charIdx <= 0x083F) || /* Samaritan */
            (charIdx >= 0x0840 && charIdx <= 0x085F) || /* Mandaic */
            (charIdx >= 0x08A0 && charIdx <= 0x08FF) || /* Arabic Extended-A */
            (charIdx >= 0xFB50 && charIdx <= 0xFDFF) || /* Arabic Presentation Forms-A */
            (charIdx >= 0xFE00 && charIdx <= 0xFE0F) || /* Variation Selectors */
            (charIdx >= 0xFE20 && charIdx <= 0xFE2F) || /* Combining Half Marks */
            (charIdx >= 0xFE70 && charIdx <= 0xFEFF) || /* Arabic Presentation Forms-B */
            (charIdx >= 0x1E900 && charIdx <= 0x1E95F) || /* Adlam */
            charIdx === 0x200B
        ) {
            continue;
        }

        chars.push(String.fromCharCode(charIdx));
    }

    /* Ensure we have exactly the required characters */
    return chars.slice(0, length);
}

const base = 2048;
const BASE_CHARS = generateBaseChars(base);
const CHAR_MAP = new Map(BASE_CHARS.map((char, index) => [char, index]));

function toBase(num: number): string {
    if (num < 0) {
        throw new Error('Negative numbers not supported');
    }

    let result = '';
    do {
        result = BASE_CHARS[num % base] + result;
        num = Math.floor(num / base);
    } while (num > 0);

    return result;
}

function fromBase(str: string): number {
    return Array.from(str).reduce((acc, char) => {
        if (!CHAR_MAP.has(char)) {
            throw new Error(`Invalid character in input: ${char}`);
        }

        return acc * base + CHAR_MAP.get(char)!;
    }, 0);
}

export default function getUid(key: string = ''): string {
    const id = Math.random() * 1e19;
    const time = Math.floor(Date.now() / 1000);

    return key + toBase(id) + toBase(time);
}
