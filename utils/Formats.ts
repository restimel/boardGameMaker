
export function getColor(color: Color, options: MaterialContext): string {
    let refColor = color.trim();

    if (!refColor.startsWith(':')) {
        return refColor;
    }

    refColor = replaceRef(refColor, options, false);
    refColor = replaceEnum(refColor, options);

    return refColor;
}

export function formatValue(value: ContentValue, type: DescriptionType, context: MaterialContext): string {
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
                return getColor(value, context);
            }

            return '';
        }

        default:
            /* case Enumeration or Enumeration-loop */
            return '';
    }
}

export function getRefValue(ref?: MaterialDescription | null, ctx?: MaterialContext): string {
    const type = ref?.type;
    const property = ref?.name ?? '';

    if (typeof type === 'undefined') {
        return `⚠️<${property || 'no ref'}>`;
    }

    const content = ctx?.content;

    const options: MaterialContext = {
        material: ctx?.material,
        content: content,
        list: ctx?.list,
        project: ctx?.project ?? activeProject.value,
        loop: ctx?.loop ?? {},
    };

    if (isEnumLoop(type)) {
        const enumId = extractEnumLoopId(type);

        if (!ctx) {
            return formatValue(ref?.defaultValue || `<loop on ${enumId}>`, 'text', options);
        }

        const enumerations = ctx.project.enumerations;
        const enumeration = getEnum(enumerations, enumId, 'id');
        const enumKey = ctx.loop[enumId];
        const enumType = enumeration?.type;

        if (!enumKey) {
            return `<⚠️ unknown key ${enumId}>`;
        }

        const value = getEnumValue(enumeration, enumKey, ctx);
        return formatValue(value, enumType ?? type, options);
    }

    const propValue = content?.[property];

    /* When ref has a value */
    if (typeof propValue !== 'undefined') {
        return formatValue(propValue, type, options);
    }

    const defaultValue = ref?.defaultValue;

    /* When description has a default value */
    if (typeof defaultValue !== 'undefined' && defaultValue !== '') {
        return formatValue(defaultValue, type, options);
    }

    /* when no default are set */
    return getDefaultValue(type, property);
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

export function numberMaterial(material: Material): number {
    const length = material.contents.length;
    const allContexts = createAllContext(activeProject.value, material).length;

    return length * allContexts;
}
