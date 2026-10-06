import type { Vec2 } from "../math/vec2";
import type { Vec3 } from "../math/vec3";
import * as vec3 from "../math/vec3";
import type { Particle } from "../particle/particle";
import { executeDrawCommand } from "./canvas";
import { buildDrawCommand } from "./drawCommand";
import { computeLightingCoefficient, defaultLighting } from "./lighting";
import { project } from "./projection";

/**
 * Clears the context and draws every particle, projecting each one from its
 * physics state and executing the resulting draw command in order.
 */
export function drawFrame(
	ctx: CanvasRenderingContext2D,
	particles: readonly Particle[],
	origin: Vec2,
	width: number,
	height: number,
	light: Vec3 = vec3.unitZ,
	lighting = defaultLighting,
): void {
	ctx.clearRect(0, 0, width, height);

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
