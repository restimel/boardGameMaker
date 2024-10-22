<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 60"
    >
        <rect
            width="80"
            height="60"
            fill="none"
            stroke-width="1"
        />
        <line
            x1="30"
            y1="15"
            x2="70"
            y2="15"
            stroke-width="2"
        />
        <line
            x1="10"
            y1="30"
            x2="70"
            y2="30"
            stroke-width="2"
        />
        <line
            x1="40"
            y1="45"
            x2="70"
            y2="45"
            stroke-width="2"
        />
    </svg>
</template>
<script setup lang="ts">

</script>
<style scoped>
svg {
    height: 1em;
}
line {
    stroke: var(--text-color);
}
</style>
