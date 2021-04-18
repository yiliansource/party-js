import { Vector } from "../../components/vector";
import { ParticleModifier, evaluateModifier } from "../../systems/modifiers";
import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that rotates a particle consistently over it's lifetime.
 */
export class RotationModifier extends ParticleModifierModule {
    /**
     * The variation controlling the rotation of the particle.
     */
    public rotation: ParticleModifier<Vector> = Vector.zero;
    /**
     * Applies the rotation over lifetime to the specified particle.
     */
    public apply(particle: Particle): void {
        particle.rotation = particle.initialRotation.add(
            evaluateModifier(this.rotation, particle)
        );
    }
}
