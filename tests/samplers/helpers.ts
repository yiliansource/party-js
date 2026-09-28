import type { Rng, SamplerContext } from "../../src";

export function makeTestCtx(
	rng: Rng,
	overrides: Partial<SamplerContext> = {},
): SamplerContext {
	return {
		rng,
		index: 0,
		...overrides,
	};
}
