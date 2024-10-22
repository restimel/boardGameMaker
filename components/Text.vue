<template>
    <p>
        {{ text }}
    </p>
</template>
<script setup lang="ts">

import { computed } from 'vue';

type Props = {
    value?: string;
};

const props = defineProps<Props>();

const text = computed(() => {
    const value = props.value;

    return value ?? '';
});

</script>
<style scoped>

</style>
