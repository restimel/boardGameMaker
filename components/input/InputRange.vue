<template>
    <span>
        <input
            type="range"
            v-model="internalValue"
            :min="props.min ?? 0"
            :max="props.max ?? 100"
            :step="props.step ?? 1"
        >
        <output>
            {{ value }}
            <span class="unit">{{ props.unit ?? 'mm' }}</span>
        </output>
    </span>
</template>
<script setup lang="ts">
type Props = {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
};

const props = defineProps<Props>();
const value = defineModel<number>();
const emit = defineEmits<{
    (e: 'change', value: ContentValue): void;
}>();

const internalValue = ref<number>(value.value ?? 0);

watch (internalValue, () => {
    value.value = +internalValue.value;
    change();
}, { immediate: true });

function change() {
    emit('change', value.value);
}
</script>
<style scoped>

</style>
