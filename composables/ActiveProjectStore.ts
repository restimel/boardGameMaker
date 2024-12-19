
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

/** This value is incremented when activeProject is changed */
export const activeProjectChanged = ref(0n);

watch(activeProject, () => {
    activeProjectChanged.value++;
    saveStorage('project', activeProject.value);
}, { deep: true });

export const playersInfo = computed(() => {
    let text = '';
    const activeProjectValue = activeProject.value;

    if (activeProjectValue.playerMin === activeProjectValue.playerMax) {
        text = activeProjectValue.playerMin.toString(10);
    } else {
        text = `${activeProjectValue.playerMin} - ${activeProjectValue.playerMax}`;
    }

    if (activeProjectValue.playerBest) {
        text += ` (best: ${activeProjectValue.playerBest})`;
    }

    if (activeProjectValue.playerOptions) {
        text += ` ${activeProjectValue.playerOptions}`;
    }

    return text;
});

export async function importProject(data: StateProject, doNotCheck = false): Promise<boolean> {
    if (!doNotCheck && projectIsChanged.value) {
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
