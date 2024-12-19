<template>
    <div>
        <h1>Rules</h1>
        <h2>Concept of the game</h2>
        <TextEditor
            v-model="activeProject.concept"
            placeholder="Description of the game mechanisms"
        />

        <h2>Setup of the game</h2>
        <TextEditor
            v-model="activeProject.setup"
            placeholder="Description of what should be done before starting the game"
        />

        <h2>Playing the game</h2>
        <h3>How to play</h3>
        <TextEditor
            v-model="activeProject.rules"
            placeholder="Description of what users can do. How do they play..."
        />

        <h3>End of the game</h3>
        <TextEditor
            v-model="activeProject.endOfGame"
            placeholder="What is the end condition of the game"
        />

        <h3>Score</h3>
        <TextEditor
            v-model="activeProject.score"
            placeholder="How do we define a winner"
        />
    </div>
</template>
<script setup lang="ts">

</script>
<style scoped>

</style>
