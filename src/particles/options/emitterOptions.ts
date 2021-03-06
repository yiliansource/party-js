import { Colour } from "../../components/colour";
import { Vector } from "../../components/vector";
import { Variation } from "../../systems/customization";
import { despawningRules } from "../../util/rules";
import { Particle } from "../particle";

/**
 * Represents a rule that decides whether a particle should be despawned or not.
 */
export type ParticleDespawnRule = (particle: Particle) => boolean;

/**
 * Holds a set of options that control the basic functionality of an emitter.
 */
export interface EmitterOptions {
    /**
     * The duration of one emission cycle.
     * @defaultValue 5
     */
    duration: number;
    /**
     * The number of loops that should be performed. Negative numbers result in infinite loops.
     * @defaultValue -1
     */
    loops: number;

    /**
     * The variable, initial lifetime of the emitted particle.
     * @defaultValue 5
     */
    initialLifetime: Variation<number>;
    /**
     * The variable, initial speed of the emitted particles.
     * @defaultValue 5
     */
    initialSpeed: Variation<number>;
    /**
     * The variable, initial size of the emitted particles.
     * @defaultValue 5
     */
    initialSize: Variation<number>;
    /**
     * The variable, initial rotation of the emitted particles, as euler angles.
     * @defaultValue `Vector.zero`
     */
    initialRotation: Variation<Vector>;
    /**
     * The variable, initial colour of the emitted particles.
     * @defaultValue `Color.white`
     */
    initialColour: Variation<Colour>;

    /**
     * The maximum number of particles that may be active in the current emitter.
     * @defaultValue 300
     */
    maxParticles: number;
    /**
     * The rules used to determine when particles should be despawned.
     *
     * @remarks
     * Note that if this array is reset, the particles will never be despawned by the
     * emitter, and will only be cleared once the system is destroyed.
     *
     * @defaultValue Despawns particles when their lifetime is over or when they leave the document bounds.
     */
    despawningRules: ParticleDespawnRule[];
}

/**
 * Returns the default set of emitter options.
 */
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
