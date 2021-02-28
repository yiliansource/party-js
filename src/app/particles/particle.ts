import { Colour } from "../../components/colour";
import { Vector } from "../../components/vector";

export interface Particle {
    id: symbol;

    lifetime: number;
    size: number;
    location: Vector;
    rotation: Vector;
    velocity: Vector;
    colour: Colour;

    initialLifetime: number;
    initialSize: number;
    initialRotation: Vector;
}

export type ParticleCreationOptions = Partial<
    Omit<Particle, "id" | "initialLifetime" | "initialSize" | "initialRotation">
>;

export function createParticle(options: ParticleCreationOptions): Particle {
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

    return <Particle>{
        id: Symbol(),

        ...filledOptions,

        initialLifetime: filledOptions.lifetime,
        initialSize: filledOptions.size,
        initialRotation: filledOptions.rotation,
    };
}
