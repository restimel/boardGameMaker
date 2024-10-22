declare module 'nuxt-storage' {
    interface Storage {
        getData(key: string): string;
        setData(key: string, value: string, expiry?: number, expiryUnit?: 's' | 'm' | 'h' | 'd'): void;
        clear(): void;
    }

    interface NuxtStorage {
        localStorage: Storage;
        sessionStorage: Storage;
    }

    const storage: NuxtStorage;
    export default storage;
}
