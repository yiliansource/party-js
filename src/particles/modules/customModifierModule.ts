import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that allows a custom modifier implementation.
 */
export class CustomModifier extends ParticleModifierModule {
    /**
     * The modifier function controlling the particles.
     */
    public modifier?: (particle: Particle) => void = undefined;
    /**
     * Applies the modifier function to the specified particle.
     */
    public apply(particle: Particle): void {
        this.modifier && this.modifier(particle);
    }
}
