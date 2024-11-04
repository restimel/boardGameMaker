

export function getLastVersion(gameProject: GameProject): Version {
    let major = -Infinity;
    let minor = -Infinity;

    for (const version of Object.keys(gameProject.versions)) {
        const [vMajor, vMinor] = version.split('.');

        const isMajor = +vMajor > major;
        const isMinor = +vMajor === major && +vMinor > minor;

        if (isMajor || isMinor) {
            major = +vMajor;
            minor = +vMinor;
        }
    }

    if (!isFinite(major)) {
        return [1, 0, 0];
    }

    const project = gameProject.versions[`${major}.${minor}`];
    const build = project?.buildVersion ?? 0;

    return [major, minor, build];
}
