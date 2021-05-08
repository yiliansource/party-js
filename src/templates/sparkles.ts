import party from "../";
import { Colour, NumericSpline, Vector } from "../components";
import { Emitter } from "../particles/emitter";
import * as modules from "../particles/modules";
import { Source } from "../particles/options";
import { ParticleModifier } from "../systems/modifiers";
import { randomRange } from "../systems/random";
import { range, Variation } from "../systems/variation";
import { overrideDefaults } from "../util";

/**
 * The configuration to apply to the sparkles.
 */
export interface SparkleConfiguration {
    count: Variation<number>;
    speed: Variation<number>;
    size: Variation<number>;
    rotation: Variation<Vector>;
    colour: Variation<Colour>;
    rotationOverLifetime: ParticleModifier<Vector>;
    sizeOverLifetime: ParticleModifier<number>;
}

/**
 * The standard sparkles template.
 *
 * @param source The source to emit the sparkles from.
 * @param options The (optional) configuration overrides.
 */
export function sparkles(
    source: Source,
    options?: Partial<SparkleConfiguration>
): Emitter {
    const config = overrideDefaults(
        {
            count: range(10, 20),
            speed: range(100, 200),
            size: range(0.5, 1.5),
            rotation: () => new Vector(0, 0, randomRange(0, 360)),
            colour: () => Colour.fromHsl(50, 100, randomRange(55, 85)),
            sizeOverLifetime: new NumericSpline(
                { time: 0, value: 0 },
                { time: 0.3, value: 1 },
                { time: 0.7, value: 1 },
                { time: 1, value: 0 }
            ),
            rotationOverLifetime: (p) =>
                new Vector(0, 0, 200).scale(p.initialLifetime - p.lifetime),
        },
        options
    );

    const emitter = party.scene.current.createEmitter({
        emitterOptions: {
            loops: 1,
            duration: 3,
            useGravity: false,
        },
        emissionOptions: {
            rate: 0,
            bursts: [{ time: 0, count: config.count }],

            source,
            angle: range(0, 360),

            initialLifetime: range(1, 2),
            initialSpeed: config.speed,
            initialSize: config.size,
            initialRotation: config.rotation,
            initialColour: config.colour,
        },
        rendererOptions: {
            applyLighting: undefined,
            shapeFactory: "star",
        },
    });

    const rotationModule = emitter.addModule(modules.RotationModifier);
    rotationModule.rotation = config.rotationOverLifetime;

    const sizeModule = emitter.addModule(modules.SizeModifier);
    sizeModule.size = config.sizeOverLifetime;

    return emitter;
}
