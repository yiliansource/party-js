export const deg2rad = Math.PI / 180;
export const rad2deg = 180 / Math.PI;

export function lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b;
}

export function slerp(a: number, b: number, t: number): number {
    return lerp(a, b, (1 - Math.cos(t * Math.PI) / 2));
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}