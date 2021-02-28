import { Colour } from "../../components/colour";
import { Vector } from "../../components/vector";
import { getVariationValue } from "../../systems/customization";
import {
    random,
    randomInsideRect,
    randomUnitVector,
} from "../../systems/random";
import { globals } from "../globals";
import { ParticleModifierModule } from "./modules/particleModifierModule";
import {
    EmissionOptions,
    ShapeOptions,
    SystemOptions,
    getDefaultEmissionOptions,
    getDefaultShapeOptions,
    getDefaultSystemOptions,
} from "./options";
import { Particle, createParticle } from "./particle";

export class ParticleSystem {
    public readonly particles: Array<Particle> = [];
    public readonly modules: Array<ParticleModifierModule> = [];

    public readonly options: SystemOptions;
    public readonly emission: EmissionOptions;
    public readonly shape: ShapeOptions;

    private durationTimer = 0;
    private emissionTimer = 0;
    private currentLoop = 0;
    private attemptedBurstIndices: Array<number> = [];

    public get isExpired(): boolean {
        if (this.options.loops < 0) {
            return false;
        }
        return this.currentLoop >= this.options.loops;
    }

    constructor() {
        this.options = getDefaultSystemOptions();
        this.emission = getDefaultEmissionOptions();
        this.shape = getDefaultShapeOptions();
    }

    public tick(delta: number): void {
        this.durationTimer += delta;
        if (this.durationTimer >= this.options.duration) {
            this.currentLoop++;

            if (this.isExpired) {
                return;
            }

            this.durationTimer = 0;
            this.attemptedBurstIndices = [];
        }

        let burstIndex = 0;
        for (const burst of this.emission.bursts) {
            if (!this.attemptedBurstIndices.includes(burstIndex)) {
                if (burst.time <= this.durationTimer) {
                    const count = getVariationValue(burst.count);
                    for (let i = 0; i < count; i++) {
                        this.emitParticle();
                    }
                    this.attemptedBurstIndices.push(burstIndex);
                }
            }
            burstIndex++;
        }

        this.emissionTimer += delta;
        const delay = 1 / this.emission.rate;
        while (this.emissionTimer > delay) {
            this.emissionTimer -= delay;
            this.emitParticle();
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            this.tickParticle(particle, delta);

            if (this.options.despawningRules.some((rule) => rule(particle))) {
                this.particles.splice(i, 1);
            }
        }
    }

    private tickParticle(particle: Particle, delta: number): void {
        particle.lifetime -= delta;

        particle.velocity = particle.velocity.add(
            Vector.up.scale(globals.gravity * delta)
        );
        particle.location = particle.location.add(
            particle.velocity.scale(delta)
        );

        for (const module of this.modules) {
            module.apply(particle);
        }
    }

    private emitParticle(): Particle {
        const particle: Particle = createParticle({
            location: randomInsideRect(this.shape.source),
            lifetime: getVariationValue(this.options.initialLifetime),
            velocity: Vector.from2dAngle(
                getVariationValue(this.shape.angle)
            ).scale(getVariationValue(this.options.initialSpeed)),
            size: getVariationValue(this.options.initialSize),
            rotation: getVariationValue(this.options.initialRotation),
            colour: getVariationValue(this.options.initialColour),
        });
        this.particles.push(particle);

        return particle;
    }
}
