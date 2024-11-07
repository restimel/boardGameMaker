<template>
    <Dialog :open="open"
        @cancel="cancel"
        @confirm="confirm"
    >
        <Text :value="messageConfirmDialog" />
    </Dialog>
</template>
<script setup lang="ts">

import { messageConfirmDialog } from '~/composables/ConfirmDialogStore';

const open = computed<boolean>(() => {
    return messageConfirmDialog.value !== '';
});

function cancel() {
    messageConfirmDialog.value = '';
}

function confirm() {
    messageConfirmDialog.value = 'OK';
}

</script>

<style scoped>

footer {
    margin-block-start: 1em;
}
</style>
