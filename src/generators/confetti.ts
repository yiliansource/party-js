import { scene } from "../../src";
import { RotationOverLifetimeModule } from "../app/particles/modules/rotationOverLifetime";
import { SizeOverLifetimeModule } from "../app/particles/modules/sizeOverLifetime";
import { Colour } from "../components/colour";
import { Rect } from "../components/rect";
import { range } from "../systems/customization";
import { random, randomUnitVector } from "../systems/random";
import { Source, sourceToRect } from "../util/source";

export interface ConfettiConfiguration {
    count: number;
}

export function confetti(
    source: Source,
    options?: Partial<ConfettiConfiguration>
): void {
    const rect: Rect = sourceToRect(source);
    const system = scene.createParticleSystem();

    const config = Object.assign(
        {},
        <ConfettiConfiguration>{
            count: 100,
        },
        options
    );

    system.options.loops = 1;
    system.options.duration = 10;
    system.options.initialLifetime = range(6, 8);
    system.options.initialSpeed = range(300, 500);
    system.options.initialSize = range(0.8, 1.2);
    system.options.initialRotation = () => randomUnitVector().scale(180);
    system.options.initialColour = () =>
        Colour.fromHsl(random(0, 360), 100, 70);

    system.emission.rate = 0;
    system.emission.bursts.push({
        time: 0,
        count: range(20, 40),
    });

    system.shape.angle = range(-50, -130);
    system.shape.source = rect;

    system.modules.push(new RotationOverLifetimeModule());
    system.modules.push(new SizeOverLifetimeModule());
}
