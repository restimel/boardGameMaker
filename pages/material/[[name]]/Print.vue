<template>
    <PrintMaterial />
</template>
<script setup lang="ts">

definePageMeta({
    layout: 'print',
});

const route = useRoute();
const name: string = route.params.name as unknown as string;

resetPrint();

printSettings.value.set(name, 'face');

</script>
<style scoped>
.print-material {
    display: flex;
    flex-direction: row;
    gap: 0.3mm;
    flex-wrap: wrap;
}
.print-material > * {
    margin-top: -4px;
}
</style>
