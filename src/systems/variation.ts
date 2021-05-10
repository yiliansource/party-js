import { Color, Gradient } from "../components";
import { Spline } from "../components/spline";
import { pick, randomRange } from "./random";

/**
 * Represents a junction of types that can be used as a variation on a value.
 * At any point in time, the variation can be evaluated to retrieve a "primitive" value.
 * The variation can consist of a constant, an array or an evaluateable function.
 */
export type Variation<T> = T | T[] | (() => T);

/**
 * Returns a value instance of a variation.
 */
export function evaluateVariation<T>(variation: Variation<T>): T {
    if (Array.isArray(variation)) return pick(variation);
    if (typeof variation === "function") return (variation as () => T)();
    return variation;
}

/**
 * Creates a variation function that returns a random number from min to max.
 */
export function range(min: number, max: number): Variation<number> {
    return () => randomRange(min, max);
}

/**
 * Creates a variation function that skews the specified value by a specified, absolute
 * amount. This means that instead of the value itself, a random number that deviates
 * at most by the specified amount is returned.
 *
 * @remarks
 * If you want to skew by a percentage instead, use `skewRelative`.
 */
export function skew(value: number, amount: number): Variation<number> {
    return () => value + randomRange(-amount, amount);
}

/**
 * Creates a variation function that skews the specified value by a specified percentage.
 * This means that instead of the value itself, a random number that deviates by a maximum
 * of the specified percentage is returned.
 */
export function skewRelative(
    value: number,
    percentage: number
): Variation<number> {
    return () => value * (1 + randomRange(-percentage, percentage));
}

/**
 * Creates a variation function that returns a random sample from the given spline.
 *
 * @param spline The spline to sample from.
 */
export function splineSample<T>(spline: Spline<T>): Variation<T> {
    return () => spline.evaluate(Math.random());
}

/**
 * Creates a variation function that returns a random sample from the given gradient.
 *
 * @remarks
 * This function is an alias for the spline variation, since a gradient is just
 * a spline under the hood.
 *
 * @param gradient The gradient to sample from.
 */
export function gradientSample(gradient: Gradient): Variation<Color> {
    return splineSample(gradient);
}
