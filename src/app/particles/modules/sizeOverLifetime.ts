import { Particle } from "../particle";
import { ParticleModifierModule } from "./particleModifierModule";

export class SizeOverLifetimeModule implements ParticleModifierModule {
    public apply(particle: Particle): void {
        // TODO: Allow spline config
        particle.size =
            particle.initialSize *
            Math.min(1, (particle.initialLifetime - particle.lifetime) * 2);
    }
}
