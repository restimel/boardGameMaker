<template>
    <label>
        {{ props.label }}:

        <InputRadio
            :values="[{
                label: 'Text',
                value: 'StaticText',
            }, {
                label: 'Image',
                value: 'StaticImage',
            }, {
                label: 'Reference',
                value: 'Reference',
            }]"
            v-model="valueType"
            @change="onInputType"
        />
        <br>
        <textarea v-if="content.type === 'StaticText'"
            v-model="valueContent"
            @input="onInputValue"
        >
        </textarea>
        <InputImage v-else-if="content.type === 'StaticImage'"
            v-model="valueContent"
            label="Image"
            @change="onInputValue"
        />
        <select v-else-if="content.type === 'Reference'"
            v-model="valueContent"
            @change="onInputValue"
        >
            <option value=""></option>
            <option v-for="attribute of referenceList"
                :key="`reference-${uid}-${attribute.name}`"
                :value="attribute.name"
            >
                {{ attribute.name }}
            </option>
        </select>
        <InputRange :min="0" :max="50" v-model="content.size" />
        <InputColor
            label="Text color"
            :context="context"
            v-model="content.color"
        />
        <label class="text-alignment">
            <button
                :class="{
                    active: content.alignment === 'start',
                }"
                @click="content.alignment = 'start'"
            >
                <IconTextLeft />
            </button>
            <button
                :class="{
                    active: content.alignment === 'center',
                }"
                @click="content.alignment = 'center'"
            >
                <IconTextCenter />
            </button>
            <button
                :class="{
                    active: content.alignment === 'end',
                }"
                @click="content.alignment = 'end'"
            >
                <IconTextRight />
            </button>
        </label>
    </label>
</template>
<script setup lang="ts">

type Props = {
    label: string;
    materials: Material;
};

const props = defineProps<Props>();
const content: Ref<MetaContent> = defineModel<MetaContent>() as any;
const valueType = ref<'StaticText' | 'StaticImage' | 'Reference'>('StaticText');
const valueContent = ref<string>('');

const uid = Math.random();

const context = computed<MaterialContext>(() => {
    const project = activeProject.value;
    const materialValue = props.materials;

    return createContext(project, materialValue, undefined);
});

const referenceList = computed<MaterialDescription[]>(() => {
    const list = Object.values(props.materials.description);

    list.push({
        name: 'index',
        type: 'number',
        defaultValue: '0',
    });

    list.push({
        name: 'total',
        type: 'number',
        defaultValue: '0',
    });

    return list;
});

watch(content, () => {
    const detail = content.value;

    valueType.value = detail.type;
    valueContent.value = detail.value;
}, { immediate: true });

function onInputType() {
    const type = valueType.value;

    if (type === content.value.type) {
        return;
    }

    const size = content.value.size || getDefaultTextSize();
    const color: Color = content.value.color || getDefaultMaterialTextColor();

    const ref: MetaContent = {
        type,
        value: '',
        size,
        color,
        alignment: 'center',
    };

    content.value = ref;
}

function onInputValue() {
    setTimeout(() => {
        const value = valueContent.value;

        content.value.value = value;
    });
}
</script>
<style scoped>

.text-alignment button {
    display: inline-block;
}

.active {
    background: var(--active-bg);
    color: var(--active-color);
}

</style>
