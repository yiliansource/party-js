import { scene } from "..";
import { Color, NumericSpline, Vector } from "../components";
import { Emitter } from "../particles/emitter";
import { ModuleBuilder, ModuleFunction } from "../systems/modules";
import * as random from "../systems/random";
import * as sources from "../systems/sources";
import * as variation from "../systems/variation";
import * as util from "../util";

/**
 * The configuration to apply to the sparkles.
 */
export interface SparkleConfiguration {
    lifetime: variation.Variation<number>;
    count: variation.Variation<number>;
    speed: variation.Variation<number>;
    size: variation.Variation<number>;
    rotation: variation.Variation<Vector>;
    color: variation.Variation<Color>;
    shapes: variation.Variation<string | HTMLElement>;
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
    const populated = util.overrideDefaults(
        {
            lifetime: variation.range(1, 2),
            count: variation.range(10, 20),
            speed: variation.range(100, 200),
            size: variation.range(0.8, 1.8),
            rotation: () => new Vector(0, 0, random.randomRange(0, 360)),
            color: () => Color.fromHsl(50, 100, random.randomRange(55, 85)),
            modules: [
                new ModuleBuilder()
                    .drive("rotation")
                    .by((t) => new Vector(0, 0, 200).scale(t))
                    .relative()
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
            shapes: "star",
        },
        options
    );

    const emitter = scene.current.createEmitter({
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

            initialLifetime: populated.lifetime,
            initialSpeed: populated.speed,
            initialSize: populated.size,
            initialRotation: populated.rotation,
            initialColor: populated.color,
        },
        rendererOptions: {
            applyLighting: undefined,
            shapeFactory: populated.shapes,
        },
    });

    return emitter;
}
