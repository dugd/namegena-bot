export function generateName(firstName: string, secondName: string): string {
    const mid1 = Math.ceil(firstName.length / 2);
    const mid2 = Math.floor(secondName.length / 2);
    return firstName.slice(0, mid1) + secondName.slice(mid2);
}
