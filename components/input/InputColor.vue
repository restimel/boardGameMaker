<template>
    <label>
        {{ props.label ?? 'Color' }}:
        <span v-if="mode === 'absolute'">
            <input type="color" v-model="color" >

            <label class="inline">
                <input
                    type="checkbox"
                    :checked="isTransparent"
                    @change="changeTransparent"
                >
                <span class="unit">
                    Transparent
                </span>
            </label>
        </span>
        <span v-else>
            <select
                v-model="color"
            >
                <option v-for="item of allList"
                    :value="item.id"
                    :key="`color option ${item.id}`"
                >
                    {{ item.text }}
                </option>
            </select>
        </span>

        <InputToggle v-if="!disabledRef || mode === 'ref'"
            leftLabel="Absolute"
            rightLabel="Reference"
            :value="mode !== 'absolute'"
            @change="(value) => mode = value ? 'ref' : 'absolute'"
        />
    </label>
</template>
<script setup lang="ts">
type Props = {
    label?: string;
    context: MaterialContext;
};

const props = defineProps<Props>();
const colorModel = defineModel<ContentValue>();
const emit = defineEmits<{
    (e: 'change', value: ContentValue): void;
}>();
const color = ref<string>(colorModel.value?.toString(10) ?? '');

const isReference = computed<boolean>(() => {
    const value = colorModel.value;
    return typeof value === 'string' && value.startsWith(':');
});

const mode = ref<'absolute' | 'ref'>(isReference.value ? 'ref' : 'absolute')

const isTransparent = computed<boolean>(() => {
    return colorModel.value === 'transparent' || colorModel.value === '';
});

const columnList = computed<Item[]>(() => {
    const material = props.context.material;
    const descriptions = material?.description;

    if (!descriptions) {
        return [];
    }

    const listRef = Object.entries(descriptions).map(([key, value]) => {
        return {
            id: key,
            text: value.name,
        };
    });

    return listRef;
});

const refList = computed<Item[]>(() => {
    return columnList.value.map((item) => {
        return {
            id: `:ref<${item.id}>:`,
            text: `attribute: ${item.text}`,
        };
    });
});

const enumList = computed<Item[]>(() => {
    const project = props.context.project;
    const enumerations = project.enumerations;

    if (!enumerations) {
        return [];
    }

    const listEnum = enumerations.flatMap((value) => {
        return columnList.value.map((column) => {
            return {
                id: `:enum<${value.name}, ref<${column.id}>>:`,
                text: `Enum: ${value.name} with attribute ${column.text}`,
            };
        });
    });

    return listEnum;
});

const allList = computed<Item[]>(() => {
    return refList.value.concat(enumList.value);
})

const disabledRef = computed<boolean>(() => {
    return allList.value.length === 0;
});

function changeTransparent() {
    if (isTransparent.value) {
        colorModel.value = color.value;
        return;
    }

    colorModel.value = 'transparent';
}

watch(colorModel, () => {
    if (!isTransparent.value) {
        color.value = colorModel.value?.toString(10) ?? '';
    }
});

watch(color, () => {
    colorModel.value = color.value;
    change();
});

function change() {
    emit('change', colorModel.value);
}
</script>
<style scoped>
.inline {
    display: inline;
}
</style>
