<template>
    <div class="card-settings">
        <label>
            Number of faces:
            <input type="number" v-model="material!.faces" min="2" >
        </label>
    </div>
</template>
<script setup lang="ts">

const material: Ref<MaterialDice> = defineModel<MaterialDice>() as any;

if (!material.value?.faces) {
    material.value!.faces = getDefaultDiceFaces();
}

watch(material, () => {
    const faces = material.value.faces;

    if (typeof faces !== 'number') {
        material.value.faces = +faces || getDefaultDiceFaces();
    }
}, { deep: true });
</script>
<style scoped>

</style>
