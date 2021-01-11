import { lerp } from "./math";

export function random(): number {
    return Math.random();
}

export function randomRange(min: number, max: number): number {
    return lerp(min, max, random());
}

export function pick<T>(arr: T[]): T {
    if (arr.length === 0) {
        return undefined;
    }
    return arr[Math.floor(Math.random() * arr.length)];
}