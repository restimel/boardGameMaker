
function buildRefContent(value: string, options: RefOptions): [MaterialDescription | undefined, MaterialContent | null | undefined] {
    const ref = options.material?.description[value];

    if (!ref) {
        if (value === 'index') {
            const ref: MaterialDescription = {
                name: 'index',
                type: 'number',
                defaultValue: '0',
            };
            const targetContent = options.content;
            const content = {
                index: (options.material?.contents.indexOf(targetContent!) ?? -1) + 1,
            };

            return [ref, content];
        }

        if (value === 'total') {
            const ref: MaterialDescription = {
                name: 'total',
                type: 'number',
                defaultValue: '0',
            };
            const content = {
                total: options.material?.contents.length,
            };

            return [ref, content];
        }
    }

    return [ref, options.content];
}

/* Regular expression to match `:ref<value>:` */
const refPattern = /:ref<\s*([^:]+)\s*>:/gi;
export function replaceRef(value: string, options: RefOptions, insideToken = false) {
    const str = insideToken ? `:${value}:` : value;
    const result = str.replace(refPattern, (_pattern, value) => {
        const [ref, content] = buildRefContent(value, options);

        const list = new Set(options.list ?? []);
        const name = ref?.name;

        if (name) {
            if (list.has(name)) {
                return value;
            }

            list.add(name);
        }

        return getRefValue(ref, {
            loop: {},
            project: activeProject.value,
            ...options,
            list,
        });
    });

    if (!insideToken) {
        return result;
    }

    if (result === `:${value}:`) {
        return value;
    }

    return result;
}

/* Regular expression to match `:enum<name, key>:` */
const enumPattern = /:enum<\s*([^:,]+)\s*,\s*([^:]+)\s*>:/gi;
export function replaceEnum(str: string, options: RefOptions) {
    return str.replace(enumPattern, (_pattern, name, value) => {
        const enumName = replaceRef(name, options, true);
        const val = replaceRef(value, options, true);
        const enumRef = getEnum(activeProject.value.enumerations, enumName);

        return getEnumValue(enumRef, val);
    });
}
