import { clamp01 } from "../math/scalar";
import type { Particle } from "./particle";

export function advanceLifecycle(particle: Particle, dt: number): void {
	particle.age += dt;
}

export function progress(particle: Particle): number {
	return clamp01(particle.age / particle.lifetime);
}

export function isDead(particle: Particle): boolean {
	return particle.age >= particle.lifetime;
}
