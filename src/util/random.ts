import { lerp } from "./math";
import Vector from "./vector";

/**
 * Returns a random value from 0 to 1.
 */
export function random(): number {
    return Math.random();
}

/**
 * Returns a random value from min to max.
 */
export function randomRange(min: number, max: number): number {
    return lerp(min, max, random());
}

/**
 * Picks a random element from the specified array. Returns undefined if the array is empty.
 */
export function pick<T>(arr: T[]): T {
    return arr.length === 0 ? undefined : arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random unit vector.
 */
export function randomUnitVector(): Vector {
    let theta = randomRange(0, 2 * Math.PI);
    let z = randomRange(-1, 1);
    return new Vector(
        Math.sqrt(1 - z * z) * Math.cos(theta),
        Math.sqrt(1 - z * z) * Math.sin(theta),
        z
    );
}