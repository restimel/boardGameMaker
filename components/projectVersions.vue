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

import {
    setActiveProjectVersion,
} from '../stores/project';

type Props = {
    project: GameProject;
    isActiveProject: boolean;
    activeVersion: string;
};

const props = defineProps<Props>();

const toRemove = ref<string>('');

const toRemoveText = computed<string>(() => {
    return `Are you sure to remove the version "${toRemove.value}" and all its content?`;
});

function removeItem(id: string) {
    toRemove.value = id;
}

function cancelRemove() {
    toRemove.value = '';
}

function confirmRemove() {
    delete props.project.versions[toRemove.value];
    toRemove.value = '';
}

</script>
<style scoped>

.active-row {
    box-shadow: inset 0 0 5px 0 var(--active-color);
}

</style>
