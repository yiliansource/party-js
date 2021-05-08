import { ParticleModifier, evaluateModifier } from "../../systems/modifiers";
import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that can be used to scale the size of a particle over its lifetime.
 */
export class SizeModifier extends ParticleModifierModule {
    /**
     * The variation controlling the size of the particle.
     */
    public size: ParticleModifier<number> = 1;
    /**
     * Applies the size over lifetime to the specified particle.
     */
    public apply(this: SizeModifier, particle: Particle): void {
        particle.size =
            particle.initialSize * evaluateModifier(this.size, particle);
    }
}
