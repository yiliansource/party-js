import { Vector } from "../../components";
import {
    ParticleModifier,
    evaluateModifierViaLifetime,
} from "../../systems/modifiers";
import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that rotates a particle consistently over its lifetime.
 */
export class RotationOverLifetime extends ParticleModifierModule {
    /**
     * The variation controlling the rotation of the particle.
     */
    public rotation: ParticleModifier<Vector> = Vector.zero;
    /**
     * Applies the rotation over lifetime to the specified particle.
     */
    public apply(particle: Particle): void {
        particle.rotation = particle.initialRotation.add(
            evaluateModifierViaLifetime(this.rotation, particle)
        );
    }
}
