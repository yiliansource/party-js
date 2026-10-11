import type { Vec3 } from "../math/vec3";
import { evaluateSampler } from "./helpers";
import { spread } from "./numeric";
import type { Sampler, SamplerFn } from "./types";

/**
 * Creates a sampler for velocities that point in a direction, with some deviation.
 *
 * Angles are in degrees, measured counter-clockwise from +x in particle space, so 0 points right and 90 points up.
 * The angle is chosen with {@link spread | spread()}, so a burst fans out evenly across the cone. A `deviation`
 * of 0 sends every particle in exactly the same direction.
 *
 * @param angle - The direction of the cone's center, in degrees.
 * @param deviation - How far a particle's direction may lie from `angle`, in degrees, in either direction.
 * @param speed - The speed, in px/s. Can itself be a sampler.
 *
 * @summary Creates velocities in a direction, with some random spread.
 *
 * @example
 * ```ts
 * // Upwards, fanning out 30° to either side, with constant speed.
 * cone(90, 30, 400)
 *
 * // Straight down, at varying speeds.
 * cone(-90, 0, range(60, 120))
 * ```
 *
 * @group Samplers
 */
export function cone(
	angle: number,
	deviation: number,
	speed: Sampler<number>,
): SamplerFn<Vec3> {
	const angleSampler = spread(angle, deviation);
	return (ctx) => {
		const theta = (angleSampler(ctx) * Math.PI) / 180;
		const r = evaluateSampler(speed, ctx);
		return {
			x: Math.cos(theta) * r,
			y: Math.sin(theta) * r,
			z: 0,
		};
	};
}
