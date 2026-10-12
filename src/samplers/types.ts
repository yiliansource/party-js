import type { Rng } from "../random";

/**
 * Information passed to a {@link SamplerFn} each time it is called.
 *
 * @summary Information passed to a sampler function.
 *
 * @group Samplers
 */
export interface SamplerContext {
	/**
	 * The effect's random number generator. Use it instead of `Math.random()` to keep seeded effects reproducible.
	 */
	rng: Rng;
	/**
	 * A running count. For a particle's properties, it's the number of particles the effect has spawned before
	 * this one. For a burst's `count`, it's the current loop of the {@link EmissionSchedule}.
	 */
	index: number;
	/**
	 * When sampling particle properties, multiple particles spawned in one simulation step are batched, in which
	 * case this field contains information on the batch. Otherwise this field will be absent.
	 */
	batch?: {
		/**
		 * How many particles will be spawned at once.
		 */
		index: number;
		/**
		 * The particle's position in the batch, starting at 0.
		 */
		size: number;
	};
}

/**
 * A function that produces a value each time it's called, such as a random size or color.
 *
 * @summary A function that produces a value.
 *
 * @example
 * ```ts
 * // Every particle's size will be a bit larger than the one before.
 * const growing: SamplerFn<number> = (ctx) => 2 + ctx.index * 0.5;
 * ```
 *
 * @group Samplers
 */
export type SamplerFn<T> = (ctx: SamplerContext) => T;

/**
 * Either a fixed value, or a {@link SamplerFn} that produces one.
 *
 * Wherever party.js accepts a sampler, you can pass a plain value that is shared between particles
 * (for example `size: 8`), or a function that is called again for each particle (for example `size: range(4, 12)`).
 * Typically, these functions will be evaluated when the particle spawns.
 *
 * @summary A fixed value, or a function that produces one.
 *
 * @group Samplers
 */
export type Sampler<T> = T | SamplerFn<T>;
