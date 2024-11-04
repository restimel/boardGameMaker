<template>
    <section>
        <header>
            <nav>
                <NuxtLink to="/projects">Projects</NuxtLink>
                <NuxtLink to="/project">Project</NuxtLink>
                <NuxtLink to="/summary">Overview</NuxtLink>
                <NuxtLink to="/rules">Rules</NuxtLink>
                <NuxtLink to="/materials">Materials</NuxtLink>
                <NuxtLink to="/alias">Alias & Enumeration</NuxtLink>
                <NuxtLink to="/help">❔</NuxtLink>
            </nav>
            <menu>
                <button
                    class="default-button"
                    :disabled="!isChanged"
                    @click="saveProject('major')"
                >
                    Save major
                </button>
                <button
                    class="default-button"
                    :disabled="!isChanged"
                    @click="saveProject('minor')"
                >
                    Save minor
                </button>
                <button
                    class="main-button"
                    :disabled="!isChanged"
                    @click="saveProject('build')"
                >
                    Save
                </button>
            </menu>
        </header>
        <main class="page">
            <slot />
        </main>
    </section>
</template>
<script setup lang="ts">

import { saveProject, isChanged } from '~/stores/project';

</script>
<style scoped>
    section {
        height: 100%;
        overflow: hidden;
        margin: 0;
    }

    header {
        background: var(--brand-primary);
        color: var(--brand-primary-color);
        width: 100%;
        padding: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between
    }

    menu {
        display: inline-flex;
        margin: 0;
        margin-inline-end: 15px;
        padding: 0;
    }

    nav {
        display: inline-flex;
        flex-direction: row;
        gap: 10px;
    }

    nav > * {
        padding: 5px;
        color: var(--brand-primary-color);
        text-decoration: none;
        border-bottom: 3px solid var(--brand-primary-color);
    }

    nav > *:hover {
        color: var(--active-color);
    }

    nav > *.router-link-active {
        border-color: var(--active-color);
    }

    .page {
        padding: 10px;
    }
</style>
