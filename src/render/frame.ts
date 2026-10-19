import type { Vec2 } from "../math/vec2";
import type { Vec3 } from "../math/vec3";
import * as vec3 from "../math/vec3";
import type { Particle } from "../particle/particle";
import { executeDrawCommand } from "./canvas";
import { buildDrawCommand } from "./drawCommand";
import {
	computeLightingCoefficient,
	defaultLighting,
	type LightingFn,
} from "./lighting";
import { project } from "./projection";

/**
 * Draws every particle, projecting each one from its physics state and executing the resulting draw command
 * in order.
 *
 * Does not clear the context first: a surface draws several effects onto the same canvas each frame, so it
 * clears once before drawing all of them.
 */
export function drawParticles(
	ctx: CanvasRenderingContext2D,
	particles: readonly Particle[],
	origin: Vec2,
	light: Vec3 = vec3.unitZ,
	lighting: LightingFn | null = defaultLighting,
): void {
	const normalizedLight = vec3.normalize(light);
	for (const particle of particles) {
		const transform = project(particle, origin);
		const coefficient = computeLightingCoefficient(
			particle.orientation,
			normalizedLight,
		);
		const command = buildDrawCommand(
			particle,
			transform,
			coefficient,
			lighting,
		);
		executeDrawCommand(ctx, command);
	}
}
