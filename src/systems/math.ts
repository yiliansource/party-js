/**
 * Constant coefficient to convert degrees to radians.
 */
export const deg2rad: number = Math.PI / 180;
/**
 * Constant coefficient to convert radians to degrees.
 */
export const rad2deg: number = 180 / Math.PI;
/**
 * A small value to approximately compare values.
 */
export const epsilon = 0.000001;

/**
 * Linearly interpolates between a and b by t.
 */
export function lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b;
}

/**
 * Smoothly interpolates between a and b by t (using cosine interpolation).
 */
export function slerp(a: number, b: number, t: number): number {
    return lerp(a, b, (1 - Math.cos(t * Math.PI)) / 2);
}

/**
 * Inversely lerps v between a and b to find t.
 */
export function invlerp(a: number, b: number, v: number): number {
    return (v - a) / (b - a);
}

/**
 * Clamps the specified value between a minimum and a maximum.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/**
 * Checks if a is approximately equal to b.
 */
export function approximately(a: number, b: number): boolean {
    return Math.abs(a - b) < epsilon;
}
