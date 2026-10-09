import type { Behavior } from "./behavior";
import { type Easing, linear } from "./easing";

/**
 * Creates a behavior that grows a particle from 0 to its sampled size and shrinks it back
 * to 0 over the specified durations.
 *
 * The growing takes place during the first `inDuration` seconds of a particle's lifetime, while
 * the shrinking happens during the last `outDuration` seconds of the particle's lifetime. The
 * supplied easing is applied forwards when growing, and in reverse when shrinking.
 *
 * @param inDuration - The duration in seconds it takes for the particle to grow from 0 to its
 * sampled size, or 0 if it should start at its sampled size.
 * @param outDuration - The duration in seconds it takes for the particle to shrink back to 0,
 * or 0 if it should end at its sampled size.
 * @param ease - How the transition progresses. Defaults to {@link linear | linear()}.
 *
 * @summary Scales a particle in and out.
 *
 * @group Behaviors
 */
export function scale(
	inDuration: number,
	outDuration: number,
	ease: Easing = linear(),
): Behavior {
	const BASE_SIZE = Symbol("scale.baseSize");

	return {
		init(particle) {
			particle.data.set(BASE_SIZE, particle.size);
		},
		update(particle) {
			const base = particle.data.get(BASE_SIZE) as number;
			const remaining = particle.lifetime - particle.age;

			const inFactor =
				inDuration > 0 ? Math.min(particle.age / inDuration, 1) : 1;
			const outFactor =
				outDuration > 0 ? Math.min(remaining / outDuration, 1) : 1;

			particle.size = base * ease(Math.min(inFactor, outFactor));
		},
	};
}
