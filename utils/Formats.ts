
export function getDefaultMaterialColor(): string {
    return '#FFFFFF';
}

export function getDefaultMaterialTextColor(): string {
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

export function formatValue(value: ContentValue, type: DescriptionType): string {
    switch (type) {
        case 'image': {
            if (typeof value === 'string') {
                return value;
            }

            return '';
        }

        case 'number': {
            if (typeof value === 'number') {
                return value.toString(10);
            }

            const conversion = Number(value);

            if (Number.isNaN(conversion)) {
                return '∅';
            }

            return conversion.toString(10);
        }

        case 'text': {
            if (typeof value === 'string') {
                return value;
            }

            if (value === undefined || value === null) {
                return '';
            }

            return value.toString(10);
        }

        case 'color': {
            if (typeof value === 'string') {
                return value;
            }

            return '';
        }

        default:
            /* case Enumeration or Enumeration-loop */
            return '';
    }
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

export function getRefValue(ref?: MaterialDescription | null, content?: MaterialContent | null, ctx?: MaterialContext): string {
    const type = ref?.type;
    const property = ref?.name ?? '';

    if (typeof type === 'undefined') {
        return `⚠️<${property || 'no ref'}>`;
    }

    if (isEnumLoop(type)) {
        const enumId = extractEnumLoopId(type);

        if (!ctx) {
            return formatValue(ref?.defaultValue || `<loop on ${enumId}>`, 'text')
        }

        const enumerations = ctx.project.enumerations;
        const enumeration = getEnum(enumerations, enumId, 'id');
        const enumKey = ctx.loop[enumId];
        const enumType = enumeration?.type;

        if (!enumKey) {
            return `<⚠️ unknown key ${enumId}>`;
        }

        const value = getEnumValue(enumeration, enumKey);
        return formatValue(value, enumType ?? type);
    }

    const propValue = content?.[property];

    /* When ref has a value */
    if (typeof propValue !== 'undefined') {
        return formatValue(propValue, type);
    }

    const defaultValue = ref?.defaultValue;

    /* When description has a default value */
    if (typeof defaultValue !== 'undefined' && defaultValue !== '') {
        return formatValue(defaultValue, type);
    }

    /* when no default are set */
    return getDefaultValue(type, property);
}

export function getLoopAttributes(descriptions: MaterialDescriptions): MaterialDescription[] {
    const attributes = Object.values(descriptions).filter((attribute) => {
        return isEnumLoop(attribute.type);
    })

    return attributes;
}

export function createContext(project: Project, descriptions: MaterialDescriptions): MaterialContext {
    const loop: Record<string, string> = {};
    const enumerations = project.enumerations;

    getLoopAttributes(descriptions).forEach((attribute) => {
        const enumId = extractEnumLoopId(attribute.type);
        const enumeration = getEnum(enumerations, enumId, 'id');

        if (enumeration) {
            loop[enumId] = enumeration.values[0].key;
        }
    });

    return {
        loop: loop,
        project: project,
    };
}

function contextCombination(loops: Map<string, string[]>) {
    const keys = Array.from(loops.keys());
    const indexes = keys.map(() => 0);
    const keyLength = keys.length - 1;
    const list = [];

    function increment(idx: number) {
        const key = keys[idx];
        const length = loops.get(key)?.length ?? 0;
        const index = indexes[idx] + 1;

        if (index < length) {
            indexes[idx] = index;
        } else {
            if (idx > 0) {
                indexes[idx] = 0;
                return increment(idx - 1);
            } else {
                return false;
            }
        }

        return true;
    }

    do {
        const loopCtx = keys.reduce((ctx, key, idx) => {
            const attrIdx = indexes[idx];
            const value = loops.get(key)?.[attrIdx] ?? '';

            ctx[key] = value;

            return ctx;
        }, {} as Record<string, string>);

        list.push(loopCtx);
    } while(increment(keyLength));

    return list;
}

export function createAllContext(project: Project, descriptions: MaterialDescriptions): MaterialContext[] {
    const loops: Map<string, string[]> = new Map();
    const enumerations = project.enumerations;

    getLoopAttributes(descriptions).forEach((attribute) => {
        const enumId = extractEnumLoopId(attribute.type);
        const enumeration = getEnum(enumerations, enumId, 'id');

        if (enumeration) {
            loops.set(enumId, enumeration.values.map((value) => value.key));
        }
    });

    const contexts = contextCombination(loops).map((loop) => {
        return {
            loop: loop,
            project: project,
        };
    });

    return contexts;
}

export function createProject(name: string): GameProject {
    const id = getUid();

    const project: GameProject = {
        title: name,
        id: id,
        versions: {},
    };

    return project;
}
