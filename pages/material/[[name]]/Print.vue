<template>
    <div v-if="material"
        class="print-material"
    >
        <Preview v-for="(item, index) in contents"
            :key="`material-${name}-${index}`"
            :material="material"
            :content="item.content"
            :context="item.context"
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

type Content = {
    content: MaterialContent;
    context: MaterialContext;
};

definePageMeta({
    layout: 'print',
});

const route = useRoute();
const name: string = route.params.name as unknown as string;

const material = computed<Material>(() => {
    const projectMaterial = activeProject.value.materials.find((item) => item.name === name) as Material;

    return projectMaterial;
});

const contents = computed<Content[]>(() => {
    const materialValue = material.value;
    const contents = materialValue.contents;
    const contexts = createAllContext(activeProject.value, materialValue);

    return contexts.flatMap((context) => {
        return contents.map((content) => {
            return {
                content: content,
                context: {
                    ...context,
                    content,
                },
            };
        });
    });
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
