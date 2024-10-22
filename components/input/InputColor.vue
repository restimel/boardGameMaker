<template>
    <label>
        {{ props.label ?? 'Color' }}:
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
    </label>
</template>
<script setup lang="ts">
type Props = {
    label?: string;
};

const props = defineProps<Props>();
const colorModel = defineModel<ContentValue>();
const emit = defineEmits<{
    (e: 'change', value: ContentValue): void;
}>();
const color = ref<string>(colorModel.value?.toString(10) ?? '');

const isTransparent = computed<boolean>(() => {
    return colorModel.value === 'transparent' || colorModel.value === '';
});

function changeTransparent() {
    if (isTransparent.value) {
        console.log('remove transparent', colorModel.value, color.value);
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
