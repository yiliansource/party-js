import { lerp } from "../math/scalar";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler to uniformly choose a value between min and max.
 *
 * @param min The lower bound.
 * @param max The upper bound.
 */
export function range(min: number, max: number): SamplerFn<number> {
	return (ctx) => lerp(min, max, ctx.rng());
}

/**
 * Creates a sampler for a normal distribution with the specified mean and
 * standard deviation, using the cosine branch of the Box-Muller transform.
 *
 * @param mean The distribution's mean.
 * @param stdDev The distribution's standard deviation.
 *
 * @see https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 */
export function normal(mean: number, stdDev: number): SamplerFn<number> {
	return (ctx) => {
		const u1 = 1 - ctx.rng();
		const u2 = ctx.rng();
		const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		return mean + z * stdDev;
	};
}
