import * as vec3 from "../math/vec3";
import type { Behavior } from "./behavior";

/**
 * Creates a behavior that continuously accelerates a particle downward by a constant amount, simulating gravity.
 *
 * @param strength - The downward acceleration applied per second, in px/s². A positive value pulls towards -y
 * in particle space, which is down in screen space.
 *
 * @summary Pulls particles down with a constant acceleration.
 *
 * @group Behaviors
 */
export function gravity(strength: number): Behavior {
	return (particle, ctx) => {
		particle.velocity = vec3.add(
			particle.velocity,
			vec3.scale(vec3.unitY, -strength * ctx.dt),
		);
	};
}
