import type { Vec3 } from "../math/vec3";
import { evaluateSampler } from "./helpers";
import { spread } from "./spread";
import type { Sampler, SamplerFn } from "./types";

/**
 * Creates a sampler for a 2D directional cone, with a provided angle in degrees, measured counter-clockwise from +x.
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
