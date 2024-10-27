
export default function getUid(key: string = ''): string {
    return key + (Math.random()*1e19).toString(36);
}
