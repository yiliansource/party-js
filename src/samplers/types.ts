import type { Rng } from "../random";

/**
 * Represents a context for samplers to obtain information about a particle.
 *
 * @group Samplers
 */
export interface SamplerContext {
	/**
	 * The random number generator associated with the context.
	 */
	rng: Rng;
	/**
	 * The index of the particle in the emitter.
	 */
	index: number;
	batch?: { index: number; size: number };
}

/**
 * @group Samplers
 */
export type SamplerFn<T> = (ctx: SamplerContext) => T;

/**
 * @group Samplers
 */
export type Sampler<T> = T | SamplerFn<T>;
