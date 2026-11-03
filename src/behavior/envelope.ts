import type { Particle } from "../particle/particle";
import type { Behavior } from "./behavior";
import { type Easing, linear } from "./easing";

export interface EnvelopeTarget {
	read(particle: Particle): number;
	write(particle: Particle, value: number): void;
}

export function envelope(
	target: EnvelopeTarget,
	inDuration: number,
	outDuration: number,
	ease: Easing = linear(),
): Behavior {
	const baseMap = new WeakMap<Particle, number>();
	return {
		init(particle) {
			baseMap.set(particle, target.read(particle));
		},
		update(particle) {
			const base = baseMap.get(particle) as number;
			const remaining = particle.lifetime - particle.age;
			const inFactor =
				inDuration > 0 ? Math.min(particle.age / inDuration, 1) : 1;
			const outFactor =
				outDuration > 0 ? Math.min(remaining / outDuration, 1) : 1;
			target.write(particle, base * ease(Math.min(inFactor, outFactor)));
		},
	};
}
