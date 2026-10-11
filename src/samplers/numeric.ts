import { lerp } from "../math/scalar";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler to uniformly choose a value between `min` and `max`.
 *
 * @param min - The lower bound.
 * @param max - The upper bound.
 *
 * @summary Picks a random number between two bounds.
 *
 * @example
 * ```ts
 * const size = range(8, 16);
 * ```
 *
 * @group Samplers
 */
export function range(min: number, max: number): SamplerFn<number> {
	return (ctx) => lerp(min, max, ctx.rng());
}

/**
 * Creates a sampler that picks numbers from a normal (bell curve) distribution: most values land near `mean`,
 * and fewer the further away they are. About 68% fall within one `stdDev` of the mean, about 95% within two and
 * about 99.7% within three.
 *
 * The values have no hard limits, so occasionally one can be produced that's far from the mean. Prefer
 * {@link range | range()} for properties that must stay within bounds, like a size that cannot be negative.
 *
 * @param mean - The value the results cluster around.
 * @param stdDev - How widely the results spread around the mean.
 *
 * @summary Picks random numbers that cluster around a mean.
 *
 * @see https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 *
 * @group Samplers
 */
export function normal(mean: number, stdDev: number): SamplerFn<number> {
	return (ctx) => {
		const u1 = 1 - ctx.rng();
		const u2 = ctx.rng();
		const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		return mean + z * stdDev;
	};
}

/**
 * Creates a sampler that picks numbers from `center - deviation` to `center + deviation`, spread
 * evenly across each batch of particles.
 *
 * Within a batch (a group of particles spawned in the same simulation step, such as a burst), the range is
 * divided into one equal slice per particle, and each particle gets a random value within its own slice.
 * A burst therefore will always cover the whole range evenly, without the clumps and gaps that truly
 * independent random values could produce. A particle spawned on its own gets a random value from the whole range.
 *
 * @param center - The middle of the range.
 * @param deviation - How far values may lie from the center, in either direction.
 *
 * @summary Picks numbers spread evenly around a center.
 *
 * @group Samplers
 */
export function spread(center: number, deviation: number): SamplerFn<number> {
	return (ctx) => {
		const { index: bin, size: bins } = ctx.batch ?? { index: 0, size: 1 };
		const binSize = (deviation * 2) / bins;

		const min = center - deviation + bin * binSize;
		const max = min + binSize;

		return lerp(min, max, ctx.rng());
	};
}
