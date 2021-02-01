import { lerp } from "./math";
import Vector from "./vector";

export function random(): number {
    return Math.random();
}

export function randomRange(min: number, max: number): number {
    return lerp(min, max, random());
}

export function pick<T>(arr: T[]): T {
    return arr.length === 0 ? undefined : arr[Math.floor(Math.random() * arr.length)];
}

export function randomUnitVector(): Vector {
    let theta = randomRange(0, 2 * Math.PI);
    let z = randomRange(-1, 1);
    return new Vector(
        Math.sqrt(1 - z * z) * Math.cos(theta),
        Math.sqrt(1 - z * z) * Math.sin(theta),
        z
    );
}