<template>
    <h1>{{ project.title }}</h1>
    <table class="table-list enumeration-keys">
        <thead>
            <tr>
                <th>
                    Version
                </th>
                <th class="cell-actions">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="[version, pVersion] in Object.entries(project.versions)"
                :key="`version-list-${pVersion}`"
                :class="{
                    'active-row': isActiveProject && activeVersion === version,
                }"
            >
                <td>
                    {{ `${version}.${pVersion.buildVersion}` }}
                </td>
                <td class="cell-actions">
                    <button @click="setActiveProjectVersion(project.id, version)">
                        ▶️
                    </button>
                    <button @click="removeItem(version)">
                        ✕
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script setup lang="ts">

import {
    setActiveProjectVersion,
} from '../stores/project';

type Props = {
    project: GameProject;
    isActiveProject: boolean;
    activeVersion: string;
};

const props = defineProps<Props>();

function removeItem(version: string) {
    confirmDialog(`Are you sure to remove the **version** "${version}" and all its content?`).then((confirm) => {
        if (confirm) {
            confirmRemove(version);
        }
    });
}

function confirmRemove(version: string) {
    delete props.project.versions[version];
}

</script>
<style scoped>

.active-row {
    box-shadow: inset 0 0 5px 0 var(--active-color);
}

</style>
