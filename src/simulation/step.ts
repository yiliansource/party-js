import {
	applyBehavior,
	type Behavior,
	type BehaviorUpdateContext,
} from "../behavior/behavior";
import { advanceLifecycle, isDead } from "../particle/lifecycle";
import type { Particle } from "../particle/particle";
import { integrate } from "../physics/integrate";

export function stepParticles(
	particles: Particle[],
	behaviors: Behavior[],
	ctx: BehaviorUpdateContext,
): void {
	for (const particle of particles) {
		advanceLifecycle(particle, ctx.dt);
		if (isDead(particle)) continue;

		for (const behavior of behaviors) {
			applyBehavior(behavior, particle, ctx);
		}

		integrate(particle, ctx.dt);
	}
}
