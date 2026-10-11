import type { Sampler, SamplerContext, SamplerFn } from "./types";

/**
 * Resolves a {@link Sampler} to a value, by calling it if it is a function, or returning it unchanged
 * if it is a fixed value.
 *
 * This can be useful when writing your own samplers that build on other samplers.
 *
 * @param sampler - The sampler to resolve.
 * @param ctx - The context to pass on if the `sampler` is a function.
 * @returns The sampled value.
 *
 * @summary Resolves a sampler to a value.
 *
 * @example
 * ```ts
 * const doubled = (base: Sampler<number>): SamplerFn<number> =>
 *     (ctx) => 2 * evaluateSampler(base, ctx);
 * ```
 *
 * @group Samplers
 */
export function evaluateSampler<T>(
	sampler: Sampler<T>,
	ctx: SamplerContext,
): T {
	return typeof sampler === "function"
		? (sampler as SamplerFn<T>)(ctx)
		: sampler;
}
