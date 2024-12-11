
export function getEnum(enumerations: Enumeration[], name: string, prop: 'id' | 'name' = 'name'): Enumeration | null {
    return enumerations.find((enumeration) => enumeration[prop] === name) ?? null;
}

export function getEnumValue(enumeration: Enumeration | null, key: string): string {
    if (!enumeration) {
        return '⚠️<no enumeration>';
    }

    const enumKeyValue = enumeration.values.find((enumValue) => enumValue.key === key);
    const type = enumeration.type;

    if (!enumKeyValue) {
        const defaultValue = enumeration.defaultValue;

        if (typeof defaultValue === 'undefined' || defaultValue === '') {
            return getDefaultValue(type, `${enumeration.name}, ${key}`);
        }

        return formatValue(defaultValue, type);
    }

    return formatValue(enumKeyValue.value, type);
}

export function isEnum(type: DescriptionType): boolean {
    return type.startsWith('enumeration:');
}

export function isEnumLoop(type: DescriptionType): boolean {
    return type.startsWith('enumeration-loop:');
}

export function extractEnumId(enumtype: DescriptionType): string {
    return enumtype.slice(12);
}

export function extractEnumLoopId(enumtype: DescriptionType): string {
    return enumtype.slice(17);
}
