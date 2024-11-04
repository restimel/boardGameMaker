import { computed, ref, watch } from 'vue';
import nuxtStorage from 'nuxt-storage';

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
    console.log('check isChanged');
    const version = states.version.value;
    const activeProject = currentProject.value;
    const projectVersion = activeProject.versions[version];

    if (!projectVersion) {
        console.log('no project version');
        return true;
    }

    if (states.title.value !== activeProject.title) {
        console.log('title different', activeProject.title, states.title.value);
        return true;
    }

    for (const [key, value] of Object.entries(projectVersion)) {
        if (key in states) {
            const sKey = key as StatesKey;
            if (!objEqual(states[sKey].value, value)) {
                console.log('changed:', sKey, value, states[sKey].value);
                return true;
            }
        }
    }

    console.log('no diff');
    return false;
});

watch(() => states, () => {
    const JSONState = Array.from(Object.entries(states)).reduce((jsStates, [key, value]) => {
        if (key in jsStates) {
            jsStates[key] = value.value;
        }

        return jsStates;
    }, {} as any);
    const serialized = JSON.stringify(JSONState);

    nuxtStorage.localStorage.setData('project', serialized, 30_000, 'd');
}, { deep: true });

watch(projects, () => {
    const serialized = JSON.stringify(projects.value);

    nuxtStorage.localStorage.setData('projects', serialized, 30_000, 'd');
}, { deep: true });

export function setActiveProjectVersion(id: string, version: string) {
    if (currentProject.value.id !== id) {
        const activeProject = projects.value.find((pjt) => pjt.id === id);

        if (!activeProject) {
            return false;
        }

        currentProject.value = activeProject;
    }

    const activeProject = currentProject.value;
    const activeVersion = activeProject.versions[version];

    if (!activeVersion) {
        return false;
    }

    reset();
    states.id.value = activeProject.id;
    states.title.value = activeProject.title;
    states.version.value = version;
    loadProject(activeVersion);
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
            setActiveProjectVersion(firstProject.id, `${major}.${minor}`);
        } else {
            saveProject('new');
        }
    }
}

function load() {
    const strValues = nuxtStorage.localStorage.getData('project');
    const strProjectsValues = nuxtStorage.localStorage.getData('projects');

    if (strValues) {
        try {
            const values = JSON.parse(strValues);

            loadProject(values);
        } catch(err) {
            console.warn('Failed to parse localStorage', err);
        }
    }

    if (strProjectsValues) {
        try {
            const values = JSON.parse(strProjectsValues);

            loadProjects(values);
        } catch(err) {
            console.warn('Failed to parse localStorage', err);
        }
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
