<template>
    <span v-for="button of props.values"
        :keys="`radio-${uid}-${button.value}`"
        :class="{
            'radio-element': true,
            active: button.value === value,
        }"
        @click="value = button.value;change()"
    >
        {{ button.label }}
    </span>
</template>
<script setup lang="ts">
type Props = {
    values: {label: string; value: string}[];
};

const props = defineProps<Props>();
const value: Ref<string> = defineModel<string>() as any;
const emit = defineEmits<{
    (e: 'change', value: ContentValue): void;
}>();

const uid = Math.random();

function change() {
    emit('change', value.value);
}
</script>
<style scoped>

.radio-element {
    display: inline-block;
    padding: 5px;
    margin: 0;
    background-color: var(--button-bg-color);
    color: var(--text-color);
    cursor: pointer;

    border-left: 1px solid var(--table-border);
    border-right: 1px solid var(--table-border);
}
.active {
    background: var(--brand-primary);
    color: var(--brand-primary-color);
}

</style>
