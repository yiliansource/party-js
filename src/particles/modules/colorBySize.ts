import { Color } from "../../components";
import {
    evaluateModifierViaSize,
    ParticleModifier,
} from "../../systems/modifiers";
import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that can be used to change the color of a particle via its current size.
 *
 * @remarks
 * The size of the particle is given as the parameter to determine the color.
 * Note that the default size is 1.
 */
export class ColorBySize extends ParticleModifierModule {
    /**
     * The variation controlling the color of the particle.
     */
    public color: ParticleModifier<Color> = Color.white;
    /**
     * Applies the color by size to the specified particle.
     */
    public apply(particle: Particle): void {
        particle.color = evaluateModifierViaSize(this.color, particle);
    }
}
