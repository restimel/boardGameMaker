
export function getLoopAttributes(descriptions: MaterialDescriptions): MaterialDescription[] {
    const attributes = Object.values(descriptions).filter((attribute) => {
        return isEnumLoop(attribute.type);
    })

    return attributes;
}

export function createContext(project: Project, material?: Material, content?: MaterialContent | null): MaterialContext {
    const loop: Record<string, string> = {};
    const enumerations = project.enumerations;
    const descriptions = material?.description ?? {};

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
        material: material,
        content: content ?? material?.contents[0],
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

export function createAllContext(project: Project, material: Material): MaterialContext[] {
    const descriptions = material.description;
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
            material: material,
        };
    });

    return contexts;
}
