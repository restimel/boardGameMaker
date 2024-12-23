<template>
    <section class="app">
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
            <MenuHeader />
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
    .app {
        height: 100vh;
        overflow: hidden;
        margin: 0;
        display: grid;
        grid-template-rows: max-content 1fr;
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
        overflow: auto;
    }
</style>
