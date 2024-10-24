<template>
    <div>
        <h1>Project</h1>

        <label>
            Title:
            <input v-model="project.title.value" >
        </label>
        <label>
            Author:
            <input v-model="project.author.value" >
        </label>

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
    </div>
</template>
<script setup lang="ts">

import projectStore from '~/stores/project';

const project = projectStore();

</script>
<style scoped>

</style>
