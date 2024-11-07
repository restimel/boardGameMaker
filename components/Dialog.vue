<template>
    <dialog ref="dialog">
        <slot />
        <footer>
            <button @click.stop="emit('cancel')" class="default-button">
                Cancel
            </button>
            <button @click.stop="emit('confirm')" class="main-button">
                Confirm
            </button>
        </footer>
    </dialog>
</template>
<script setup lang="ts">

type Props = {
    open: boolean
};

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'confirm'): void;
}>();

const dialog = useTemplateRef<HTMLDialogElement>('dialog');

watch(() => props.open, () => {
    if (props.open) {
        dialog.value?.showModal();
    } else {
        dialog.value?.close();
    }
});

onMounted(() => {
    if (props.open) {
        dialog.value?.showModal();
    }
});
</script>

<style scoped>

footer {
    margin-block-start: 1em;
}
</style>
