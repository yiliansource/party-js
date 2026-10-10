import { type Color, color } from "../color/color";
import type { Quat } from "../math/quat";
import type { Vec3 } from "../math/vec3";
import type { Particle } from "../particle/particle";
import { evaluateSampler } from "../samplers/helpers";
import type { Sampler, SamplerContext } from "../samplers/types";
import type { ParticleShape } from "../shapes/shape";

/**
 * @group Custom effects
 */
export interface ParticleInit {
	position: Sampler<Vec3>;
	velocity: Sampler<Vec3>;
	orientation: Sampler<Quat>;
	angularVelocity: Sampler<Vec3>;
	size: Sampler<number>;
	color: Sampler<string | Color>;
	shape: Sampler<ParticleShape>;
	lifetime: Sampler<number>;
}

export function spawnParticle(
	init: ParticleInit,
	ctx: SamplerContext,
): Particle {
	return {
		position: evaluateSampler(init.position, ctx),
		velocity: evaluateSampler(init.velocity, ctx),
		orientation: evaluateSampler(init.orientation, ctx),
		angularVelocity: evaluateSampler(init.angularVelocity, ctx),
		size: evaluateSampler(init.size, ctx),
		color: color(evaluateSampler(init.color, ctx)),
		shape: evaluateSampler(init.shape, ctx),
		age: 0,
		lifetime: evaluateSampler(init.lifetime, ctx),
		data: new Map(),
	};
}
