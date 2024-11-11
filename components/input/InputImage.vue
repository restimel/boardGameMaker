<template>
    <label class="input-image">
        {{ label }}
        <div>
            <input
                type="text"
                v-model="image"
                placeholder="url"
                :readonly="image.length > maxLength"
            >
            <button @click="image = ''">
                ×
            </button>
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
const maxLength = 10_000;

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

const maxSize = 500 * 1024;
function onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files?.[0];

    if (!file) {
        image.value = '';
        element.setCustomValidity('');
        return;
    }

    if (file.size > maxSize) {
        element.value = '';
        element.setCustomValidity(`File is too big.\nThe maximum file size is ${maxSize / 1024}kib`);
        element.reportValidity();
        return;
    }

    if (!file.type.startsWith('image/')) {
        element.value = '';
        element.setCustomValidity('File should be an image');
        element.reportValidity();
        return;
    }

    element.setCustomValidity('');

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
        image.value = reader.result as string;
    };

    reader.onerror = (error) => {
        console.error('Error reading file:', error);
    };
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

.input-image.inline-text {
    display: inline-grid;
}

.preview {
    display: inline-block;
    height: 3em;
}
</style>
