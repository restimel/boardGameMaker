<template>
    <label>
        {{ props.label }}:
        <input
            class="sizeValue"
            type="number"
            v-model="value1"
            @input="onInput"
        >
        <span class="unit">{{ unit ?? 'mm' }}</span>
        {{ separator ?? '×' }}
        <input
            class="sizeValue"
            type="number"
            v-model="value2"
            @input="onInput"
        >
        <span class="unit">{{ unit ?? 'mm' }}</span>
    </label>
</template>
<script setup lang="ts">
type Props = {
    label: string;
    separator?: string;
    precision?: number;
    unit?: string;
};

const props = defineProps<Props>();
const tuple: Ref<[number, number]> = defineModel<[number, number]>() as any;
const value1 = ref<number>(0);
const value2 = ref<number>(0);

const factor = computed(() => 10 ** (props.precision ?? 0));

watch(tuple, () => {
    const [val1, val2] = tuple.value;
    const f = factor.value;

    value1.value = Math.round(val1 * f) / f;
    value2.value = Math.round(val2 * f) / f;
}, { immediate: true });

function onInput() {
    tuple.value = [value1.value, value2.value];
}

</script>
<style scoped>
.sizeValue {
    max-width: 50px;
    -moz-appearance: textfield;
}
.sizeValue::-webkit-outer-spin-button,
.sizeValue::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
