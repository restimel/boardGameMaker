<template>
    <TextEditor v-if="type === 'text'"
        v-model="value"
        :placeholder="getRefValue(props.description, ctx)"
        :material="material"
        :content="content"
        noPreview
        @change="change"
    />
    <input v-else-if="type === 'number'"
        type="number"
        v-model="value"
        :placeholder="getRefValue(props.description, ctx)"
        @change="change"
    />
    <InputImage v-else-if="type === 'image'"
        v-model="value"
        label=""
        @change="change"
    />
    <InputColor v-else-if="type === 'color'"
        v-model="value"
        :context="context"
        @change="change"
    />
    <select v-else-if="type.startsWith('enumeration:')"
        v-model="value"
        @change="change"
    >
        <option v-for="enumeration of (getEnum(activeProject.enumerations, enumId, 'id')?.values ?? [])"
            :key="`inputContent-${enumeration.id}`"
            :value="enumeration.value"
        >
            {{ enumeration.key }} → {{ enumeration.value }}
        </option>
    </select>
    <span v-else-if="type.startsWith('enumeration-loop:')"
    >
        Loop on the {{ getEnum(activeProject.enumerations, enumId, 'id')?.values.length ?? 0 }} enumeration of {{ getEnum(activeProject.enumerations, enumId, 'id')?.name }}
    </span>
    <input v-else
        type="text"
        v-model="value"
        :placeholder="getRefValue(props.description, ctx)"
    />
</template>
<script setup lang="ts">

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

const context = computed<MaterialContext>(() => {
    const project = activeProject.value;
    const materialValue = props.material;
    const content = props.content;

    return createContext(project, materialValue, content);
});

const type = computed<DescriptionType>(() => {
    return props.description.type;
});

const ctx = computed<MaterialContext>(() => {
    return {
        loop: {},
        project: activeProject.value,
        material: props.material,
        content: props.content,
    };
});

const enumId = computed<string>(() => {
    const typeValue = type.value;

    if (typeValue.startsWith('enumeration:')) {
        return typeValue.slice(12);
    }

    if (typeValue.startsWith('enumeration-loop:')) {
        return typeValue.slice(17);
    }

    return '';
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
