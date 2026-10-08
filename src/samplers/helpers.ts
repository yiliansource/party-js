import type { Sampler, SamplerContext, SamplerFn } from "./types";

export function evaluateSampler<T>(
	sampler: Sampler<T>,
	ctx: SamplerContext,
): T {
	return typeof sampler === "function"
		? (sampler as SamplerFn<T>)(ctx)
		: sampler;
}
