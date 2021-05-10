import {
    ParticleModifier,
    evaluateModifierViaLifetime,
} from "../../systems/modifiers";
import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that changes the opacity of a particle over its lifetime.
 */
export class OpacityOverLifetime extends ParticleModifierModule {
    /**
     * The variation controlling the opacity of the particle.
     */
    public opacity: ParticleModifier<number> = 1;
    /**
     * Applies the opacity over lifetime to the specified particle.
     */
    public apply(particle: Particle): void {
        particle.opacity = evaluateModifierViaLifetime(this.opacity, particle);
    }
}
