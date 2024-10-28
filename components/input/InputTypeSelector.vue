<template>
    <select
        v-model="valueModel"
        :disabled="disabled"
        @change="change"
    >
        <option value="text">Text</option>
        <option value="number">Number value</option>
        <option value="image">Image</option>
        <option value="color">Color</option>
    </select>
</template>
<script setup lang="ts">
type Props = {
    disabled?: boolean;
};

const props = defineProps<Props>();
const valueModel: Ref<DescriptionType> = defineModel<DescriptionType>() as any;
const emit = defineEmits<{
    (e: 'change', value: DescriptionType): void;
}>();

function change() {
    emit('change', valueModel.value);
}
</script>
<style scoped>
</style>
