<template>
    <div class="cards-editor">
        <CardEditor v-model="material" />
        <CardEditor v-model="material" back />
    </div>
</template>
<script setup lang="ts">

const material: Ref<MaterialCard> = defineModel<MaterialCard>() as any;

</script>
<style scoped>
.cards-editor {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 20px;
    flex-wrap: wrap;
}
</style>
