<template>
    <section>
        <h1>
            Print
        </h1>

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
                        Options
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="material of activeProject.materials"
                    :key="`material-${material.name}`"
                >
                    <td>
                        {{ material.name }}
                    </td>
                    <td>
                        {{ material.type }}
                    </td>
                    <td>
                        <span title="number of described items">
                            {{ material.contents.length }}
                        </span>
                        <span
                            title="The real number of item to print"
                        >
                            ({{ numberMaterial(material) }})
                        </span>
                    </td>
                    <td class="cell-actions">
                        <select
                            :value="printSettings.get(material.name)"
                            @change="changeValue(material.name, $event)"
                        >
                            <option v-for="item of choices(material)"
                                :key="`item-${material.id}-${item.id}`"
                                :value="item.id"
                            >
                                {{  item.text }}
                            </option>
                        </select>

                        <span v-if="![undefined, 'no'].includes(printSettings.get(material.name))">
                            🖨️
                        </span>
                        <span v-else>
                            🚫
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <aside class="action-button">
            <button
                class="main-button"
                @click="printMaterials"
            >
                Print
            </button>
        </aside>
    </section>
</template>
<script setup lang="ts">
// import '../types/Definitions';
// import '../types/Project';
// import '../types/Settings';
import {activeProject} from '../composables/ActiveProjectStore';
import {printSettings} from '../composables/PrintStore';
import {numberMaterial} from '../utils/Formats';

function choices(material: Material): Item<PrintMode>[] {
    const actions: Item<PrintMode>[] = [
        {
            id: 'yes',
            text: 'Print it',
        },
        {
            id: 'no',
            text: 'Do not print it',
        },
    ];

    if (material.type === 'Cards') {
        actions.push({
            id: 'front',
            text: 'Front face only',
        });

        actions.push({
            id: 'back',
            text: 'Back face only',
        });
    }

    return actions;
}

function changeValue(materialName: string, event: InputEvent) {
    const target = event.currentTarget as HTMLSelectElement;
    const value = target.value;

    printSettings.value.set(materialName, value);
}

function printMaterials() {
    navigateTo('/print', {
        /* we need to propagate the store */
        external: false,
    });
}

</script>

<style scoped>
.action-button {
    text-align: center;
}
</style>
