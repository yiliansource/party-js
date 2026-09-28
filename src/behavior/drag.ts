import * as vec3 from "../math/vec3";
import type { Behavior } from "./behavior";

/**
 * Creates a behavior that applies quadratic drag, decelerating a particle towards
 * a target terminal velocity rather than damping it at a fixed rate.
 *
 * @param terminalVelocity The speed (in units/s) the particle asymptotically approaches under this drag and the given gravity.
 * @param gravity The downward acceleration (in units/s²) this terminal velocity is calibrated against, which should match the
 *                strength passed to the gravity() behavior.
 *
 * @see http://hyperphysics.phy-astr.gsu.edu/hbase/Mechanics/quadvfall.html
 */
export function drag(terminalVelocity: number, gravity: number): Behavior {
	const k = gravity / terminalVelocity ** 2;
	return {
		update(particle, ctx) {
			const speed = vec3.length(particle.velocity);
			const multiplier = 1 - Math.min(k * speed * ctx.dt, 1);
			particle.velocity = vec3.scale(particle.velocity, multiplier);
		},
	};
}
