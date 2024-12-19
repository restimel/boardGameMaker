export const ready = ref<boolean>(false);

function loadProjects(projectList: Projects) {
    if (Array.isArray(projectList)) {
        projects.value = projectList;
    }

    const id = activeProject.value.id;
    const currentGameProject = projectList.find((pjt) => {
        return pjt.id === id;
    });

    if (currentGameProject) {
        currentProject.value = currentGameProject;
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
