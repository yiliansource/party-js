import { Colour } from "../components/colour";
import { Vector } from "../components/vector";
import { overrideDefaults } from "../util/config";

/**
 * Represents an emitted particle.
 */
export interface Particle {
    /**
     * The unique (symbolic) ID of the particle.
     */
    id: symbol;

    /**
     * The remaining lifetime of the particle.
     */
    lifetime: number;
    /**
     * The current size of the particle.
     */
    size: number;
    /**
     * The current location of the particle, in pixels.
     */
    location: Vector;
    /**
     * The current rotation of the particle, in euler angles, in degrees.
     */
    rotation: Vector;
    /**
     * The current velocity of the particle.
     */
    velocity: Vector;
    /**
     * The current colour of the particle.
     */
    colour: Colour;

    /**
     * The initial lifetime of the particle.
     */
    initialLifetime: number;
    /**
     * The initial size of the particle.
     */
    initialSize: number;
    /**
     * The initial rotation of the particle.
     */
    initialRotation: Vector;
}

/**
 * Represents a set of options that can be used to create the particle.
 */
export type ParticleCreationOptions = Partial<
    Omit<Particle, "id" | "initialLifetime" | "initialSize" | "initialRotation">
>;

/**
 * Creates a new particle object, using the specified creation options.
 */
export function createParticle(options: ParticleCreationOptions): Particle {
    const filledOptions = overrideDefaults(
        {
            lifetime: 0,
            size: 1,
            location: Vector.zero,
            rotation: Vector.zero,
            velocity: Vector.zero,
            colour: Colour.white,
        },
        options
    );

    // Generate an ID symbol and fill in the initial values.
    return {
        id: Symbol(),

        ...filledOptions,

        initialLifetime: filledOptions.lifetime,
        initialSize: filledOptions.size,
        initialRotation: filledOptions.rotation,
    };
}
