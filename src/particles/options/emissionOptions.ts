import { Variation } from "../../systems/customization";

/**
 * Holds a set of options used to configure the way particles are emitted in.
 */
export interface EmissionOptions {
    /**
     * The number of particles that should be emitted per second.
     * @defaultValue 10
     */
    rate: number;
    /**
     * The bursts that particles should be bulk-emitted at.
     * @defaultValue []
     */
    bursts: Burst[];
}

/**
 * Represents a burst of emitted particles.
 */
export interface Burst {
    /**
     * The time to perform the burst at. This must be less than the duration of the emitter.
     */
    time: number;
    /**
     * The variable number of particles that should be emitted.
     */
    count: Variation<number>;
    /**
     * The (optional) likelihood that the burst will activate, from 0 (never) to 1 (always).
     */
    probability?: number;
}

/**
 * Returns the default set of emission options.
 */
export function getDefaultEmissionOptions(): EmissionOptions {
    return {
        rate: 10,
        bursts: [],
    };
}
