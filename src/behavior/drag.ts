import * as vec3 from "../math/vec3";
import type { Behavior } from "./behavior";

/**
 * Creates a behavior that applies quadratic drag, decelerating a particle towards a terminal
 * velocity rather than damping it at a fixed rate.
 *
 * @param coefficient - The acceleration-level drag coefficient, measured in 1/px.
 * When gravity is present, this should usually be calculated as `gravity / terminalVelocity ** 2`.
 * Values between 0.0005 and 0.02 are usually sensible.
 *
 * @summary Slows particles down, more strongly the faster they move.
 *
 * @see http://hyperphysics.phy-astr.gsu.edu/hbase/Mechanics/quadvfall.html
 *
 * @group Behaviors
 */
export function drag(coefficient: number): Behavior {
	return {
		update(particle, ctx) {
			const speed = vec3.length(particle.velocity);
			const multiplier = 1 - Math.min(coefficient * speed * ctx.dt, 1);
			particle.velocity = vec3.scale(particle.velocity, multiplier);
		},
	};
}
