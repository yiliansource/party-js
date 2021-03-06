import { Particle } from "../particle";

/**
 * Represents a module that can be used to modify the
 * properties of a particle over time.
 */
export interface ParticleModifierModule {
    /**
     * Applies the effects of the module to the particle.
     *
     * @param particle The particle to apply the effects to.
     */
    apply(particle: Particle): void;
}
