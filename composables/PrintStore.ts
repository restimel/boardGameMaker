
export const printSettings = ref<Print>(new Map());

export function resetPrint() {
    printSettings.value.clear();
}
