export const projects = ref<Projects>([]);

watch(projects, () => {
    saveStorage('projects', projects.value);
}, { deep: true });


export function setActiveProjectVersion(id: string, version: string, forceChange = false): boolean | Promise<boolean> {
    if (!forceChange && projectIsChanged.value) {
        const promise = confirmDialog(`There are some changes that are not saved.
They will be lost if you change to another project.

**Are you sure to continue** and losing these changes?
`).then((confirm) => {
            if (confirm) {
                return setActiveProjectVersion(id, version, true);
            }

            return false;
        });

        return promise;
    }

    if (currentProject.value.id !== id) {
        const activeProject = projects.value.find((pjt) => pjt.id === id);

        if (!activeProject) {
            return false;
        }

        currentProject.value = activeProject;
    }

    const currentProjectValue = currentProject.value;
    const currentVersion = currentProjectValue.versions[version];

    reset();
    activeProject.value.id = currentProjectValue.id;
    activeProject.value.title = currentProjectValue.title;
    activeProject.value.version = version;

    if (currentVersion) {
        loadProject(currentVersion);
    }

    return true;
}

function reset() {
    const initStates: Project = {
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
    };

    loadProject(initStates);
}
