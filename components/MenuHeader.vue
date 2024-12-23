<template>
    <menu>
        <ClientOnly>
            <span class="summary">
                {{ summaryTitle }}
            </span>
            <button
                class="default-button"
                :disabled="disabledButton"
                @click="save('major')"
            >
                Save major
            </button>
            <button
                class="default-button"
                :disabled="disabledButton"
                @click="save('minor')"
            >
                Save minor
            </button>
            <button
                class="main-button"
                :disabled="disabledButton"
                @click="save('build')"
            >
                Save
            </button>
        </ClientOnly>
    </menu>
</template>
<script setup lang="ts">

const disabledButton = computed(() => {
    return !projectIsChanged.value;
});

const summaryTitle = computed<string>(() => {
    const project = activeProject.value;

    return `${project.title} — ${project.version}.${project.buildVersion}`;
});

function save(mode: BuildMode) {
    if (disabledButton.value) {
        return;
    }

    saveProject(mode);
}

</script>
<style scoped>

menu {
    display: inline-flex;
    margin: -10px;
    margin-inline-end: 25px;
    padding: 0;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-end;
}

.default-button,
.main-button {
    height: 15px;
    line-height: 5px;
}

.main-button {
    background-color: hsl(from var(--brand-primary) h s 33);
}

.summary {
    font-size: 0.8em;
    width: 100%;
    text-align: end;
}

</style>
