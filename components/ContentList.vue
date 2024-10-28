<template>
    <div class="contents-area">
        <table class="table-list attributes">
            <thead>
                <tr>
                    <th class="index"></th>
                    <th v-for="propertyName of properties"
                        :key="`content-list-header-${propertyName}`"
                    >
                        {{ propertyName }}
                    </th>
                    <th class="cell-actions">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(content, index) in contents"
                    :key="`content-list-row-${index}`"
                    :class="{
                        'active-row': content === activeContent,
                    }"
                    @click="activeContent = content"
                >
                    <td class="index">
                        {{ +index + 1 }}
                    </td>
                    <td v-for="propertyName of properties"
                        :key="`content-list-cell-${index}-${propertyName}`"
                    >
                        <InputContent
                            :description="material.description[propertyName]"
                            v-model="content[propertyName]"
                            :material="material"
                            :content="content"
                        />
                    </td>
                    <td class="cell-actions">
                        <button @click="removeContent(index)">
                            ✕
                        </button>
                    </td>
                </tr>
                <tr
                    :key="`content-list-row-${contents.length}`"
                >
                    <td class="index">
                        +
                    </td>
                    <td v-for="propertyName of properties"
                        :key="`content-list-cell-${contents.length}-${propertyName}`"
                    >
                        <InputContent
                            :description="material.description[propertyName]"
                            @change="addContent(propertyName, $event)"
                            :material="material"
                            :content="null"
                        />
                    </td>
                    <td class="cell-actions">
                    </td>
                </tr>
                <tr v-if="attributeError">
                    <td
                        :colspan="2 + properties.length"
                        class="error-message"
                    >
                        {{  attributeError }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="preview">
            <Preview
                :material="material"
                :content="activeContent"
            />

            <dialog :open="itemIdx >= 0">
                Are you sure to remove the item "{{ itemIdx }}"?
                <button @click="cancelRemove" class="default-button">
                    Cancel
                </button>
                <button @click="confirmRemove" class="main-button">
                    Confirm
                </button>
            </dialog>
        </div>
    </div>
</template>
<script setup lang="ts">
type Props = {
    material: Material;
};

const props = defineProps<Props>();
const contentsModel = defineModel<MaterialContent[]>();

const attributeError = ref<string>('');
const activeContent = ref<MaterialContent | null>(null);
const itemIdx = ref<number>(-1);

const contents = computed<MaterialContent[]>(() => {
    const list = contentsModel.value;

    if (!list) {
        return [];
    }

    return list;
});

const properties = computed<string[]>(() => {
    const description = props.material.description;

    return Array.from(Object.keys(description));
});

function addContent(propertyName: string, value: ContentValue) {
    if (value === '' || value === undefined) {
        return;
    }

    const content: MaterialContent = {
        [propertyName]: value,
    };

    contentsModel.value?.push(content);
    activeContent.value = content;
}

function removeContent(key: number | string) {
    itemIdx.value = +key;
}

function confirmRemove() {
    const list = contentsModel.value ?? [];
    const idx = itemIdx.value;

    list.splice(idx, 1);
    contentsModel.value = list;
    itemIdx.value = -1;
}
function cancelRemove() {
    itemIdx.value = -1;
}

</script>
<style scoped>
.contents-area {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: 5px;
}

.index {
    width: 1.5em;
    text-align: center;
}

.cell-actions {
    width: 1.5em;
}

.active-row {
    box-shadow: inset 0 0 10px 0 var(--active-color);
}

</style>
