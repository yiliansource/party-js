import { Color, Vector } from "../components";
import { overrideDefaults } from "../util/config";

/**
 * Represents a set of options that can be used to create the particle.
 */
export type ParticleCreationOptions = Partial<
    Omit<Particle, "id" | "initialLifetime" | "initialSize" | "initialRotation">
>;

/**
 * Represents an emitted particle.
 */
export class Particle {
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
     * The current color of the particle.
     */
    color: Color;
    /**
     * The opacity of the particle (from 0 to 1).
     */
    opacity: number;

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

    /**
     * Creates a new particle instance through the specified options.
     */
    constructor(options: ParticleCreationOptions) {
        const populatedOptions = overrideDefaults(
            {
                lifetime: 0,
                size: 1,
                location: Vector.zero,
                rotation: Vector.zero,
                velocity: Vector.zero,
                color: Color.white,
                opacity: 1,
            },
            options
        );

        // Generate a symbolic ID.
        this.id = Symbol();

        // Assign various properties, together with some initials for later reference.
        this.size = this.initialSize = populatedOptions.size;
        this.lifetime = this.initialLifetime = populatedOptions.lifetime;
        this.rotation = this.initialRotation = populatedOptions.rotation;

        this.location = populatedOptions.location;
        this.velocity = populatedOptions.velocity;
        this.color = populatedOptions.color;
        this.opacity = populatedOptions.opacity;
    }
}
