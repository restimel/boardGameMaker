<template>
    <div>
        <h1>
            Project
            <br>
            <sub>{{ project.version }}.{{ project.buildVersion }}</sub>
        </h1>


        <p>
            <NuxtLink to="/projects">Change project</NuxtLink>
        </p>

        <section class="form">
            <label>
                Title:
                <input v-model="project.title.value" >
            </label>
            <label>
                Author:
                <input v-model="project.author.value" >
            </label>
        </section>

        <h2>Players</h2>
        <label>
            min:
            <input v-model="project.playerMin.value" type="number" min="0">
        </label>
        <label>
            max:
            <input v-model="project.playerMax.value" type="number" min="0">
        </label>
        <label>
            Best:
            <input v-model="project.playerBest.value" type="number" min="0">
        </label>
        <label>
            Others:
            <input v-model="project.playerOptions.value" type="text">
        </label>
        <p>
            Nb of players: <Text class="inline-text" :value="project.players.value" />
        </p>

        <hr>
        <h2>Managements</h2>

        <ImportFile
            file-type="JSON"
            :export-options="{
                name: project.title.value,
                content: jsonProject,
            }"
            @import="importFile"
        />
    </div>
</template>
<script setup lang="ts">

import projectStore, { importProject } from '~/stores/project';

const project = projectStore();

const jsonProject = computed<StateExtended>(() => {
    const states: StateExtended = Object.entries(project).reduce((states, [key, value]) => {
        (states as any)[key] = value.value;

        return states;
    }, {} as StateExtended);

    return states;
});

async function importFile(data: StateProject) {
    const result = await importProject(data);

    if (result) {
        console.log('imported', project.version.value, project.buildVersion.value);
    }
}

</script>
<style scoped>

</style>
