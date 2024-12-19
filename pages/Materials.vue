<template>
    <div>
        <h1>Materials</h1>

        <table class="table-list materials">
            <thead>
                <tr>
                    <th>
                        Name
                    </th>
                    <th>
                        Type
                    </th>
                    <th>
                        Nb items
                    </th>
                    <th>
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="material of activeProject.materials"
                    :key="`material-${material.name}`"
                    @click="navigateTo(`material/${material.name}/contents`)"
                >
                    <td>
                        {{ material.name }}
                    </td>
                    <td>
                        {{ material.type }}
                    </td>
                    <td>
                        {{ material.contents.length }}
                    </td>
                    <td class="cell-actions">
                        <button @click.stop="navigateTo(`/material/${material.name}/configuration`)">
                            ✎
                        </button>
                        <button @click.stop="removeItem(material.name)">
                            ✕
                        </button>
                    </td>
                </tr>
                <tr v-if="activeProject.materials.length === 0"

                >
                    <td
                        colspan="4"
                        class="row-empty-table"
                    >
                        There are currently no materials. Add a new one to start.
                    </td>
                </tr>
            </tbody>
        </table>
        <footer class="actions">
            <button class="main-button" @click="addItem">
                + Add a material
            </button>
        </footer>
    </div>
</template>
<script setup lang="ts">

function addItem() {
    navigateTo('/material/configuration');
}

async function removeItem(name: string) {
    const result = await confirmDialog(`Are you sure to remove the **material** "${name}"?`);

    if (result) {
        confirmRemove(name);
    }
}

function confirmRemove(value: string) {
    const materials = activeProject.value.materials;
    const index = materials.findIndex((item) => item.name === value);
    materials.splice(index, 1);

    activeProject.value.materials = materials;
}

</script>
<style scoped>
.actions {
    margin-top: 1em;
    width: 100%;
    text-align: center;
}
</style>
