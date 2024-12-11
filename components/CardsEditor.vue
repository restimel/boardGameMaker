<template>
    <div class="cards-editor">
        <CardEditor v-model="material" :project="project" />
        <CardEditor v-model="material" :project="project" back />
    </div>
</template>
<script setup lang="ts">

const material: Ref<MaterialCard> = defineModel<MaterialCard>() as any;
const project = activeProject;

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
