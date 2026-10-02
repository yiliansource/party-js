import type { Behavior } from "./behavior";
import { type Easing, linear } from "./easing";

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
