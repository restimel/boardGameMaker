<template>
    <div class="card-settings">
        <label>
            Dimension:
            <input type="number" v-model="material.dimension[0]" >
            <span class="unit">mm</span>
            ×
            <input type="number" v-model="material.dimension[1]" >
            <span class="unit">mm</span>

            <label class="preformatted-card">
                Format of
                <select
                    :value="formatSize"
                    @change="setFormat($event.currentTarget!.value)"
                >
                    <option value=""></option>
                    <option v-for="[formatName, format] of formatStandards"
                        :key="`card-format-${formatName}`"
                        :value="formatName"
                    >
                        {{ format.name }}
                    </option>
                </select>
                <span class="format-usage">
                    {{ formatStandards.get(formatSize)?.usage ?? '' }}
                </span>
            </label>
        </label>
        <InputColor
            label="Background color"
            :context="context"
            v-model="material.backgroundColor"
        />
    </div>
</template>
<script setup lang="ts">

const material: Ref<MaterialCard> = defineModel<MaterialCard>() as any;

const context = computed<MaterialContext>(() => {
    const project = activeProject.value;
    const materialValue = material.value;

    return createContext(project, materialValue, undefined);
});

function initialization() {
    const item = material.value;

    if (!item.dimension) {
        material.value.dimension = getDefaultCardDimension();
    }
    if (!item.backgroundColor) {
        material.value.backgroundColor = getDefaultMaterialColor();
    }
    if (!item.front) {
        material.value.front = [];
    }
    if (!item.back) {
        material.value.back = [];
    }
}
initialization();

const formatStandards = cardStandardFormats;

const formatSize = computed<string>(() => {
    const materialValue = material.value!;
    const width = Math.round(materialValue.dimension[0]);
    const height = Math.round(materialValue.dimension[1]);

    for (const [name, format] of formatStandards) {
        const fWidth = Math.round(format.dimensions[0]);
        const fHeight = Math.round(format.dimensions[1]);

        if (fWidth === width && fHeight === height) {
            return name;
        }
    }

    return '';
});

function setFormat(format: string) {
    const standard = formatStandards.get(format);

    if (!standard) {
        return;
    }

    const [width, height] = standard.dimensions;
    material.value.dimension[0] = +width;
    material.value.dimension[1] = +height;
}

watch(material.value.dimension, () => {
    const dimension = material.value.dimension;

    if (typeof dimension[0] !== 'number') {
        material.value.dimension[0] = +dimension[0] || 0;
    }
    if (typeof dimension[1] !== 'number') {
        material.value.dimension[1] = +dimension[1] || 0;
    }
}, { deep: true });
</script>
<style scoped>

.format-usage {
    font-size: 0.7em;
    font-style: italic;
    margin-inline-start: 1em;
}

.preformatted-card {
    display: inline;
    margin-inline-start: 5em;
}

</style>
