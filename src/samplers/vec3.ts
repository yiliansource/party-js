import { lerp } from "../math/scalar";
import { scale, type Vec3 } from "../math/vec3";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler for spinning in a random direction: a random rotation axis, with a speed between `min` and `max`.
 *
 * @param min - The slowest spin, in degrees per second.
 * @param max - The fastest spin, in degrees per second.
 *
 * @summary Picks a random spin axis and speed.
 *
 * @see https://mathworld.wolfram.com/SpherePointPicking.html
 *
 * @group Samplers
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
