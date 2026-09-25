import type { Rng } from "../random";

/**
 * Represents a context for samplers to obtain information about a particle.
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
	/**
	 * The total count of emitted particles in the case of a burst emission, and undefined otherwise.
	 */
	count?: number;
}

export type SamplerFn<T> = (ctx: SamplerContext) => T;
export type Sampler<T> = T | SamplerFn<T>;
