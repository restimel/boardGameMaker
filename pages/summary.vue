<template>
    <div>
        <h1>
            {{ project.title }}
            <sub>{{ project.version }}.{{ project.buildVersion }}</sub>
        </h1>
        <label>
            Author:
            <output>{{ project.author }}</output>
        </label>

        <h2>Concept</h2>
        <Text :value="project.concept.value" />

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

        <ul>
            <li v-for="material of project.materials.value"
            >
                <NuxtLink :to="`/material/${material.name}/print`">
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
        <Text :value="project.setup.value" />

        <h3>Game turns</h3>
        <Text :value="project.rules.value" />

        <h3>End of the game</h3>
        <Text :value="project.endOfGame.value" />

        <Text :value="project.score.value" />
    </div>
</template>
<script setup lang="ts">
import projectStore from '~/stores/project';

const project = projectStore();

function numberMaterial(material: Material): number {
    const length = material.contents.length;
    const allContexts = createAllContext(activeProject.value, material.description).length;

    return length * allContexts;
}

</script>
<style scoped>
.material-name {
    font-weight: 600;
}
</style>
