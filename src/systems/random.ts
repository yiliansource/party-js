import { Rect } from "../components/rect";
import { Vector } from "../components/vector";
import { lerp } from "./math";

/**
 * Returns a random value from min to max.
 */
export function random(min = 0, max = 1): number {
    return lerp(min, max, Math.random());
}

/**
 * Picks a random element from the specified array. Returns undefined if the array is empty.
 */
export function pick<T>(arr: T[]): T {
    return arr.length === 0
        ? undefined
        : arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random unit vector.
 */
export function randomUnitVector(): Vector {
    const theta = random(0, 2 * Math.PI);
    const z = random(-1, 1);
    return new Vector(
        Math.sqrt(1 - z * z) * Math.cos(theta),
        Math.sqrt(1 - z * z) * Math.sin(theta),
        z
    );
}

export function randomInsideRect(rect: Rect): Vector {
    return new Vector(
        rect.x + random(0, rect.width),
        rect.y + random(0, rect.height)
    );
}
