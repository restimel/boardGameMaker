<template>
    <div class="card-editor">
        <section class="item-design">
            {{ back ? 'Back' : 'Front' }}
            <CardPreview
                class="card"
                :material="material"
                :back="back"
                :rectangle="rectangle"
                :content="material.contents[0]"
                :context="context"

                @rectangle="updateRectangle"
                @rectangle-end="endRectangle"
            />
        </section>
        <aside class="layers">
            <button
                :class="{
                    'default-button': true,
                    active: creatingLayer,
                }"
                @click="addLayer"
            >
                Create layer
            </button>
            <div v-for="(layer, index) in details"
                :keys="`layer-${layer.id}`"
                class="layer"
            >
                <header
                    :class="{
                        'layer-header': true,
                        'active-layer': layerActive === layer.id,
                    }"
                    @click="layerActive = layerActive === layer.id ? '' : layer.id"
                >
                    {{ layer.name }}
                </header>
                <section v-if="layer.id === layerActive"
                    class="layer-details"
                >
                    <div class="layer-info">
                        <label>
                            Name:
                            <input type="text" v-model="layer.name">
                        </label>
                        <span class="actions">
                            <button
                                title="Duplicate this layer"
                                @click="duplicate(index)"
                            >
                                📄
                            </button>
                            <button
                                :disabled="index === 0"
                                @click="moveBack(index)"
                            >
                                ↑
                            </button>
                            <button
                                :disabled="index >= details.length - 1"
                                @click="moveFront(index)"
                            >
                                ↓
                            </button>
                            <button
                                @click="remove(index)"
                            >
                                ✕
                            </button>
                        </span>
                    </div>
                    <InputColor
                        label="Background color"
                        :context="context"
                        v-model="layer.bgColor"
                    />
                    <InputTuple label="Position" v-model="layer.position" separator="," :precision="2" />
                    <InputTuple label="Dimension" v-model="layer.dimension" separator="×" :precision="2" />
                    <label>
                        Rotation:
                        <InputRange
                            v-model="layer.rotation"
                            :min="0"
                            :max="360"
                            :step="1"
                            unit="degree"
                        />
                    </label>
                    <InputReference label="Content" :materials="material" v-model="layer.content" />
                </section>
            </div>
        </aside>
    </div>
</template>
<script setup lang="ts">

type Props = {
    back?: boolean;
    project: Project;
};

const props = defineProps<Props>();
const material: Ref<MaterialCard> = defineModel<MaterialCard>() as any;

const layerActive = ref<string>('');
const rectangle = ref<RotationRectangle | boolean>(false);

const details = computed<MetaMaterial[]>(() => {
    if (props.back) {
        return material.value.back;
    }

    return material.value.front;
});

const layer = computed(() => {
    const active = layerActive.value;

    if (!active) {
        return undefined;
    }

    return details.value.find((layer) => {
        return layer.id === active;
    });
});

const creatingLayer = computed<boolean>(() => {
    return rectangle.value === true;
});

const context = computed<MaterialContext>(() => {
    const project = props.project;
    const materialValue = material.value;

    return createContext(project, materialValue, undefined);
});

watch(layer, () => {
    const activeLayer = layer.value;

    if (!activeLayer) {
        if (typeof rectangle.value !== 'boolean') {
            rectangle.value = false;
        }

        return;
    }

    const [x, y] = activeLayer.position;
    const [w, h] = activeLayer.dimension;
    const r = activeLayer.rotation;

    rectangle.value = [x, y, w, h, r];
}, { deep: true });

function addLayer() {
    rectangle.value = true;
}

function updateRectangle(rect: RotationRectangle) {
    const [x, y, w, h, r] = rect;

    if (creatingLayer.value) {
        return;
    }

    const layerValue = layer.value!;
    layerValue.position = [x, y];
    layerValue.dimension = [w, h];
    layerValue.rotation = r;
}

function endRectangle(rect: RotationRectangle) {
    if (creatingLayer.value) {
        const [x, y, w, h, r] = rect;
        const id = 'new layer ' + details.value.length;

        const layerDetail: MetaMaterial = {
            type: 'Box',
            id: id,
            name: id,
            position: [x, y],
            dimension: [w, h],
            rotation: r,
            content: {
                type: 'StaticText',
                value: '',
                size: getDefaultTextSize(rect.slice(0, 4) as Rectangle),
                alignment: 'center',
                color: getDefaultMaterialTextColor(),
            },

            color: '#FF0000', // to remove
            bgColor: '#eeeeee',
        };
        details.value.push(layerDetail);

        layerActive.value = id;
        rectangle.value = rect;
    }
}

function duplicate(index: number) {
    const list = details.value;

    const copyItem = copyValue(list[index]);
    copyItem.name = `${copyItem.name} (copy)`;
    copyItem.id = `copy of ${copyItem.id}`;

    while (list.some((item) => item.id === copyItem.id)) {
        copyItem.id = `${copyItem.id}_`;
    }

    list.splice(index + 1, 0, copyItem);
    layerActive.value = copyItem.id;
}

function moveFront(index: number) {
    const list = details.value;

    const item = list.splice(index, 1)[0];

    list.splice(index + 1, 0, item);
}

function moveBack(index: number) {
    const list = details.value;

    const item = list.splice(index, 1)[0];

    list.splice(index - 1, 0, item);
}

function remove(index: number) {
    const list = details.value;

    list.splice(index, 1);
}

</script>
<style scoped>
.card-editor {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 10px;
}

.card {
    border: 1px solid var(--table-border);
}

.layers {
    width: 370px;
}

.item-design, .layers, .layer, .layer-details {
    display: flex;
    flex-direction: column;
    text-align: start;
}

.item-design {
    text-align: center;
}

.layers {
    min-width: 250px;
}

.layer:first-child {
    margin-top: 1em;
}

.layer-header {
    padding: 5px;
    border-top: 1px solid var(--table-border);
    cursor: pointer;
    background-color: var(--table-header-bg);
}

.layer-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.active-layer {
    color: var(--active-color);
}

.active {
    background: var(--active-bg);
    color: var(--active-color);
}

.sizeValue {
    max-width: 4em;
}

.text-alignment button {
    display: inline-block;
}
</style>
