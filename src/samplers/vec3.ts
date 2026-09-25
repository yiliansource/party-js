import { lerp } from "../math/scalar";
import { scale, type Vec3 } from "../math/vec3";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler to produce a random 3D angular velocity, i.e.
 * a uniformly-distributed random axis scaled by a uniformly speed from [min, max].
 *
 * @param min The minimum speed.
 * @param max The maximum speed.
 *
 * @see https://mathworld.wolfram.com/SpherePointPicking.html
 */
export function randomSpin(min: number, max: number): SamplerFn<Vec3> {
	return (ctx) => {
		const z = ctx.rng() * 2 - 1;
		const phi = ctx.rng() * 2 * Math.PI;
		const r = Math.sqrt(1 - z ** 2);
		const axis: Vec3 = { x: r * Math.cos(phi), y: r * Math.sin(phi), z };
		const speed = lerp(min, max, ctx.rng());
		return scale(axis, speed);
	};
}
