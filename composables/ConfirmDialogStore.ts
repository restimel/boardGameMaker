
export const messageConfirmDialog = ref<string>('');

export function confirmDialog(message: string): Promise<boolean> {
    const promise = new Promise<boolean>((resolve) => {
        if (messageConfirmDialog.value) {
            messageConfirmDialog.value = '';

            setTimeout(() => setMessage(message, resolve), 20);
        } else {
            setMessage(message, resolve);
        }
    });

    return promise;
}

function setMessage(message: string, resolve: (b: boolean) => void) {
    messageConfirmDialog.value = message;

    watch(messageConfirmDialog, () => {
        resolve(messageConfirmDialog.value === 'OK');
        messageConfirmDialog.value = '';
    }, { once: true });
}
