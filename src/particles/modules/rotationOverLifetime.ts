import { Vector } from "../../components/vector";
import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

export class RotationOverLifetimeModule implements ParticleModifierModule {
    public apply(particle: Particle): void {
        // TODO: Allow spline config
        particle.rotation = particle.initialRotation.add(
            new Vector(60, 100, 140).scale(
                particle.initialLifetime - particle.lifetime
            )
        );
    }
}
