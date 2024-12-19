
const primitiveList = [
    'number',
    'string',
    'function',
    'bigint',
    'boolean',
];

export default function copyValue<T>(obj: T): T {
    const type = typeof obj;

    if (!obj) {
        return obj;
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((value) => copyValue(value)) as T;
    }

    if (obj instanceof Map) {
        return new Map(
            Array.from(obj, ([key, value]) => [
                copyValue(key),
                copyValue(value),
            ])
        ) as T;
    }

    if (obj instanceof Set) {
        return new Set(
            Array.from(obj, (value) => copyValue(value))
        ) as T;
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj) as T;
    }

    const copy = {} as T;
    for (const [key, value] of Object.entries(obj)) {
        (copy as any)[key] = copyValue(value);
    }

    return copy;
}
