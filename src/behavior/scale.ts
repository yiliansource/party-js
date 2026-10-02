import type { Behavior } from "./behavior";
import { type Easing, linear } from "./easing";

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
