import { lerp } from "../math/scalar";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler to produce a uniform spread, with a given center and maximum deviation.
 *
 * Note that this also consumes the particle index and count, to ensure that burst emissions
 * with a spread shape appear uniform.
 *
 * @param center The center of the spread cone.
 * @param deviation The deviation angle to either side of the center.
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
