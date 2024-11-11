<template>
    <div class="contents-area">
        <div class="contents">
            <table class="table-list content-list">
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
        </div>
        <div class="preview">
            <Preview
                :material="material"
                :content="activeContent"
            />
        </div>
    </div>
    <div class="importExport">
        <ImportFile
            file-type="CSV"
            :export-options="exportOptions"
            @import="importFile"
        />
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

const exportOptions = computed(() => {
    const data = contents.value;
    const name = props.material.name;

    return {
        name: `${name}.csv`,
        content: data,
    };
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
    const item = +key;

    confirmDialog(`Are you sure to remove the item "**${ item }**"?`).then((confirm) => {
        if (confirm) {
            confirmRemove(item);
        }
    });
}

function confirmRemove(idx: number) {
    const list = contentsModel.value ?? [];

    list.splice(idx, 1);
    contentsModel.value = list;
}

function checkRows(rows: MaterialContent[]): boolean {
    const propertyList = new Set(properties.value);

    return rows.every((row) => {
        return Object.keys(row).every((key) => {
            return propertyList.has(key);
        });
    });
}

function importFile(rows: MaterialContent[]) {
    if (!checkRows(rows)) {
        attributeError.value = 'File is not compatible';
    }

    contentsModel.value = rows;
}

</script>
<style scoped>
.contents-area {
    display: grid;
    grid-template-columns: 1fr max-content;
    grid-template-rows: max-content max-content;
    grid-template-areas: "contents preview" "import";
    gap: 5px;
}

.contents {
    max-width: 100%;
    max-height: 75vh;
    overflow: auto;
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

.preview {
    align-self: center;
}

.importExport {
    margin-top: 1em;
    text-align: center;
}

</style>
