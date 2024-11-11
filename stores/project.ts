import { computed, ref, watch } from 'vue';

const states: ProjectStates = {
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

export const ready = ref<boolean>(false);

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

export const currentProject = ref<GameProject>(createProject(''));

export const projects = ref<Projects>([]);

export function saveProject(mode: 'new' | 'major' | 'minor' | 'build') {
    let [major, minor, build] = getLastVersion(currentProject.value);

    switch (mode) {
        case 'new':
            major = 1;
            minor = 0;
            build = 0;
            break;
        case 'major':
            major = major + 1;
            minor = 0;
            build = 0;
            break;
        case 'minor':
            minor = minor + 1;
            build = 0;
            break;
        case 'build':
            build = build + 1;
            break;
    }

    if (mode === 'new') {
        const newProject = createProject(states.title.value);

        currentProject.value = newProject;
        projects.value.push(newProject);
    }

    const gameProject = currentProject.value;
    gameProject.title = states.title.value;

    const gameProjectProperty = [
        'title',
        'version',
        'id',
    ];

    const projectVersion: Project = Array.from(Object.entries(states)).reduce((jsStates, [key, value]) => {
        if (!gameProjectProperty.includes(key)) {
            (jsStates as any)[key] = value.value;
        }

        return jsStates;
    }, {} as Project);

    const newVersion = `${major}.${minor}`;

    projectVersion.buildVersion = build;
    gameProject.versions[newVersion] = projectVersion;

    loadProject(projectVersion);
    states.version.value = newVersion;

    return gameProject;
}

export const isChanged = computed<boolean>(() => {
    const version = states.version.value;
    const activeProject = currentProject.value;
    const projectVersion = activeProject.versions[version];

    if (import.meta.server) {
        return false;
    }

    if (!projectVersion) {
        return true;
    }

    if (states.title.value !== activeProject.title) {
        return true;
    }

    for (const [key, value] of Object.entries(projectVersion)) {
        if (key in states) {
            const sKey = key as StatesKey;
            if (!objEqual(states[sKey].value, value)) {
                return true;
            }
        }
    }

    return false;
});

watch(() => states, () => {
    const JSONState = Array.from(Object.entries(states)).reduce((jsStates, [key, value]) => {
        jsStates[key] = value.value;

        return jsStates;
    }, {} as any);

    saveStorage('project', JSONState);
}, { deep: true });

watch(projects, () => {
    saveStorage('projects', projects.value);
}, { deep: true });

export function setActiveProjectVersion(id: string, version: string, forceChange = false) {
    if (!forceChange && isChanged.value) {
        confirmDialog(`There are some changes that are not saved.
They will be lost if you change to another project.

**Are you sure to continue** and losing these changes?
`).then((confirm) => {
            if (confirm) {
                setActiveProjectVersion(id, version, true);
            }
        });

        return;
    }

    if (currentProject.value.id !== id) {
        const activeProject = projects.value.find((pjt) => pjt.id === id);

        if (!activeProject) {
            return false;
        }

        currentProject.value = activeProject;
    }

    const activeProject = currentProject.value;
    const activeVersion = activeProject.versions[version];

    reset();
    states.id.value = activeProject.id;
    states.title.value = activeProject.title;
    states.version.value = version;

    if (activeVersion) {
        loadProject(activeVersion);
    }

    return true;
}

function loadProject(projectVersion: Project) {
    for (const [key, value] of Object.entries(projectVersion)) {
        if (key in states) {
            const sKey = key as StatesKey;
            states[sKey].value = value;
        }
    }
}

function loadProjects(projectList: Projects) {
    if (Array.isArray(projectList)) {
        projects.value = projectList;
    }

    const id = states.id.value;
    const activeProject = projectList.find((pjt) => {
        return pjt.id === id;
    });

    if (activeProject) {
        currentProject.value = activeProject;
    }

    if (!id) {
        const firstProject = projects.value[0];

        if (firstProject) {
            const [major, minor] = getLastVersion(firstProject);
            setActiveProjectVersion(firstProject.id, `${major}.${minor}`, true);
        } else {
            saveProject('new');
        }
    }
}

async function load() {
    const [project, projects] = await Promise.all([
        loadStorage('project', 10),
        loadStorage('projects', 10),
    ]);

    if (project) {
        loadProject(project as Project);
    }


    if (projects) {
        loadProjects(projects as Projects);
    }

    ready.value = true;
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
