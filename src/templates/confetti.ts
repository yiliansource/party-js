import party from "../";
import { Color, Vector } from "../components";
import { Emitter } from "../particles/emitter";
import * as modules from "../particles/modules";
import { Source } from "../particles/options";
import { ParticleModifier } from "../systems/modifiers";
import { randomRange, randomUnitVector } from "../systems/random";
import {
    evaluateVariation,
    range,
    skew,
    Variation,
} from "../systems/variation";
import { overrideDefaults } from "../util";

/**
 * The configuration to apply to the confetti.
 */
export interface ConfettiConfiguration {
    count: Variation<number>;
    spread: Variation<number>;
    speed: Variation<number>;
    size: Variation<number>;
    rotation: Variation<Vector>;
    color: Variation<Color>;
    rotationOverLifetime: ParticleModifier<Vector>;
    sizeOverLifetime: ParticleModifier<number>;
    shapes: Variation<string | HTMLElement>;
}

/**
 * The standard confetti template.
 *
 * @param source The source to emit the confetti from.
 * @param options The (optional) configuration overrides.
 */
export function confetti(
    source: Source,
    options?: Partial<ConfettiConfiguration>
): Emitter {
    const config = overrideDefaults(
        {
            count: range(20, 40),
            spread: 40,
            speed: range(300, 600),
            size: skew(1, 0.2),
            rotation: () => randomUnitVector().scale(180),
            color: () => Color.fromHsl(randomRange(0, 360), 100, 70),
            sizeOverLifetime: (p) =>
                Math.min(1, (p.initialLifetime - p.lifetime) * 3),
            rotationOverLifetime: (p) =>
                new Vector(140, 200, 260).scale(p.initialLifetime - p.lifetime),
            shapes: ["square", "circle"],
        },
        options
    );

    const emitter = party.scene.current.createEmitter({
        emitterOptions: {
            loops: 1,
            duration: 8,
        },
        emissionOptions: {
            rate: 0,
            bursts: [{ time: 0, count: config.count }],

            source,
            angle: skew(-90, evaluateVariation(config.spread)),

            initialLifetime: range(6, 8),
            initialSpeed: config.speed,
            initialSize: config.size,
            initialRotation: config.rotation,
            initialColor: config.color,
        },
        rendererOptions: {
            shapeFactory: config.shapes,
        },
    });

    const rotationModule = emitter.addModule(modules.RotationOverLifetime);
    rotationModule.rotation = config.rotationOverLifetime;

    const sizeModule = emitter.addModule(modules.SizeOverLifetime);
    sizeModule.size = config.sizeOverLifetime;

    return emitter;
}
