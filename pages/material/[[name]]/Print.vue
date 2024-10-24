<template>
    <div v-if="material"
        class="print-material"
    >
        <Preview v-for="(content, index) in material.contents"
            :key="`material-${name}-${index}`"
            :material="material"
            :content="content"
            readonly
        />
    </div>
    <div v-else
        class="empty"
    >
        No materials
    </div>
</template>
<script setup lang="ts">

import { computed } from 'vue';
import Preview from '~/components/Preview.vue';
import projectStore from '~/stores/project';

const project = projectStore();
const route = useRoute();
const name: string = route.params.name as unknown as string;

const material = computed<Material>(() => {
    const projectMaterial = project.materials.value.find((item) => item.name === name) as Material;

    return projectMaterial;
});

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
