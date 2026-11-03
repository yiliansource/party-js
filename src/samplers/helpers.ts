import { invalidOption } from "../errors";
import type { Vec3 } from "../math";
import * as vec3 from "../math/vec3";
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

export function requireAxis(axis: Vec3, where: string): Vec3 {
	const n = vec3.normalize(axis);
	if (n.x === 0 && n.y === 0 && n.z === 0)
		throw invalidOption(where, "a non-zero vector", axis);
	return n;
}
