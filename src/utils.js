export function generateID() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
