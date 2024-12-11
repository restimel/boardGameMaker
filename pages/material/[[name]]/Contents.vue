<template>
    <div class="page">
        <h1>
            <NuxtLink to="/materials">
                Materials
            </NuxtLink>
        </h1>
        <div v-if="material"
            class="print-material"
        >
            <ContentList
                :material="material"
                :project="currentProject"
                v-model="material.contents"
            />
        </div>
        <div v-else
            class="empty"
        >
            No materials
        </div>
    </div>
</template>
<script setup lang="ts">

import { computed } from 'vue';
import projectStore, { getCurrentProject } from '~/stores/project';

const project = projectStore();
const route = useRoute();
const name: string = route.params.name as unknown as string;

const material = computed<Material>(() => {
    const projectMaterial = project.materials.value.find((item) => item.name === name) as Material;

    return projectMaterial;
});

const currentProject = computed(() => {
    return getCurrentProject();
});

</script>
<style scoped>

</style>
