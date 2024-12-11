import { computed, ref, watch } from 'vue';

/** @deprecated -- DO NOT USE (this is only for transition before deprecation) */
export const states: ProjectStates = {
    title: ref<string>('The project'),
    id: ref<string>(''),
    version: ref<string>('1.0'),
    author: ref<string>(''),
    buildVersion: ref<number>(0),

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
    enumerations: ref<Enumeration[]>([]),
};

/** @deprecated -- use activeProject */
export function getCurrentProject(): StateProject {
    return Array.from(Object.entries(states)).reduce((jsStates, [key, value]) => {
        (jsStates as any)[key] = value.value;

        return jsStates;
    }, {} as StateProject);
}

watch(() => states, () => {
    const JSONState = Array.from(Object.entries(states)).reduce((jsStates, [key, value]) => {
        jsStates[key] = value.value;

        return jsStates;
    }, {} as any);

    saveStorage('project', JSONState);
}, { deep: true });

/** @deprecated -- use activeProject */
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
