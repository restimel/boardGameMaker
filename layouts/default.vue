<template>
    <section>
        <header>
            <nav>
                <NuxtLink to="/project">Project</NuxtLink>
                <NuxtLink to="/summary">Overview</NuxtLink>
                <NuxtLink to="/rules">Rules</NuxtLink>
                <NuxtLink to="/materials">Materials</NuxtLink>
                <NuxtLink to="/alias">Alias & Enumeration</NuxtLink>
                <NuxtLink to="/help">❔</NuxtLink>
            </nav>
        </header>
        <main class="page">
            <slot />
        </main>
    </section>
</template>

<style scoped>
    section {
        height: 100%;
        overflow: hidden;
        margin: 0;
    }

    nav {
        display: inline-flex;
        flex-direction: row;
        gap: 10px;
        background: var(--brand-primary);
        color: var(--brand-primary-color);
        width: 100%;
        padding: 15px;
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
