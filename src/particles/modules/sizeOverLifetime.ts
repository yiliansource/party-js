import {
    ParticleModifier,
    evaluateModifierViaLifetime,
} from "../../systems/modifiers";
import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that can be used to scale the size of a particle over its lifetime.
 */
export class SizeOverLifetime extends ParticleModifierModule {
    /**
     * The variation controlling the size of the particle.
     */
    public size: ParticleModifier<number> = 1;
    /**
     * Applies the size over lifetime to the specified particle.
     */
    public apply(this: SizeOverLifetime, particle: Particle): void {
        particle.size =
            particle.initialSize *
            evaluateModifierViaLifetime(this.size, particle);
    }
}
