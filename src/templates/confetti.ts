import {
    Colour,
    Emitter,
    Rect,
    Source,
    modules,
    random,
    range,
    sourceToRect,
} from "../";
import { scene } from "..";

/**
 * The configuration to apply to the confetti.
 */
export interface ConfettiConfiguration {
    count: number;
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
    const rect: Rect = sourceToRect(source);
    const emitter = scene.createEmitter();

    // Apply configuration defaults.
    const config = Object.assign(
        {},
        <ConfettiConfiguration>{
            count: 100,
        },
        options
    );

    emitter.options.loops = 1;
    emitter.options.duration = 10;
    emitter.options.initialLifetime = range(6, 8);
    emitter.options.initialSpeed = range(300, 500);
    emitter.options.initialSize = range(0.8, 1.2);
    emitter.options.initialRotation = () =>
        random.randomUnitVector().scale(180);
    emitter.options.initialColour = () =>
        Colour.fromHsl(random.randomRange(0, 360), 100, 70);

    emitter.emission.rate = 0;
    emitter.emission.bursts.push({
        time: 0,
        count: range(20, 40),
    });

    emitter.shape.angle = range(-50, -130);
    emitter.shape.source = rect;

    emitter.modules.push(new modules.RotationOverLifetimeModule());
    emitter.modules.push(new modules.SizeOverLifetimeModule());

    return emitter;
}
