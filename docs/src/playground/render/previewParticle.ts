import { type Color, color, type Particle, type ParticleShape } from "party-js";
import * as quat from "party-js/internal/math/quat";

export function previewParticle(
	shape: ParticleShape,
	fill: string | Color,
	size: number,
): Particle {
	return {
		position: { x: 0, y: 0, z: 0 },
		velocity: { x: 0, y: 0, z: 0 },
		orientation: quat.identity,
		angularVelocity: { x: 0, y: 0, z: 0 },
		size,
		color: color(fill),
		shape,
		age: 0,
		lifetime: Number.POSITIVE_INFINITY,
		data: new Map(),
	};
}
