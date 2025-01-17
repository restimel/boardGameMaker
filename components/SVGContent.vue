<template>
    <g v-if="type === 'Text'"
        :style="`--rotation: ${detail.rotation}deg;`"
        class="layer"
    >
        <rect
            :x="detail.position[0] * px"
            :y="detail.position[1] * px"
            :width="detail.dimension[0] * px"
            :height="detail.dimension[1] * px"
            :fill="getColor(detail.bgColor, extendedContext)"
        />

        <foreignObject v-if="type === 'Text'"
            :x="detail.position[0] * px"
            :y="detail.position[1] * px"
            :width="detail.dimension[0] * px"
            :height="detail.dimension[1] * px"
        >
            <div
                class="text-svg"
                :style="`
                    --text-size: ${detail.content.size * px}px;
                    --text-color: ${getColor(detail.content.color, extendedContext)};
                    --text-alignment: ${detail.content.alignment}
                `"
            >
                <Text
                    :value="value"
                    class="inline-text"
                    :context="extendedContext"
                />
            </div>
        </foreignObject>
    </g>
    <g v-else-if="type === 'Image'"
        :style="`--rotation: ${detail.rotation}deg;`"
        class="layer"
    >
        <rect
            :x="detail.position[0] * px"
            :y="detail.position[1] * px"
            :width="detail.dimension[0] * px"
            :height="detail.dimension[1] * px"
            :fill="getColor(detail.bgColor, extendedContext)"
        />
        <image
            :x="detail.position[0] * px"
            :y="detail.position[1] * px"
            :width="detail.dimension[0] * px"
            :height="detail.dimension[1] * px"
            :preserveAspectRatio="`${imageAlign} meet`"
            :href="value"
        />
    </g>
</template>
<script setup lang="ts">

type Props = {
    value: MetaMaterial;
    px: number;
    material: Material;
    content?: MaterialContent | null;
    context?: MaterialContext;
};

const props = defineProps<Props>();

const detail = computed(() => {
    return props.value;
});

const imageAlign = computed(() => {
    const align = detail.value.content.alignment;

    switch (align) {
        case 'start':
            return 'xMinYMid';
        case 'end':
            return 'xMaxYMid';
        case 'center':
        default:
            return 'xMidYMid';
    }
});

const type = computed(() => {
    const contentType = detail.value.content.type;

    if (contentType === 'StaticText') {
        return 'Text';
    }

    if (contentType === 'StaticImage') {
        return 'Image';
    }

    if (contentType === 'Reference') {
        if (descRef.value?.type === 'image') {
            return 'Image';
        }

        return 'Text';
    }

    return 'None';
});

const extendedContent = computed< MaterialContent | null | undefined>(() => {
    const context = props.context;
    const content = props.content ?? context?.content;

    if (!content) {
        return content;
    }

    const contents = context?.material?.contents;

    const extContent = {
        index: (contents?.indexOf(content) ?? 0) + 1,
        total: (contents?.length ?? 0),
        ... content,
    };

    return extContent;
});

const extendedContext = computed<MaterialContext>(() => {
    return {
        ...props.context,
        content: extendedContent.value,
    } as MaterialContext;
});

const value = computed<string>(() => {
    const contentType = detail.value.content.type;
    const contentValue = detail.value.content.value;
    const context = extendedContext.value;

    switch (contentType) {
        case 'StaticText': return contentValue;
        case 'StaticImage': return contentValue;
        case 'Reference': return getRefValue(descRef.value, context);
    }

    console.warn('type not managed yet :(', contentType);
    return '';
});

const descRef = computed<MaterialDescription | null>(() => {
    const contentType = detail.value.content.type;
    if (contentType !== 'Reference') {
        return null;
    }

    const contentValue = detail.value.content.value;
    const description = props.context?.material?.description ?? props.material.description;

    const reference = description[contentValue];

    if (!reference) {
        if (contentValue === 'index') {
            return {
                name: 'index',
                type: 'number',
                defaultValue: '0',
            };
        }
        if (contentValue === 'total') {
            return {
                name: 'total',
                type: 'number',
                defaultValue: '0',
            };
        }
    }

    return reference ?? null;
});

</script>
<style scoped>

.text-svg {
    width: 100%;
    height: 100%;
    overflow: hidden;
    word-wrap: break-word;
    font-size: var(--text-size);
    color: var(--text-color);
    margin: 0;
    user-select: none;
    text-align: var(--text-alignment);
}

.layer {
    transform-box: fill-box;
    transform-origin: center;
    transform: rotate(var(--rotation, 0));
}

</style>
