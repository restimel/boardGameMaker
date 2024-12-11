import {
    getCurrentProject,
    states,
} from '~/stores/project';

export const activeProject = ref<StateProject>({
    title: 'The project',
    id: '',
    version: '1.0',
    author: '',
    buildVersion: 0,

    concept: '',
    setup: '',
    rules: '',
    endOfGame: '',
    score: '',

    playerMin: 1,
    playerMax: 1,
    playerBest: 0,
    playerOptions: '',

    duration: 42,

    materials: [],

    alias: {},
    enumerations: [],
});

export async function importProject(data: StateProject): Promise<boolean> {
    if (projectIsChanged.value) {
        const result = await confirmDialog(`There are some changes that are not saved.
They will be lost if you import another project.

**Are you sure to continue** and losing these changes?
`);

        if (!result) {
            return false;
        }
    }

    loadProject(data);

    const id = data.id;
    const version = data.version + '.' + data.buildVersion

    if (currentProject.value.id !== id) {
        let activeProject = projects.value.find((pjt) => pjt.id === id);

        if (!activeProject) {
            saveProject('new', version);

            return true;
        }

        currentProject.value = activeProject;
    }

    let sameOperation = true;

    if (data.version in currentProject.value.versions) {
        sameOperation = await confirmDialog(`The version "${data.version}" already exist.

Do you want to **override** it or to create a new minor version (_cancel_)?
`);
    }

    saveProject(sameOperation ? 'same' : 'minor', version);

    return true;
}

/* Transition code until stores/project.ts will be entirely rewritten */
watch(activeProject, () => {
    /* check diff (to avoid cyclic) */
    const stateJson = getCurrentProject();
    const activeProjectValue = activeProject.value;

    if (objEqual(stateJson, activeProjectValue)) {
        return;
    }
    console.log('update states')

    /* copy activeProject to states */
    importProject(activeProjectValue);
}, { deep: true });

watch([
    states.title,
    states.id,
    states.version,
    states.author,
    states.buildVersion,
    states.concept,
    states.setup,
    states.rules,
    states.endOfGame,
    states.score,
    states.playerMin,
    states.playerMax,
    states.playerBest,
    states.playerOptions,
    states.duration,
    states.materials,
    states.alias,
    states.enumerations,
], () => {
    /* check diff (to avoid cyclic) */
    const stateJson = getCurrentProject();
    const activeProjectValue = activeProject.value;

    if (objEqual(stateJson, activeProjectValue)) {
        return;
    }

    console.log('update activeProject')

    /* copy states to activeProject */
    activeProject.value = stateJson;
}, {deep: true});
