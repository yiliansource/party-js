import { Particle } from "../particle";

export interface ParticleModifierModule {
    apply(particle: Particle): void;
}
