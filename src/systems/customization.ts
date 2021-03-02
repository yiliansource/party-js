import { pick, randomRange } from "./random";

/**
 * Represents a variation of type T, in the form of a constant, an array or an evaluateable function.
 */
export type Variation<T> = T | T[] | (() => T);
/**
 * Returns a value instance of a variation.
 */
export function getVariationValue<T>(variation: Variation<T>): T {
    if (Array.isArray(variation)) {
        return pick(variation);
    }
    if (typeof variation === "function") {
        return (variation as () => T)();
    }
    return variation as T;
}

/**
 * Creates a variation function that returns a random number from min to max.
 */
export function range(min: number, max: number): Variation<number> {
    return () => randomRange(min, max);
}

/**
 * Creates a variation function that returns a variation on the given number.
 * @param value The base value for the variation.
 * @param variation The variation percentage to apply.
 * @param isAbsolute If true, the variation percentage is interpreted as absolute instead, adding the variation span to the value instead of multiplying with it.
 */
export function variation(
    value: number,
    variation: number,
    isAbsolute: boolean
): Variation<number> {
    return () =>
        isAbsolute
            ? value + randomRange(-variation / 2, +variation / 2)
            : value * randomRange(1 - variation / 2, 1 + variation / 2);
}
