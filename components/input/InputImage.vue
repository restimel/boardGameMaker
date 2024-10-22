<template>
    <label class="input-image">
        {{ label }}
        <div>
            <input
                type="text"
                v-model="image"
                placeholder="url"
            >
            <br>
            <input type="file" @change="onFileChange" accept="image/*" />
        </div>

        <img
            class="preview"
            :src="image"
        >
    </label>
</template>
<script setup lang="ts">
type Props = {
    label?: string;
};

const props = defineProps<Props>();
const imageModel = defineModel<ContentValue>();
const emit = defineEmits<{
    (e: 'change', value: ContentValue): void;
}>();
const image = ref<string>(imageModel.value?.toString(10) ?? '');

const label = computed<string>(() => {
    const propLabel = props.label;

    if (propLabel === '') {
        return '';
    }

    if (!propLabel) {
        return 'Image:';
    }

    return propLabel + ':';
});

watch(imageModel, () => {
    image.value = imageModel.value?.toString(10) ?? '';
});

watch(image, () => {
    imageModel.value = image.value;
    change();
});

function onFileChange(event: InputEvent) {
    const file = event.currentTarget!.files?.[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            image.value = reader.result as string;
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };
    }
}

function change() {
    emit('change', imageModel.value);
}
</script>
<style scoped>
.input-image {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    align-items: center;
    gap: 5px;
}

.preview {
    display: inline-block;
    height: 3em;
}
</style>
