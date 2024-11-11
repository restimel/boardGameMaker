<template>
    <div v-if="props.material.type === 'Cards'"
        class="card-preview"
    >
        <InputRadio v-if="!props.readonly"
            :values="[{
                label: 'Front',
                value: 'front',
            }, {
                label: 'Back',
                value: 'back',
            }]"
            v-model="side"
        />
        <CardPreview
            class="preview-material"
            :material="props.material"
            :content="props.content"
            :back="side === 'back'"
        />
    </div>
</template>
<script setup lang="ts">
type Props = {
    material: Material;
    content: MaterialContent | null;
    readonly?: boolean;
};

const props = defineProps<Props>();
const side = ref<'front' | 'back'>('front');

</script>
<style scoped>

.card-preview {
    display: flex;
    flex-direction: column;
}

.preview-material {
    box-shadow: 0 0 3px var(--text-color);
}
</style>
