<template>
    <div>
        <h1>
            <NuxtLink to="/materials">
                Materials
            </NuxtLink>
        </h1>

        <h2>{{ pageTitle }}</h2>
        <header v-if="willCreate">
            <button v-if="willCreate"
                :class="{
                    'main-button': true,
                    enabled: canCreate,
                }"
                :disabled="!canCreate"
                @click="save"
            >
                Create a new material
            </button>
        </header>

        <div class="form">
            <label>
                Title:
                <input v-model="material.name" >
            </label>
            <label>
                Type:
                <select
                    v-model="material.type"
                >
                    <option value="Cards">Cards</option>
                    <option value="Dice">Dice</option>
                </select>
            </label>

            <h4>Attributes</h4>
            <table class="table-list attributes">
                <thead>
                    <tr>
                        <th class="index"></th>
                        <th>
                            Name
                        </th>
                        <th>
                            Type
                        </th>
                        <th>
                            Default value
                        </th>
                        <th class="cell-actions">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="[key, attribute] of Object.entries(attributeList)"
                        :key="`attribute-${key}`"
                    >
                        <td class="index">
                            {{ +key + 1 }}
                        </td>
                        <td>
                            <input
                                :key="`attribute-name-${key}`"
                                :ref="`attribute-name-${key}`"
                                type="text"
                                v-model="attribute.name" placeholder="attribute name"
                            >
                        </td>
                        <td>
                            <InputTypeSelector
                                v-model="attribute.type"
                                withEnumeration
                            />
                        </td>
                        <td>
                            <input type="text" v-model="attribute.defaultValue" placeholder="">
                        </td>
                        <td class="cell-actions">
                            <button @click="removeAttribute(key)">
                                ✕
                            </button>
                        </td>
                    </tr>
                    <tr
                        :key="`attribute-${attributeList.length}`"
                    >
                        <td class="index">
                            +
                        </td>
                        <td>
                            <input
                                :key="`attribute-name-${attributeList.length}`"
                                type="text"
                                placeholder="new attribute"
                                @change="addAttribute(($event.currentTarget as HTMLInputElement).value)"
                            >
                        </td>
                        <td>
                            <InputTypeSelector disabled />
                        </td>
                        <td>
                        </td>
                        <td class="cell-actions">
                        </td>
                    </tr>
                    <tr v-if="attributeError">
                        <td
                            colspan="4"
                            class="error-message"
                        >
                            {{  attributeError }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <h4>Properties</h4>

            <CardSettings v-if="material.type === 'Cards'"
                v-model="material"
            />
            <DiceSettings v-else-if="material.type === 'Dice'"
                v-model="material"
            />

            <h4>Design</h4>

            <CardsEditor v-if="material.type === 'Cards'"
                v-model="material"
            />
            <DiceEditor v-else-if="material.type === 'Dice'"
                v-model="material"
            />

            <h4>Content</h4>
            <ContentList
                :material="material"
                :project="activeProject"
                v-model="material.contents"
            />
        </div>

        <footer v-if="willCreate">
            <button v-if="willCreate"
                :class="{
                    'main-button': true,
                    enabled: canCreate,
                }"
                :disabled="!canCreate"
                @click="save"
            >
                Create a new material
            </button>
        </footer>
    </div>
</template>
<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import CardSettings from '~/components/CardSettings.vue';
import DiceSettings from '~/components/DiceSettings.vue';

const DEBOUNCE_ATTRIBUTE = 1000;

const route = useRoute();
const name: string = route.params.name as unknown as string;

const defaultAttribute: MaterialDescription = {
    name: '',
    type: 'text',
    defaultValue: '',
};
const defaultMaterial: Material = {
    name: '',
    type: 'Cards',
    description: {},
    contents: [],
    dimension: getDefaultCardDimension(),
    backgroundColor: getDefaultMaterialColor(),
    front: [],
    back: [],
};

const materialIdx = ref<number>(-1);
const material = ref<Material>(defaultMaterial);
const attributeList = ref<MaterialDescription[]>([]);
const attributeError = ref<string>('');


const isNew = computed(() => {
    return !name;
});

const willCreate = computed(() => {
    return materialIdx.value === -1;
});

const pageTitle = computed<string>(() => {
    if (willCreate.value) {
        return 'Create a new material';
    }

    return name;
});

const canCreate = computed<boolean>(() => {
    return !!material.value.name;
});

watch(material, () => {
    if (willCreate.value) {
        return;
    }

    const idx = materialIdx.value;

    activeProject.value.materials[idx] = material.value;
}, { deep: true });

watch(attributeList, () => {
    updateAttributes();
}, { deep: true });


async function removeAttribute(key: number | string) {
    const itemIdx = +key;
    const result = await confirmDialog(`Are you sure to remove the **attribute** "${attributeList.value[itemIdx]?.name}"?`);

    if (result) {
        confirmRemove(itemIdx);
    }
}

function confirmRemove(idx: number) {
    const list = attributeList.value;

    list.splice(idx, 1);
    attributeList.value = list;
}

function addAttribute(attributeName: string) {
    const attributes = attributeList.value;

    if (attributes.some((attribute) => attribute.name === attributeName)) {
        attributeError.value = `Attribute "${attributeName}" already exists`;
        return;
    }

    const attribute: MaterialDescription = {
        ...defaultAttribute,
        name: attributeName,
    };
    attributeList.value.push(attribute);
}

let timerUpdateAttributes = 0;
function updateAttributes() {
    clearTimeout(timerUpdateAttributes);

    const attributes = attributeList.value;
    timerUpdateAttributes = window.setTimeout(() => {
        const description: Record<string, MaterialDescription> = {};

        timerUpdateAttributes = 0;
        for (const attribute of attributes) {
            if (attribute.name in description) {
                attributeError.value = `Duplicate attribute name (${attribute.name})`;
                return;
            }
            description[attribute.name] = attribute;
        }

        material.value.description = description;
        attributeError.value = '';
    }, DEBOUNCE_ATTRIBUTE);
}

function save() {
    activeProject.value.materials.push(material.value);

    navigateTo(`/materials`);
}

onMounted(() => {
    if (isNew.value) {
        return;
    }

    materialIdx.value = activeProject.value.materials.findIndex((item) => item.name === name);

    if (!willCreate.value) {
        const idx = materialIdx.value;
        const materialItem = activeProject.value.materials[idx];

        material.value = {
            ...materialItem,
        };
        attributeList.value = Array.from(Object.values(materialItem.description)).filter((attribute) => attribute.name);
    }
});

</script>
<style scoped>

h2 {
    text-align: center;
}

header {
    text-align: center;
    margin-top: 1em;
    margin-bottom: 1em;
}

footer {
    text-align: center;
    margin-top: 2em;
    padding: 1em;
    border-top: 1px solid var(--table-border);
}

.index {
    width: 1.5em;
    text-align: center;
}

.cell-actions {
    width: 1.5em;
}

</style>
