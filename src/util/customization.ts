import { pick, randomRange } from "./random";

export type Variation<T> = T | T[] | (() => T);
export function getVariationValue<T>(variation: Variation<T>) {
    if (Array.isArray(variation)) {
        return pick(variation);
    }
    if (typeof variation === "function") {
        (variation as () => T)();
    }
    return variation;
}

export function range(min: number, max: number): Variation<number> {
    return () => randomRange(min, max);
}

export function variation(value: number, variation: number, isAbsolute: boolean = false): Variation<number> {
    return () => isAbsolute
        ? value + randomRange(-variation / 2, +variation / 2)
        : value * randomRange(1 - variation / 2, 1 + variation / 2);
}