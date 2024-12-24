<template>
    <div v-if="materials"
        class="print-material"
    >
        <Preview v-for="(item, index) in contents"
            :key="`material-${index}`"
            :material="item.context.material!"
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

import Preview from '~/components/Preview.vue';

type Content = {
    content: MaterialContent;
    context: MaterialContext;
};

definePageMeta({
    layout: 'print',
});

const materials = computed<Material[]>(() => {
    const materialList = printSettings.value;

    const projectMaterial = activeProject.value.materials.filter((item) => {
        const option = materialList.get(item.name);

        if (!option) {
            return false;
        }

        return option !== 'no';
    });

    return projectMaterial;
});

const contents = computed<Content[]>(() => {
    return materials.value.flatMap((materialValue) => {
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
