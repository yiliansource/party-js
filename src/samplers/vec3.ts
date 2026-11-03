import { lerp } from "../math/scalar";
import { scale, type Vec3 } from "../math/vec3";
import { requireAxis } from "./helpers";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler for spinning in a random direction: a speed between `min` and `max` on a rotation axis.
 * If no axis is provided, a random one is sampled.
 *
 * @param min - The slowest spin, in degrees per second.
 * @param max - The fastest spin, in degrees per second.
 * @param axis - Optionally, the axis to create the rotation on.
 *
 * @summary Picks a random spin axis and speed.
 *
 * @see {@link https://mathworld.wolfram.com/SpherePointPicking.html | Wolfram MathWorld: Sphere Point Picking}
 *
 * @group Samplers
 */
export function randomSpin(
	min: number,
	max: number,
	axis?: Readonly<Vec3>,
): SamplerFn<Vec3> {
	const fixed = axis && requireAxis(axis, "randomSpin() axis");
	return (ctx) => {
		if (fixed) {
			const direction = ctx.rng() < 0.5 ? -1 : 1;
			return scale(fixed, direction * lerp(min, max, ctx.rng()));
		}

		const z = ctx.rng() * 2 - 1;
		const phi = ctx.rng() * 2 * Math.PI;
		const r = Math.sqrt(1 - z ** 2);
		const randomAxis: Vec3 = {
			x: r * Math.cos(phi),
			y: r * Math.sin(phi),
			z,
		};
		return scale(randomAxis, lerp(min, max, ctx.rng()));
	};
}
