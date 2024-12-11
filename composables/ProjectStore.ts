import {
    states,
} from '~/stores/project';

/** Current project is the one we are reading
 * Changes are done in activeProject until we save modifications
 */
export const currentProject = ref<GameProject>(createProject(''));

export const projectIsChanged = computed<boolean>(() => {
    const active = activeProject.value;
    const current = currentProject.value;
    const version = active.version;
    const projectVersion = current.versions[version];

    if (import.meta.server) {
        return false;
    }

    if (!projectVersion) {
        return true;
    }

    if (active.title !== current.title) {
        return true;
    }

    for (const [key, value] of Object.entries(projectVersion)) {
        if (key in active) {
            const sKey = key as StatesKey;
            if (!objEqual(active[sKey], value)) {
                return true;
            }
        }
    }

    return false;
});

export function loadProject(projectVersion: Project) {
    for (const [key, value] of Object.entries(projectVersion)) {
        /* TODO: update activeProject */
        if (key in states) {
            const sKey = key as StatesKey;
            states[sKey].value = value;
        }
    }
}

export function saveProject(mode: 'new' | 'same' | 'major' | 'minor' | 'build', version = ''): GameProject {
    let [major, minor, build] = getLastVersion(currentProject.value);

    if (version) {
        const versionArr = version.split('.');

        major = +versionArr[0] || 0;
        minor = +versionArr[1] || 0;
        build = +versionArr[2] || 0;
    }

    switch (mode) {
        case 'new':
            if (!version) {
                major = 1;
                minor = 0;
                build = 0;
            }
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
        case 'same':
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
