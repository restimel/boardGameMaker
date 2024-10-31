<template>
    <TextEditor v-if="type === 'text'"
        v-model="value"
        :placeholder="getRefValue(props.description, {})"
        :material="material"
        :content="content"
        noPreview
        @change="change"
    />
    <input v-else-if="type === 'number'"
        type="number"
        v-model="value"
        :placeholder="getRefValue(props.description, {})"
        @change="change"
    />
    <InputImage v-else-if="type === 'image'"
        v-model="value"
        label=""
        @change="change"
    />
    <InputColor v-else-if="type === 'color'"
        v-model="value"
        @change="change"
    />
    <select v-else-if="type.startsWith('enumeration:')"
        v-model="value"
        @change="change"
    >
        <option v-for="enumeration of (getEnum(project.enumerations.value, type.slice(12), 'id')?.values ?? [])"
            :key="`inputContent-${enumeration.id}`"
            :value="enumeration.value"
        >
            {{ enumeration.value }}
        </option>
    </select>
    <input v-else
        type="text"
        v-model="value"
        :placeholder="getRefValue(props.description, {})"
    />
</template>
<script setup lang="ts">
import projectStore from '~/stores/project';

const project = projectStore();

type Props = {
    description: MaterialDescription;
    material?: Material;
    content?: MaterialContent | null;
};

const props = defineProps<Props>();
const valueModel = defineModel<ContentValue>();
const emit = defineEmits<{
    (e: 'change', value: ContentValue): void;
}>();

const value = ref<ContentValue>(undefined);

const type = computed<DescriptionType>(() => {
    return props.description.type;
});

watch(valueModel, () => {
    value.value = valueModel.value;
}, {immediate: true});

watch(value, () => {
    valueModel.value = value.value;
});

function change() {
    emit('change', value.value);
}

</script>
<style scoped>
.inline {
    display: inline;
}
</style>
