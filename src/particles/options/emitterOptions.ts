import { Colour } from "../../components/colour";
import { Vector } from "../../components/vector";
import { Variation } from "../../systems/customization";
import { despawningRules } from "../../util/rules";
import { Particle } from "../particle";

export type ParticleDespawnRule = (particle: Particle) => boolean;

export interface EmitterOptions {
    duration: number;
    loops: number;

    initialLifetime: Variation<number>;
    initialSpeed: Variation<number>;
    initialSize: Variation<number>;
    initialRotation: Variation<Vector>;
    initialColour: Variation<Colour>;

    maxParticles: number;
    despawningRules: ParticleDespawnRule[];
}

export function getDefaultEmitterOptions(): EmitterOptions {
    return {
        duration: 5,
        loops: -1,

        initialLifetime: 5,
        initialSpeed: 5,
        initialSize: 1,
        initialRotation: Vector.zero,
        initialColour: Colour.white,

        maxParticles: 300,
        despawningRules: [
            despawningRules.lifetimeDespawn,
            despawningRules.boundsDespawn,
        ],
    };
}
