<template>
    <div
        :class="{
            'text-editor': true,
            'no-preview': props.noPreview,
        }"
    >
        <textarea
            v-model="value"
            :placeholder="props.placeholder"
            class="editor"
            @change="change"
        />
        <Text v-if="!props.noPreview"
            :value="value?.toString()"
        />
    </div>
</template>
<script setup lang="ts">

type Props = {
    placeholder?: string;
    noPreview?: boolean;
};

const props = defineProps<Props>();
const value = defineModel<ContentValue>();
const emit = defineEmits<{
    (e: 'change', value: ContentValue): void;
}>();

function change() {
    emit('change', value.value);
}
</script>
<style scoped>
.text-editor {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}
.text-editor.no-preview {
    grid-template-columns: 1fr;
}

.editor {
    width: 100%;
    height: 100%;
}
</style>
