import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that can be used to scale the size of a particle over its lifetime.
 */
export class SizeOverLifetimeModule implements ParticleModifierModule {
    /**
     * Applies the size over lifetime to the specified particle.
     */
    public apply(particle: Particle): void {
        // TODO: Allow spline config
        const elapsedLifetime = particle.initialLifetime - particle.lifetime;
        particle.size = particle.initialSize * Math.min(1, elapsedLifetime * 2);
    }
}
