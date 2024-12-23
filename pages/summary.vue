<template>
    <div>
        <h1>
            {{ activeProject.title }}
            <sub>{{ activeProject.version }}.{{ activeProject.buildVersion }}</sub>
        </h1>
        <label>
            Author:
            <output>{{ activeProject.author }}</output>
        </label>

        <h2>Concept</h2>
        <Text :value="activeProject.concept" />

        <h3>Key concepts</h3>
        <label>
            Number of players:
            <output>{{ playersInfo }}</output>
        </label>
        <label>
            Duration:
            <output>{{ activeProject.duration }}min</output>
        </label>

        <h2>Materials</h2>

        <ul>
            <li v-for="material of activeProject.materials"
            >
                <NuxtLink :to="`/material/${material.name}/print`" target="_blank">
                    <span class="material-name">
                        {{ material.name }}
                    </span>:
                    <span class="material-quantity">
                        {{ numberMaterial(material) + ' ' + material.type.toLocaleLowerCase() }}
                    </span>
                </NuxtLink>
            </li>
        </ul>

        <h2>Rules</h2>

        <h3>Setup of the game</h3>
        <Text :value="activeProject.setup" />

        <h3>Game turns</h3>
        <Text :value="activeProject.rules" />

        <h3>End of the game</h3>
        <Text :value="activeProject.endOfGame" />

        <Text :value="activeProject.score" />
    </div>
</template>
<script setup lang="ts">

</script>
<style scoped>
.material-name {
    font-weight: 600;
}
</style>
