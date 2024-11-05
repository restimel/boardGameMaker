<template>
    <div>
        <h1>Project list</h1>

        <table class="table-list project-list">
            <thead>
                <tr>
                    <th class="index">
                    </th>
                    <th>
                        Project name
                    </th>
                    <th>
                        last version
                    </th>
                    <th>
                        nb versions
                    </th>
                    <th class="cell-actions">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(project, index) in projects"
                    :key="`project-list-${index}-${project.id}`"
                    :class="{
                        'active-row': project.id === currentProject.id,
                    }"
                    @click="details = project"
                >
                    <td>
                        {{  index + 1 }}
                    </td>
                    <td>
                        {{ project.title }}
                    </td>
                    <td>
                        {{ lastVersion(project) }}
                    </td>
                    <td>
                        {{ Object.keys(project.versions).length }}
                    </td>
                    <td class="cell-actions">
                        <button @click.stop="setActiveProjectVersion(project.id, lastVersion(project).split('.').slice(0, 2).join('.'))">
                            ▶️
                        </button>
                        <button @click.stop="removeItem(project.id)">
                            ✕
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        +
                    </td>
                    <td>
                        <input
                            type="text"
                            v-model="newItemName"
                            @change="addItem"
                        />
                    </td>
                    <td>
                        1.0.0
                    </td>
                    <td>
                        0
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
        <dialog :open="details !== null">
            <ProjectVersions v-if="details"
                :project="details"
            />
            <button @click="details = null">
                Close
            </button>
        </dialog>
    </div>
</template>
<script setup lang="ts">

import {
    projects,
    currentProject,
    setActiveProjectVersion,
} from '../stores/project';

const newItemName = ref<string>('');
const toRemove = ref<string>('');
const details = ref<GameProject | null>(null);

const toRemoveText = computed<string>(() => {
    if (toRemove.value === '') {
        return '';
    }

    console.log('TODO remove');
    const title = toRemove.value;

    return `Are you sure to remove the project "${title}"?`;
});

function lastVersion(project: GameProject): string {
    const [major, minor, build] = getLastVersion(project);

    return `${major}.${minor}.${build}`;
}

function addItem() {
    const project = createProject(newItemName.value);
    projects.value.push(project);
    newItemName.value = '';
}


function removeItem(id: string) {
    toRemove.value = id;
}

function cancelRemove() {
    toRemove.value = '';
}

function confirmRemove() {
    const id = toRemove.value;
    const index = projects.value.findIndex((project) => project.id === id);
    projects.value.splice(index, 1);
    toRemove.value = '';
}

</script>
<style scoped>

.active-row {
    box-shadow: inset 0 0 5px 0 var(--active-color);
}

</style>
