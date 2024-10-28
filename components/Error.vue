<template>
    <div class="error-boundary">
        <template v-if="error">
            <div class="error-message">
                <h3>Something wrong happened:</h3>
                <p>{{ details }}</p>
                <p>{{ error.message }}</p>
                <button @click="clearError">Retry</button>
            </div>
        </template>
        <template v-else>
            <Suspense>
                <template #default>
                    <slot />
                </template>
                <template #fallback>
                    <div
                        :class="{
                            loading: true,
                            'no-animation': !!noAnimation,
                        }"
                    >
                        {{ loading }}
                    </div>
                </template>
            </Suspense>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

type Props = {
    loading?: string;
    noAnimation?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    loading: '⏳',
});

const error = ref<Error | null>(null);
const details = ref<string>('');

function clearError() {
    error.value = null;
    details.value = '';
}

/* Catch all errors from child components */
onErrorCaptured((err: Error, _instance: globalThis.ComponentPublicInstance | null, info: string) => {
    error.value = err;
    details.value = info;

    console.error(info, err);

    /* stop error propagation */
    return false;
});

</script>

<style scoped>
.error-boundary {
    width: 100%;
}

.error-message {
    padding: 1rem;
    border: 1px solid var(--error-color);
    border-radius: 4px;
    background-color: var(--error-bg-color);
    color: var(--error-color);
}

.loading {
    display: inline-block;
    text-align: center;
    padding: 1rem;
    font-size: 1.5rem;
    color: var(--text-disabled-color);
}
.loading:not(.no-animation) {
    animation: flip 3s infinite;
    transform-origin: center;
}

@keyframes flip {
    0% {
        transform: rotate(0deg);
    }
    90% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(180deg);
    }
}
</style>
