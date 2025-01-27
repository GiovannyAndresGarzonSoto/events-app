export function getSeed(): string {
    if (!process.env.SEED) {
        throw new Error('Jwt secret SEED is not defined')
    }
    return process.env.SEED
}