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
     * Whether to apply gravity to the emitted particles.
     * @defaultValue true
     */
    useGravity: boolean;
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

        useGravity: true,
        maxParticles: 300,
        despawningRules: [despawningRules.lifetime, despawningRules.bounds],
    };
}
