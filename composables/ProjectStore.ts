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
        /* no need to check right now */
        return false;
    }

    /* XXX: for reactivity */
    activeProjectChanged.value;

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
        } else {
            /* missing key */
            return true;
        }
    }

    return false;
});

export function loadProject(projectVersion: Project) {
    const activeProjectValue = activeProject.value;
    for (const [key, value] of Object.entries(projectVersion)) {
        if (key in activeProjectValue) {
            const sKey = key as StatesKey;
            (activeProject.value as any)[sKey] = copyValue(value);
        }
    }
}

export function saveProject(mode: BuildMode, version = ''): GameProject {
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
        const newProject = createProject(activeProject.value.title);

        currentProject.value = newProject;
        projects.value.push(newProject);
    }

    const gameProject = currentProject.value;
    gameProject.title = activeProject.value.title;

    const gameProjectProperty = [
        'title',
        'version',
        'id',
    ];

    const projectVersion: Project = Array.from(Object.entries(activeProject.value)).reduce((jsStates, [key, value]) => {
        if (!gameProjectProperty.includes(key)) {
            (jsStates as any)[key] = value;
        }

        return jsStates;
    }, {} as Project);

    const newVersion = `${major}.${minor}`;

    projectVersion.buildVersion = build;
    gameProject.versions[newVersion] = projectVersion;

    loadProject(projectVersion);
    activeProject.value.version = newVersion;

    return gameProject;
}
