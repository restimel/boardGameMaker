<template>
    <div>
        <h1>Alias & Enumeration</h1>
        <h2>Alias</h2>

        <p class="explanation">
            Alias are used to display symbols in text. For example, in any text, you can type <code>:(1):</code> and it will be displayed <code>①</code>.
        </p>

        <table class="table-list alias">
            <thead>
                <tr>
                    <th>
                        Alias
                    </th>
                    <th>
                        Value
                    </th>
                    <th>
                        Result
                    </th>
                    <th class="cell-actions">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="alias of aliasList"
                    :key="`alias-list-row-${alias.id}`"
                >
                    <td>
                        <input
                            type="text"
                            v-model="alias.alias"
                        />
                    </td>
                    <td class="alias-value">
                        <InputToggle
                            :value="isImage.has(alias.id)"
                            leftLabel="character"
                            rightLabel="image"
                            @change="isImage.has(alias.id) ? isImage.delete(alias.id) : isImage.add(alias.id)"
                        />
                        <InputImage v-if="isImage.has(alias.id)"
                            class="inline-text"
                            v-model="alias.image"
                            label=""
                            @change="alias.value = ''"
                        />
                        <label v-else>
                            <input
                                type="text"
                                v-model="alias.value"
                                @change="alias.image = ''"
                            />
                        </label>
                    </td>
                    <td class="example">
                        <Text :value="`\\:${alias.alias}\\: → :${alias.alias}:`" />
                    </td>
                    <td class="cell-actions">
                        <button @click="removeItem(alias.id)">
                            ✕
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input
                            type="text"
                            v-model="newAlias"
                            @change="addAlias()"
                        />
                    </td>
                    <td>
                        <InputToggle
                            :value="false"
                            disabled
                            leftLabel="character"
                            rightLabel="image"
                        />
                        <input
                            type="text"
                            disabled
                        />
                    </td>
                    <td>
                    </td>
                    <td class="cell-actions">
                    </td>
                </tr>
                <tr v-if="attributeError">
                    <td
                        :colspan="4"
                        class="error-message"
                    >
                        {{  attributeError }}
                    </td>
                </tr>
            </tbody>
        </table>

        <h2 name="Enumeration">Enumeration</h2>

        <p class="explanation">
            Enumeration are used to display symbols in text or values in reference depending on a reference value.<br>
            The <code>Key</code> is the value used to display the <code>Value</code>.
        </p>

        <table class="table-list enumerations">
            <thead>
                <tr>
                    <th>
                        Enumeration
                    </th>
                    <th>
                        Type
                    </th>
                    <th>
                        Values
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
                <tr v-for="enumeration of enumerationList"
                    :key="`enumeration-list-row-${enumeration.id}`"
                >
                    <td>
                        <input
                            type="text"
                            v-model="enumeration.name"
                        />
                    </td>
                    <td>
                        <InputTypeSelector
                            v-model="enumeration.type"
                        />
                    </td>
                    <td>
                        {{ enumeration.values.length }}
                    </td>
                    <td>
                        <input
                            type="text"
                            v-model="enumeration.defaultValue"
                        />
                    </td>
                    <td class="cell-actions">
                        <button @click="updateEnum(enumeration.id)">
                            ✎
                        </button>
                        <button @click="removeItem(enumeration.id)">
                            ✕
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input
                            type="text"
                            v-model="newEnumeration"
                            @change="addEnumeration()"
                        />
                    </td>
                    <td>
                        <InputTypeSelector
                            disabled
                        />
                    </td>
                    <td>
                        0
                    </td>
                    <td>
                        <input
                            type="text"
                            disabled
                        />
                    </td>
                    <td class="cell-actions">
                    </td>
                </tr>
            </tbody>
        </table>

        <dialog :open="enumToUpdate !== null"
            class="update-enumeration dialog"
        >
            <template
                v-if="enumToUpdate"
            >
                <h1>
                    {{ enumToUpdate.name }}
                </h1>
                <EnumerationEdit
                    :values="enumToUpdate.values"
                    :description="enumToUpdate as MaterialDescription"
                />
                <button
                    class="default-button"
                    @click="updateEnumId = ''"
                >
                    Close
                </button>
            </template>
        </dialog>
    </div>
</template>
<script setup lang="ts">

const attributeError = ref<string>('');
const newAlias = ref<string>('');
const newEnumeration = ref<string>('');
const toRemove = ref<string>('');
const isImage = ref<Set<string>>(new Set());
const updateEnumId = ref<string>('');

const aliasList = computed<Alias[]>(() => {
    const keys = Object.values(activeProject.value.alias);

    return keys;
});

const enumerationList = computed<Enumeration[]>(() => {
    return activeProject.value.enumerations;
});

const toRemoveType = computed<'alias' | 'enumeration' | ''>(() => {
    const id = toRemove.value;

    if (id.startsWith('alias-')) {
        return 'alias';
    } else
    if (id.startsWith('enum-')) {
        return 'enumeration';
    }

    return '';
});

const toRemoveName = computed<string>(() => {
    const id = toRemove.value;

    switch (toRemoveType.value) {
        case 'alias':
            return activeProject.value.alias[id]?.alias ?? '';
        case 'enumeration':
            return activeProject.value.enumerations.find((enumeration) => enumeration.id === id)?.name ?? '';
        case '':
            return '';
    }
});

const toRemoveText = computed<string>(() => {
    return `Are you sure to remove the ${toRemoveType.value} "${toRemoveName.value}"?`;
});

const enumToUpdate = computed<Enumeration | null>(() => {
    const id = updateEnumId.value;

    if (!id) {
        return null;
    }

    const enumeration = getEnum(enumerationList.value, id, 'id');

    return enumeration;
});

watch(aliasList, () => {
    const isImages = isImage.value;

    isImages.clear();

    aliasList.value.forEach((alias) => {
        if (alias.image) {
            isImages.add(alias.id);
        }
    });
}, { immediate: true });

function addAlias() {
    const id = getUid('alias-');
    const alias: Alias = {
        id: id,
        alias: newAlias.value,
        value: '',
        image: '',
    };

    activeProject.value.alias[id] = alias;

    newAlias.value = '';
}

function cancelRemove() {
    toRemove.value = '';
}

function confirmRemove() {
    const id = toRemove.value;

    if (id.startsWith('alias-')) {
        delete activeProject.value.alias[id];
    } else
    if (id.startsWith('enum-')) {
        const index = activeProject.value.enumerations.findIndex((enumeration) => enumeration.id === id);

        if (index > -1) {
            activeProject.value.enumerations.splice(index, 1);
        }
    }

    toRemove.value = '';
}

function addEnumeration() {
    const id = getUid('enum-');
    const enumeration: Enumeration = {
        id: id,
        name: newEnumeration.value,
        values: [],
        type: 'text',
        defaultValue: '',
    };

    activeProject.value.enumerations.push(enumeration);

    newEnumeration.value = '';
}

function updateEnum(enumId: string) {
    updateEnumId.value = enumId;
}

async function removeItem(itemId: string) {
    toRemove.value = itemId;
    const result = await confirmDialog(toRemoveText.value);

    if (result) {
        confirmRemove();
    } else {
        cancelRemove();
    }
}

</script>

<style scoped>

</style>
<style>
.example p {
    margin: 0;
}
</style>
