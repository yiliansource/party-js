import { scene } from "../";
import { Color, Vector } from "../components";
import { Emitter } from "../particles/emitter";
import { ModuleBuilder, ModuleFunction } from "../systems/modules";
import * as random from "../systems/random";
import * as sources from "../systems/sources";
import * as variation from "../systems/variation";
import * as util from "../util";

/**
 * The configuration to apply to the confetti.
 */
export interface ConfettiConfiguration {
    count: variation.Variation<number>;
    spread: variation.Variation<number>;
    speed: variation.Variation<number>;
    size: variation.Variation<number>;
    rotation: variation.Variation<Vector>;
    color: variation.Variation<Color>;
    shapes: variation.Variation<string | HTMLElement>;
    modules: ModuleFunction[];
}

/**
 * The standard confetti template.
 *
 * @param source The source to emit the confetti from.
 * @param options The (optional) configuration overrides.
 */
export function confetti(
    source: sources.DynamicSourceType,
    options?: Partial<ConfettiConfiguration>
): Emitter {
    const populated = util.overrideDefaults(
        {
            count: variation.range(20, 40),
            spread: variation.range(35, 45),
            speed: variation.range(300, 600),
            size: variation.skew(1, 0.2),
            rotation: () => random.randomUnitVector().scale(180),
            color: () => Color.fromHsl(random.randomRange(0, 360), 100, 70),
            modules: [
                new ModuleBuilder()
                    .drive("size")
                    .by((t) => Math.min(1, t * 3))
                    .relative()
                    .build(),
                new ModuleBuilder()
                    .drive("rotation")
                    .by((t) => new Vector(140, 200, 260).scale(t))
                    .relative()
                    .build(),
            ],
            shapes: ["square", "circle"],
        },
        options
    );

    const emitter = scene.current.createEmitter({
        emitterOptions: {
            loops: 1,
            duration: 8,
            modules: populated.modules,
        },
        emissionOptions: {
            rate: 0,
            bursts: [{ time: 0, count: populated.count }],

            sourceSampler: sources.dynamicSource(source),
            angle: variation.skew(
                -90,
                variation.evaluateVariation(populated.spread)
            ),

            initialLifetime: 8,
            initialSpeed: populated.speed,
            initialSize: populated.size,
            initialRotation: populated.rotation,
            initialColor: populated.color,
        },
        rendererOptions: {
            shapeFactory: populated.shapes,
        },
    });

    return emitter;
}
