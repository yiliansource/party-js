import { Color, Rect, Vector } from "../../components";
import { Variation } from "../../systems/variation";

/**
 * Represents a junction of types that can be used as particle system sources.
 */
export type Source = Rect | HTMLElement | MouseEvent;

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
     * @defaultValue An empty array.
     */
    bursts: Burst[];

    /**
     * The area that particles will be emitted from.
     *
     * @defaultValue A zero-sized rect at (0, 0).
     */
    source: Source;
    /**
     * The angle that particles will be emitted at, in degrees. This is used to, for example,
     * give the particles a particular amount of initial force in a direction.
     *
     * @defaultValue 0
     */
    angle: Variation<number>;

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
     * @defaultValue 1
     */
    initialSize: Variation<number>;
    /**
     * The variable, initial rotation of the emitted particles, as euler angles.
     * @defaultValue `Vector.zero`
     */
    initialRotation: Variation<Vector>;
    /**
     * The variable, initial color of the emitted particles.
     * @defaultValue `Color.white`
     */
    initialColor: Variation<Color>;
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

        angle: 0,
        bursts: [],
        source: new Rect(),

        initialLifetime: 5,
        initialSpeed: 5,
        initialSize: 1,
        initialRotation: Vector.zero,
        initialColor: Color.white,
    };
}
