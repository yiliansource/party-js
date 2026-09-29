import type { Color } from "../color/color";
import type { Quat } from "../math/quat";
import type { Vec3 } from "../math/vec3";
import type { Particle } from "../particle/particle";
import { evaluate } from "../samplers/helpers";
import type { Sampler, SamplerContext } from "../samplers/types";
import type { ParticleShape } from "../shapes/shape";

export interface ParticleInit {
	position: Sampler<Vec3>;
	velocity: Sampler<Vec3>;
	orientation: Sampler<Quat>;
	angularVelocity: Sampler<Vec3>;
	size: Sampler<number>;
	color: Sampler<Color>;
	shape: Sampler<ParticleShape>;
	lifetime: Sampler<number>;
}

export function spawnParticle(
	init: ParticleInit,
	ctx: SamplerContext,
): Particle {
	return {
		position: evaluate(init.position, ctx),
		velocity: evaluate(init.velocity, ctx),
		orientation: evaluate(init.orientation, ctx),
		angularVelocity: evaluate(init.angularVelocity, ctx),
		size: evaluate(init.size, ctx),
		color: evaluate(init.color, ctx),
		shape: evaluate(init.shape, ctx),
		age: 0,
		lifetime: evaluate(init.lifetime, ctx),
		data: new Map(),
	};
}
