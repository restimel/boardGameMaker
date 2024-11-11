<template>
    <section>
        <header>
            <nav>
                <NuxtLink v-for="menuItem of menuList"
                    :key="`header-menu-${menuItem.to}`"
                    :to="menuItem.to"
                    :class="{
                        active: menuItem.active(),
                    }"
                >
                    {{ menuItem.title }}
                </NuxtLink>
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
            <ClientOnly>
                <slot v-if="ready" />
                <p v-else
                    class="loading"
                >
                    Loading...
                </p>

                <template #fallback>
                    <p class="loading">Loading...</p>
                </template>
            </ClientOnly>
        </main>
    </section>
</template>
<script setup lang="ts">

import { saveProject, isChanged, ready } from '~/stores/project';

const route = useRoute();

const menuList = computed(() => {
    return [{
        to: '/project',
        title: 'Project',
        active: () => {
            /* include project and projects */
            return route.path.startsWith('/project');
        },
    }, {
        to: '/summary',
        title: 'Summary',
        active: () => {
            return false;
        },
    }, {
        to: '/rules',
        title: 'Rules',
        active: () => {
            return false;
        },
    }, {
        to: '/materials',
        title: 'Materials',
        active: () => {
            return route.path.startsWith('/material');
        },
    }, {
        to: '/alias',
        title: 'Alias & Enumeration',
        active: () => {
            return false;
        },
    }, {
        to: '/help',
        title: '❔',
        active: () => {
            return false;
        },
    }];
});

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

    nav > :is(.router-link-active, .active) {
        border-color: var(--active-color);
    }

    .page {
        padding: 10px;
    }
</style>
