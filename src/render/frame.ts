import type { Particle } from "../particle/particle";
import { executeDrawCommand } from "./canvas";
import { buildDrawCommand } from "./drawCommand";
import { type ProjectionOrigin, project } from "./projection";

/**
 * Clears the context and draws every particle, projecting each one from its
 * physics state and executing the resulting draw command in order.
 */
export function drawFrame(
	ctx: CanvasRenderingContext2D,
	particles: readonly Particle[],
	origin: ProjectionOrigin,
	width: number,
	height: number,
): void {
	ctx.clearRect(0, 0, width, height);

	for (const particle of particles) {
		const transform = project(particle, origin);
		const command = buildDrawCommand(particle, transform);
		executeDrawCommand(ctx, command);
	}
}
