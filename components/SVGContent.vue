<template>
    <g v-if="type === 'Text'">
        <rect
            :x="detail.position[0] * px"
            :y="detail.position[1] * px"
            :width="detail.dimension[0] * px"
            :height="detail.dimension[1] * px"
            :fill="detail.bgColor"
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
                    --text-color: ${detail.content.color};
                    --text-alignment: ${detail.content.alignment}
                `"
            >
                {{ value }}
            </div>
        </foreignObject>
    </g>
    <g v-else-if="type === 'Image'">
        <rect
            :x="detail.position[0] * px"
            :y="detail.position[1] * px"
            :width="detail.dimension[0] * px"
            :height="detail.dimension[1] * px"
            :fill="detail.bgColor"
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
import { getRefValue } from '~/composables/Formats';


type Props = {
    value: MetaMaterial;
    px: number;
    material: Material;
    content?: MaterialContent | null;
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
        if (ref.value?.type === 'image') {
            return 'Image';
        }

        return 'Text';
    }

    return 'None';
});

const value = computed<string>(() => {
    const contentType = detail.value.content.type;
    const contentValue = detail.value.content.value;

    switch (contentType) {
        case 'StaticText': return contentValue;
        case 'StaticImage': return contentValue;
        case 'Reference': return getRefValue(ref.value, props.content);
    }

    console.warn('type not managed yet :(', contentType);
    return '';
});

const ref = computed<MaterialDescription | null>(() => {
    const contentType = detail.value.content.type;
    if (contentType !== 'Reference') {
        return null;
    }

    const contentValue = detail.value.content.value;
    const description = props.material.description;

    const reference = description[contentValue];

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

</style>
