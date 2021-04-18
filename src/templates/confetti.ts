import { Colour, Vector } from "../components";
import { Emitter } from "../particles/emitter";
import { ParticleModifier } from "../systems/modifiers";
import {
    Variation,
    evaluateVariation,
    range,
    skew,
} from "../systems/variation";
import { Source, sourceToRect } from "../util";
import { overrideDefaults } from "../util/config";
import { modules, random, scene } from "..";

/**
 * The configuration to apply to the confetti.
 */
export interface ConfettiConfiguration {
    count: Variation<number>;
    spread: Variation<number>;
    speed: Variation<number>;
    size: Variation<number>;
    rotation: Variation<Vector>;
    colour: Variation<Colour>;
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
            rotation: () => random.randomUnitVector().scale(180),
            colour: () => Colour.fromHsl(random.randomRange(0, 360), 100, 70),
            sizeOverLifetime: (p) =>
                Math.min(1, (p.initialLifetime - p.lifetime) * 3),
            rotationOverLifetime: (p) =>
                new Vector(140, 200, 260).scale(p.initialLifetime - p.lifetime),
            shapes: ["square", "circle"],
        },
        options
    );

    const rect = sourceToRect(source);
    const emitter = scene.createEmitter({
        emitterOptions: {
            loops: 1,
            duration: 8,
            initialLifetime: range(6, 8),
            initialSpeed: config.speed,
            initialSize: config.size,
            initialRotation: config.rotation,
            initialColour: config.colour,
        },
        emissionOptions: {
            rate: 0,
            bursts: [{ time: 0, count: config.count }],
        },
        shapeOptions: {
            angle: skew(-90, evaluateVariation(config.spread)),
            source: rect,
        },
        rendererOptions: {
            shapeFactory: config.shapes,
        },
    });

    const rotationModule = emitter.addModule(modules.RotationModifier);
    rotationModule.rotation = config.rotationOverLifetime;

    const sizeModule = emitter.addModule(modules.SizeModifier);
    sizeModule.size = config.sizeOverLifetime;

    return emitter;
}
