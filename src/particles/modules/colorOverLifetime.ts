import { Color } from "../../components";
import {
    ParticleModifier,
    evaluateModifierViaLifetime,
} from "../../systems/modifiers";
import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that can be used to change the color of a particle over its lifetime.
 */
export class ColorOverLifetime extends ParticleModifierModule {
    /**
     * The variation controlling the color of the particle.
     */
    public color: ParticleModifier<Color> = Color.white;
    /**
     * Applies the color over lifetime to the specified particle.
     */
    public apply(particle: Particle): void {
        particle.color = evaluateModifierViaLifetime(this.color, particle);
    }
}
