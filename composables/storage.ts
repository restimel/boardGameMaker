import nuxtStorage from 'nuxt-storage';

export async function loadStorage(name: string, wait = 0): Promise<object | null> {
    if (!import.meta.client) {
        if (wait) {
            await new Promise((resolve) => {
                setTimeout(resolve, 50);
            });

            return loadStorage(name, wait - 1);
        } else {
            console.info('Still on server side, :(');
        }
    }

    const strValues = nuxtStorage.localStorage.getData(name);

    if (strValues) {
        try {
            const values = JSON.parse(strValues);

            return values;
        } catch(err) {
            console.warn(`Failed to parse localStorage "${name}"`, err);
            return null;
        }
    }

    return null;
}


export async function saveStorage(name: string, data: object): Promise<boolean> {
    const serialized = JSON.stringify(data);

    nuxtStorage.localStorage.setData(name, serialized, 30_000, 'd');

    return true;
}
