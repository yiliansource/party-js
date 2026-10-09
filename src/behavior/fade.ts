import type { Behavior } from "./behavior";
import { type Easing, linear } from "./easing";

/**
 * Creates a behavior that fades a particle's opacity in and out over the specified durations.
 *
 * The fade-in takes place during the first `inDuration` seconds of a particle's lifetime, while
 * the fade-out happens during the last `outDuration` seconds of the particle's lifetime. The
 * supplied easing is applied forwards when fading in, and in reverse when fading out.
 *
 * @param inDuration - The duration in seconds it takes for the particle to fade in fully, or
 * 0 if no fade-in should be applied.
 * @param outDuration - The duration in seconds it takes for the particle to fade out fully, or
 * 0 if no fade-out should be applied.
 * @param ease - How the transition progresses. Defaults to {@link linear | linear()}.
 *
 * @summary Fades a particle in and out.
 *
 * @group Behaviors
 */
export function fade(
	inDuration: number,
	outDuration: number,
	ease: Easing = linear(),
): Behavior {
	const BASE_ALPHA = Symbol("color.baseAlpha");

	return {
		init(particle) {
			particle.data.set(BASE_ALPHA, particle.color.alpha);
		},
		update(particle) {
			const base = particle.data.get(BASE_ALPHA) as number;
			const remaining = particle.lifetime - particle.age;

			const inFactor =
				inDuration > 0 ? Math.min(particle.age / inDuration, 1) : 1;
			const outFactor =
				outDuration > 0 ? Math.min(remaining / outDuration, 1) : 1;

			particle.color = {
				...particle.color,
				alpha: base * ease(Math.min(inFactor, outFactor)),
			};
		},
	};
}
