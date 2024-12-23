<template>
    <section class="app">
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

</script>
<style scoped>
    .app {
        margin: 0;
        padding: 0;
    }

    .page {
        overflow: auto;
    }
</style>
<style>
@media print {
    @page {
        size: A4;
        margin: 20mm;
    }

    body {
        margin: 0;
        padding: 0;
        /* A4 */
        width: 210mm;
        height: 297mm;
    }

    .page {
        page-break-after: always;
    }

    .card-preview {
        page-break-inside: avoid;
        break-inside: avoid;
    }
}

</style>
