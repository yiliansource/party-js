import party from "../";
import { Color, NumericSpline, Vector } from "../components";
import { Emitter } from "../particles/emitter";
import { ModuleBuilder, ModuleFunction } from "../systems/modules";
import * as random from "../systems/random";
import * as sources from "../systems/sources";
import * as variation from "../systems/variation";

/**
 * The configuration to apply to the sparkles.
 */
export interface SparkleConfiguration {
    count: variation.Variation<number>;
    speed: variation.Variation<number>;
    size: variation.Variation<number>;
    rotation: variation.Variation<Vector>;
    color: variation.Variation<Color>;
    modules: ModuleFunction[];
}

/**
 * The standard sparkles template.
 *
 * @param source The source to emit the sparkles from.
 * @param options The (optional) configuration overrides.
 */
export function sparkles(
    source: sources.DynamicSourceType,
    options?: Partial<SparkleConfiguration>
): Emitter {
    const populated = party.util.overrideDefaults(
        {
            count: variation.range(10, 20),
            speed: variation.range(100, 200),
            size: variation.range(0.5, 1.5),
            rotation: () => new Vector(0, 0, random.randomRange(0, 360)),
            color: () => Color.fromHsl(50, 100, random.randomRange(55, 85)),
            modules: [
                new ModuleBuilder()
                    .drive("rotation")
                    .by((t) => new Vector(0, 0, 200).scale(t))
                    .build(),
                new ModuleBuilder()
                    .drive("size")
                    .by(
                        new NumericSpline(
                            { time: 0, value: 0 },
                            { time: 0.3, value: 1 },
                            { time: 0.7, value: 1 },
                            { time: 1, value: 0 }
                        )
                    )
                    .through("relativeLifetime")
                    .relative()
                    .build(),
                new ModuleBuilder()
                    .drive("opacity")
                    .by(
                        new NumericSpline(
                            { time: 0, value: 1 },
                            { time: 0.5, value: 1 },
                            { time: 1, value: 0 }
                        )
                    )
                    .through("relativeLifetime")
                    .build(),
            ],
        },
        options
    );

    const emitter = party.scene.current.createEmitter({
        emitterOptions: {
            loops: 1,
            duration: 3,
            useGravity: false,
            modules: populated.modules,
        },
        emissionOptions: {
            rate: 0,
            bursts: [{ time: 0, count: populated.count }],

            sourceSampler: sources.dynamicSource(source),
            angle: variation.range(0, 360),

            initialLifetime: variation.range(1, 2),
            initialSpeed: populated.speed,
            initialSize: populated.size,
            initialRotation: populated.rotation,
            initialColor: populated.color,
        },
        rendererOptions: {
            applyLighting: undefined,
            shapeFactory: "star",
        },
    });

    return emitter;
}
