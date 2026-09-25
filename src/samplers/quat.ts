import type { Quat } from "../math/quat";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler for a uniformly-distributed random rotation, using Shoemake's algorithm.
 *
 * @see Shoemake, K. (1992). "III.6 - Uniform Random Rotations."
 */
export function randomOrientation(): SamplerFn<Quat> {
	return (ctx) => {
		const x1 = ctx.rng();
		const x2 = ctx.rng();
		const x3 = ctx.rng();
		const r1 = Math.sqrt(1 - x1);
		const r2 = Math.sqrt(x1);
		const t1 = 2 * Math.PI * x2;
		const t2 = 2 * Math.PI * x3;
		return {
			x: r1 * Math.sin(t1),
			y: r1 * Math.cos(t1),
			z: r2 * Math.sin(t2),
			w: r2 * Math.cos(t2),
		};
	};
}
