
export function getDefaultMaterialColor(): Color {
    return '#FFFFFF';
}

export function getDefaultMaterialTextColor(): Color {
    return '#000000';
}

export const cardStandardFormats = new Map<string, CardFormat>([
    [
        'Poker',
        {
            name: 'Poker Size',
            dimensions: [63, 88],
            usage: 'Used in Poker, Magic: The Gathering, and many other standard card games',
        }
    ],
    [
        'Bridge',
        {
            name: 'Bridge Size',
            dimensions: [57, 89],
            usage: 'Used in trick-taking games like Bridge for better handling of multiple cards',
        }
    ],
    [
        'Mini American',
        {
            name: 'Mini American',
            dimensions: [41, 63],
            usage: 'Used in smaller board game components, e.g., Arkham Horror',
        }
    ],
    [
        'Mini European',
        {
            name: 'Mini European',
            dimensions: [44, 68],
            usage: 'Used in European board games, e.g., Ticket to Ride',
        }
    ],
    [
        'Standard American',
        {
            name: 'Standard American',
            dimensions: [56, 87],
            usage: 'Used for character, item, and event cards in board games, e.g., Catan',
        }
    ],
    [
        'Standard European',
        {
            name: 'Standard European',
            dimensions: [59, 92],
            usage: 'Used for larger cards in European-style games',
        }
    ],
    [
        'Tarot',
        {
            name: 'Tarot Size',
            dimensions: [70, 120],
            usage: 'Common in Tarot decks and board games with oversized cards',
        }
    ],
    [
        'Square Cards',
        {
            name: 'Square Cards',
            dimensions: [70, 70],
            usage: 'Used in specific games with abstract mechanics or artistic components',
        }
    ],
]);

export function getDefaultCardDimension(): Dimension {
    return cardStandardFormats.get('Poker')?.dimensions.slice() as Dimension ?? [0, 0];
}

export function getDefaultDiceFaces(): number {
    return 6;
}

export function getDefaultTextSize(rect?: Rectangle): number {
    return 4;
}

export function getDefaultValue(type: DescriptionType, defaultTextValue = '⚠️'): string {
    switch (type) {
        case 'image': return 'data:image/svg+xml,%3Csvg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100%25" height="100%25" fill="%23f0f0f0"/%3E%3Crect x="4" y="4" width="232" height="172" fill="none" stroke="%23999" stroke-width="2" stroke-dasharray="8 4"/%3E%3Crect x="70" y="50" width="100" height="80" fill="%23999"/%3E%3Ccircle cx="100" cy="80" r="15" fill="%23f0f0f0"/%3E%3Cpath d="M70 110 L100 90 L130 110 L170 80 L170 130 L70 130 Z" fill="%23f0f0f0"/%3E%3C/svg%3E';
        case 'number': return '0';
        case 'text': return `<${defaultTextValue}>`;
        case 'color': return getDefaultMaterialTextColor();
        default:
            /* case Enumeration */
            return '';
    }
}
