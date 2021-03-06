import { Vector } from "../../components/vector";
import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

/**
 * Represents a module that rotates a particle consistently over it's lifetime.
 */
export class RotationOverLifetimeModule implements ParticleModifierModule {
    /**
     * Applies the rotation over lifetime to the specified particle.
     */
    public apply(particle: Particle): void {
        // TODO: Allow spline config
        const elapsedLifetime = particle.initialLifetime - particle.lifetime;
        particle.rotation = particle.initialRotation.add(
            new Vector(60, 100, 140).scale(elapsedLifetime)
        );
    }
}
