import { computed, ref, watch } from 'vue';
import nuxtStorage from 'nuxt-storage';

const states: ProjectStates = {
    title: ref<string>('The project'),
    author: ref<string>(''),
    version: ref<Version>([0, 0, 1]),

    concept: ref<string>(''),
    setup: ref<string>(''),
    rules: ref<string>(''),
    endOfGame: ref<string>(''),
    score: ref<string>(''),

    playerMin: ref<number>(1),
    playerMax: ref<number>(1),
    playerBest: ref<number>(0),
    playerOptions: ref<string>(''),

    duration: ref<number>(42),

    materials: ref<Material[]>([]),

    alias: ref<Record<string, Alias>>({}),
};

watch(() => states, () => {
    const JSONState = Array.from(Object.entries(states)).reduce((jsStates, [key, value]) => {
        jsStates[key] = value.value;

        return jsStates;
    }, {} as any);
    const serialized = JSON.stringify(JSONState);

    nuxtStorage.localStorage.setData('project', serialized, 30_000, 'd');
}, { deep: true });

function load() {
    const strValues = nuxtStorage.localStorage.getData('project');

    if (!strValues) {
        return;
    }

    try {
        const values = JSON.parse(strValues);

        for (let [key, value] of Object.entries(values)) {
            if (key in states) {
                const k = key as StatesKey;
                states[k].value = value as any;
            }
        }
    } catch(err) {
        console.warn('Failed to parse localStorage', err);
    }
}

load();

export default function() {

    const players = computed(() => {
        let text = '';

        if (states.playerMin.value === states.playerMax.value) {
            text = states.playerMin.value.toString(10);
        } else {
            text = `${states.playerMin.value} - ${states.playerMax.value}`;
        }

        if (states.playerBest.value) {
            text += ` (best: ${states.playerBest.value})`;
        }

        if (states.playerOptions.value) {
            text += ` ${states.playerOptions.value}`;
        }

        return text;
    });


    return {
        ...states,
        players,
    };
}
