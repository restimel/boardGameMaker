
export default function objEqual(obj1: any, obj2: any): boolean {
    const type = typeof obj1;

    if (typeof obj2 !== type) {
        return false;
    }

    if (type !== 'object') {
        return obj1 === obj2;
    }

    if (Array.isArray(obj1)) {
        if (!Array.isArray(obj2) || obj1.length !== obj2.length) {
            return false;
        }

        return obj1.every((value, index) => {
            return objEqual(value, obj2[index]);
        });
    }

    for (const [key, value] of Object.entries(obj1)) {
        if (!objEqual(value, obj2[key])) {
            return false;
        }
    }

    return true;
}
