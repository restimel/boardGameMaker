<template>
    <div
        :class="{
            'toggle-container': true,
            disabled: !!props.disabled,
        }"
        @click.stop.prevent="toggle"
    >
        <div class="toggle-switch" :class="{ 'active': value }">
            <span class="label left" :class="{ 'active': !value }">
                {{ leftLabel }}
            </span>
            <div class="slider">
                <div class="thumb"></div>
            </div>
            <span class="label right" :class="{ 'active': value }">
                {{ rightLabel }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
type Props = {
    leftLabel: string;
    rightLabel: string;
    value: boolean;
    disabled?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits(['change']);

const toggle = () => {
    if (!props.disabled) {
        emit('change', !props.value);
    }
};

</script>

<style scoped>
.toggle-container {
    display: inline-block;
    cursor: pointer;
    user-select: none;
}

.toggle-switch {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    border-radius: 25px;
    background-color: #f0f0f0;
    transition: background-color 0.3s;
}

.slider {
    position: relative;
    width: 41px;
    height: 18px;
    background-color: #e0e0e0;
    border-radius: 13px;
    transition: background-color 0.3s;
}

.thumb {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 17px;
    height: 17px;
    background-color: var(--bg-color);
    border-radius: 50%;
    transition: transform 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .thumb {
    transform: translateX(24px);
}

.toggle-switch.active .slider {
    background-color: var(--brand-primary);
}

.label {
    font-size: 14px;
    color: var(--text-disabled-color);
    transition: color 0.3s;
    font-size: 0.6em;
}

.toggle-container:not(.disabled) .label.active {
    color: var(--brand-primary);
    font-weight: 600;
    font-size: 0.8em;
}
</style>
