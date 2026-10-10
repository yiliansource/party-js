import { type Color, color } from "../color/color";
import { type Quat, identity as quatIdentity } from "../math/quat";
import { type Vec3, zero as vec3Zero } from "../math/vec3";
import type { Particle } from "../particle/particle";
import { evaluateSampler } from "../samplers/helpers";
import type { Sampler, SamplerContext } from "../samplers/types";
import type { ParticleShape } from "../shapes/shape";

/**
 * @group Custom effects
 */
export interface ParticleInit {
	position?: Sampler<Vec3>;
	velocity?: Sampler<Vec3>;
	orientation?: Sampler<Quat>;
	angularVelocity?: Sampler<Vec3>;
	size: Sampler<number>;
	color: Sampler<string | Color>;
	shape: Sampler<ParticleShape>;
	lifetime: Sampler<number>;
}

const own = <T>(value: T): T => ({ ...value });

export function spawnParticle(
	init: ParticleInit,
	ctx: SamplerContext,
): Particle {
	return {
		position: own(
			init.position ? evaluateSampler(init.position, ctx) : vec3Zero,
		),
		velocity: own(
			init.velocity ? evaluateSampler(init.velocity, ctx) : vec3Zero,
		),
		orientation: own(
			init.orientation
				? evaluateSampler(init.orientation, ctx)
				: quatIdentity,
		),
		angularVelocity: own(
			init.angularVelocity
				? evaluateSampler(init.angularVelocity, ctx)
				: vec3Zero,
		),
		size: evaluateSampler(init.size, ctx),
		color: own(color(evaluateSampler(init.color, ctx))),
		shape: own(evaluateSampler(init.shape, ctx)),
		age: 0,
		lifetime: evaluateSampler(init.lifetime, ctx),
		data: new Map(),
	};
}
