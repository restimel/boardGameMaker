<template>
    <div class="card-settings">
        <label>
            Number of faces:
            <input type="number" v-model="material.faces" min="2" >
        </label>
        <InputColor
            label="Dice color"
            :context="context"
            v-model="material.diceColor"
        />
    </div>
</template>
<script setup lang="ts">

const material: Ref<MaterialDice> = defineModel<MaterialDice>() as any;

const context = computed<MaterialContext>(() => {
    const project = activeProject.value;
    const materialValue = material.value;

    return createContext(project, materialValue, undefined);
});

function initialization() {
    const item = material.value;

    if (!item.faces) {
        material.value.faces = getDefaultDiceFaces();
    }

    if (!item.diceColor) {
        material.value.diceColor = getDefaultMaterialColor();
    }
}
initialization();

watch(material, () => {
    const faces = material.value.faces;

    if (typeof faces !== 'number') {
        material.value.faces = +faces || getDefaultDiceFaces();
    }
}, { deep: true });
</script>
<style scoped>

</style>
