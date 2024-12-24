<template>
    <div>
        <h1>
            Project
            <br>
            <sub>{{ activeProject.version }}.{{ activeProject.buildVersion }}</sub>
        </h1>

        <p>
            <NuxtLink to="/projects">Change project</NuxtLink>
        </p>

        <section class="form">
            <label>
                Title:
                <input v-model="activeProject.title" >
            </label>
            <label>
                Author:
                <input v-model="activeProject.author" >
            </label>
        </section>

        <h2>Players</h2>
        <label>
            min:
            <input v-model="activeProject.playerMin" type="number" min="0">
        </label>
        <label>
            max:
            <input v-model="activeProject.playerMax" type="number" min="0">
        </label>
        <label>
            Best:
            <input v-model="activeProject.playerBest" type="number" min="0">
        </label>
        <label>
            Others:
            <input v-model="activeProject.playerOptions" type="text">
        </label>
        <p>
            Nb of players: <Text class="inline-text" :value="playersInfo" />
        </p>

        <button
            class="default-button"
            @click="navigateTo('/prints')"
        >
            Prints
        </button>

        <hr>
        <h2>Managements</h2>
        <ImportFile
            file-type="JSON"
            :export-options="{
                name: activeProject.title,
                content: jsonProject,
            }"
            @import="importFile"
        />
    </div>
</template>
<script setup lang="ts">

const jsonProject = computed<StateExtended>(() => {
    const states: StateExtended = Object.entries(activeProject.value).reduce((states, [key, value]) => {
        (states as any)[key] = value;

        return states;
    }, {} as StateExtended);

    return states;
});

async function importFile(data: StateProject) {
    const result = await importProject(data);

    if (result) {
        console.info('imported', activeProject.value.version, activeProject.value.buildVersion);
    }
}

</script>
<style scoped>

</style>
