import * as quat from "../math/quat";
import * as vec3 from "../math/vec3";
import type { Particle } from "../particle/particle";

export function integrate(particle: Particle, dt: number): void {
	particle.position = vec3.add(
		particle.position,
		vec3.scale(particle.velocity, dt),
	);
	particle.orientation = quat.integrate(
		particle.orientation,
		particle.angularVelocity,
		dt,
	);
}
