<template>
    <table class="table-list enumeration-keys">
        <thead>
            <tr>
                <th>
                    Key
                </th>
                <th>
                    Value
                </th>
                <th class="cell-actions">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="enumItem of values"
                :key="`enum-item-${enumItem.id}`"
            >
                <td>
                    <input
                        type="text"
                        v-model="enumItem.key"
                    />
                </td>
                <td>
                    <InputContent
                        :description="description"
                        v-model="enumItem.value"
                    />
                </td>
                <td class="cell-actions">
                    <button @click="removeItem(enumItem.id)">
                        ✕
                    </button>
                </td>
            </tr>
            <tr>
                <td>
                    <input
                        type="text"
                        v-model="newItemKey"
                        @change="addItem"
                    />
                </td>
                <td>
                    <input
                        type="text"
                        :value="description.defaultValue"
                        disabled
                    />
                </td>
                <td class="cell-actions">
                </td>
            </tr>
        </tbody>
    </table>
    <dialog :open="toRemove !== ''">
        {{ toRemoveText }}
        <br>
        <button @click="cancelRemove" class="default-button">
            Cancel
        </button>
        <button @click="confirmRemove" class="main-button">
            Confirm
        </button>
    </dialog>
</template>
<script setup lang="ts">
type Props = {
    values: KeyValue[];
    description: MaterialDescription;
};

const props = defineProps<Props>();

const newItemKey = ref<string>('');
const toRemove = ref<string>('');

const toRemoveText = computed<string>(() => {
    const item = props.values.find((value) => value.id === toRemove.value);

    if (!item) {
        return '';
    }

    return `Are you sure to remove the enumeration value "${item.key} → ${item.value}"?`
});

function removeItem(id: string) {
    toRemove.value = id;
}

function addItem() {
    const item: KeyValue = {
        id: getUid('enumItem-'),
        key: newItemKey.value,
        value: '',
    };

    props.values.push(item);

    newItemKey.value = '';
}

function cancelRemove() {
    toRemove.value = '';
}

function confirmRemove() {
    const index = props.values.findIndex((value) => value.id === toRemove.value);

    props.values.splice(index, 1);
    toRemove.value = '';
}

</script>
<style scoped>

</style>
