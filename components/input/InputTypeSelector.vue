<template>
    <select
        v-model="valueModel"
        :disabled="!!disabled"
        @change="change"
    >
        <option value="text">Text</option>
        <option value="number">Number value</option>
        <option value="image">Image</option>
        <option value="color">Color</option>
        <option v-for="enumeration of enumerationList"
            :key="enumeration[0]"
            :value="enumeration[0]"
        >
            {{ enumeration[1] }}
        </option>
    </select>
</template>
<script setup lang="ts">
import projectStore from '~/stores/project';

const project = projectStore();

type Props = {
    disabled?: boolean;
    withEnumeration?: boolean;
};

const props = defineProps<Props>();
const valueModel: Ref<DescriptionType> = defineModel<DescriptionType>() as any;
const emit = defineEmits<{
    (e: 'change', value: DescriptionType): void;
}>();

const enumerationList = computed<[string, string][]>(() => {
    if (!props.withEnumeration) {
        return [];
    }

    const enums = project.enumerations.value;

    return enums.map((enumeration) => {
        return [
            `enumeration:${enumeration.id}`,
            `Enumeration: ${enumeration.name}`
        ] as [string, string];
    });
});

function change() {
    emit('change', valueModel.value);
}
</script>
<style scoped>
</style>
