<template>
    <TextEditor v-if="type === 'text'"
        v-model="value"
        :placeholder="getRefValue(props.description, {})"
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
    <input v-else
        type="text"
        v-model="value"
        :placeholder="getRefValue(props.description, {})"
    />
</template>
<script setup lang="ts">
type Props = {
    description: MaterialDescription;
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
