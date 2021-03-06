import { Colour } from "../components/colour";
import { Vector } from "../components/vector";

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

export function createParticle(options: ParticleCreationOptions): Particle {
    // Fill in the options, providing defaults to omitted fields.
    const filledOptions = Object.assign(
        <ParticleCreationOptions>{
            lifetime: 0,
            location: Vector.zero,
            rotation: Vector.zero,
            velocity: Vector.zero,
            colour: Colour.white,
        },
        options
    ) as Required<ParticleCreationOptions>;

    // Generate a symbolic ID and fill in the initial values.
    return <Particle>{
        id: Symbol(),

        ...filledOptions,

        initialLifetime: filledOptions.lifetime,
        initialSize: filledOptions.size,
        initialRotation: filledOptions.rotation,
    };
}
