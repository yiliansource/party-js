import type { Color } from "../color";
import type { Quat } from "../math/quat";
import type { Vec3 } from "../math/vec3";

export type ParticleShape = unknown; // TODO

export interface Particle {
	position: Vec3;
	velocity: Vec3;
	orientation: Quat;
	angularVelocity: Vec3;
	size: number;
	color: Color;
	shape: ParticleShape;
	age: number;
	lifetime: number;
	data: Map<symbol, unknown>;
}
