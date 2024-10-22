<template>
    <div>
        <h1>{{ project.title }}</h1>
        <h2>Concept</h2>
        <Text :value="project.concept" />

        <h3>Key concepts</h3>
        <label>
            Number of players:
            <output>{{ project.players }}</output>
        </label>
        <label>
            Duration:
            <output>{{ project.duration }}min</output>
        </label>

        <h2>Materials</h2>

        <h2>Rules</h2>

        <h3>Setup of the game</h3>
        <Text :value="project.setup" />

        <h3>Game turns</h3>
        <Text :value="project.rules" />

        <h3>End of the game</h3>
        <Text :value="project.endOfGame" />

        <Text :value="project.score" />
    </div>
</template>
<script setup lang="ts">
import projectStore from '~/stores/project';

const project = projectStore();
</script>
<style scoped>

</style>
