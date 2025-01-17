<template>
    <div>
        <h1>Project list</h1>

        <p>
            The current active project is "{{ activeProject.title }}"
            <sub>{{ activeProject.version + '.' + activeProject.buildVersion }}</sub>
        </p>

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
                <tr v-for="(gProject, index) in projects"
                    :key="`project-list-${index}-${gProject.id}`"
                    :class="{
                        'active-row': gProject.id === currentProject.id,
                    }"
                    @click="details = gProject"
                >
                    <td>
                        {{  index + 1 }}
                    </td>
                    <td>
                        {{ gProject.title }}
                    </td>
                    <td>
                        {{ lastVersion(gProject) }}
                    </td>
                    <td>
                        {{ Object.keys(gProject.versions).length }}
                    </td>
                    <td class="cell-actions">
                        <button @click.stop="setActiveProjectVersion(gProject.id, lastVersion(gProject).split('.').slice(0, 2).join('.'))">
                            ▶️
                        </button>
                        <button @click.stop="removeItem(gProject.id)">
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
        <dialog :open="details !== null"
            class="dialog"
        >
            <ProjectVersions v-if="details"
                :project="details"
                :isActiveProject="details.id === activeProject.id"
                :activeVersion="activeProject.version"
            />
            <button @click="details = null">
                Close
            </button>
        </dialog>
    </div>
</template>
<script setup lang="ts">

import '../.nuxt/nuxt';
import '../types/Project.d';

const newItemName = ref<string>('');
const toRemove = ref<string>('');
const details = ref<GameProject | null>(null);

const toRemoveText = computed<string>(() => {
    const id = toRemove.value;

    if (id === '') {
        return '';
    }

    const gProject = projects.value.find((gameProject) => gameProject.id === id);
    const title = gProject.title ?? id;

    return `Are you sure to remove definitely the **project** "${title}"?`;
});

function lastVersion(project: GameProject): string {
    const [major, minor, build] = getLastVersion(project);

    return `${major}.${minor}.${build}`;
}

function addItem() {
    const gProject = createProject(newItemName.value);
    projects.value.push(gProject);
    newItemName.value = '';
}


async function removeItem(id: string) {
    toRemove.value = id;
    const result = await confirmDialog(toRemoveText.value);

    if (result) {
        confirmRemove();
    } else {
        toRemove.value = '';
    }
}

function confirmRemove() {
    const id = toRemove.value;
    const index = projects.value.findIndex((gProject) => gProject.id === id);
    projects.value.splice(index, 1);
    toRemove.value = '';
}

</script>
<style scoped>

.active-row {
    box-shadow: inset 0 0 5px 0 var(--active-color);
}

.dialog {
    max-height: 80vh;
    overflow: auto;
}

</style>
