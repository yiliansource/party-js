import { Vector } from "../components/vector";
import { settings } from "../settings";
import { evaluateVariation } from "../systems/variation";
import { overrideDefaults } from "../util/config";
import {
    EmissionOptions,
    EmitterOptions,
    RenderOptions,
    getDefaultEmissionOptions,
    getDefaultEmitterOptions,
    getDefaultRendererOptions,
} from "./options";
import { Particle } from "./particle";

/**
 * Defines the set of options that can be used when creating a new emitter.
 */
export interface EmitterConstructionOptions {
    emitterOptions?: Partial<EmitterOptions>;
    emissionOptions?: Partial<EmissionOptions>;
    rendererOptions?: Partial<RenderOptions>;
}

/**
 * Represents an emitter that is responsible for spawning and updating particles.
 *
 * Particles themselves are just data-holders, with the system acting upon them and
 * modifying them. The modifications are done mainly via modules, that use the
 * particle's data together with some function to apply temporal transitions.
 *
 * @see Particle
 * @see ParticleModifierModule
 */
export class Emitter {
    /**
     * The particles currently contained within the system.
     */
    public readonly particles: Particle[] = [];

    /**
     * The main options of the emitter.
     */
    public readonly options: EmitterOptions;
    /**
     * The emission options of the emitter.
     */
    public readonly emission: EmissionOptions;
    /**
     * The renderer options of the emitter.
     */
    public readonly renderer: RenderOptions;

    private currentLoop = 0; // The current loop index.
    private durationTimer = 0; // Measures the current runtime duration, to allow loops to reset.
    private emissionTimer = 0; // Measures the current emission timer, to allow spawning particles in intervals.

    private attemptedBurstIndices: number[] = []; // The indices of the particle bursts that were attempted this loop.

    /**
     * Checks if the emitter is already expired and can be removed.
     * Expired emitters do not emit new particles.
     */
    public get isExpired(): boolean {
        return (
            this.options.loops >= 0 && this.currentLoop >= this.options.loops
        );
    }
    /**
     * Checks if the emitter can safely be removed.
     * This is true if no more particles are active.
     */
    public get canRemove(): boolean {
        return this.particles.length === 0;
    }

    /**
     * Creates a new emitter, using default options.
     */
    constructor(options?: EmitterConstructionOptions) {
        this.options = overrideDefaults(
            getDefaultEmitterOptions(),
            options?.emitterOptions
        );
        this.emission = overrideDefaults(
            getDefaultEmissionOptions(),
            options?.emissionOptions
        );
        this.renderer = overrideDefaults(
            getDefaultRendererOptions(),
            options?.rendererOptions
        );
    }

    /**
     * Clears all particles inside the emitter.
     *
     * @returns The number of cleared particles.
     */
    public clearParticles(): number {
        return this.particles.splice(0).length;
    }

    /**
     * Processes a tick of the emitter, using the elapsed time.
     *
     * @remarks
     * This handles a few things, namely:
     * - Incrementing the duration timer and potentially incrementing the loop.
     * - Handling particle bursts & emissions.
     * - Despawning particles conditionally.
     *
     * @param delta The time, in seconds, passed since the last tick.
     */
    public tick(delta: number): void {
        if (!this.isExpired) {
            this.durationTimer += delta;
            if (this.durationTimer >= this.options.duration) {
                this.currentLoop++;

                // To start a new loop, the duration timer and attempted bursts are reset.
                this.durationTimer = 0;
                this.attemptedBurstIndices = [];
            }

            // We need to check the expiry again, in case the added loop or duration changed something.
            if (!this.isExpired) {
                // Iterate over the bursts, attempting to execute them if the time is ready.
                let burstIndex = 0;
                for (const burst of this.emission.bursts) {
                    if (burst.time <= this.durationTimer) {
                        // Has the burst already been attempted? If not ...
                        if (!this.attemptedBurstIndices.includes(burstIndex)) {
                            // Perform the burst, emitting a variable amount of particles.
                            const count = evaluateVariation(burst.count);
                            for (let i = 0; i < count; i++) {
                                this.emitParticle();
                            }
                            // Mark the burst as attempted.
                            this.attemptedBurstIndices.push(burstIndex);
                        }
                    }
                    burstIndex++;
                }

                // Handle the 'emission over time'. By using a while-loop instead of a simple
                // if-condition, we take high deltas into account, and ensure that the correct
                // number of particles will consistently be emitted.
                this.emissionTimer += delta;
                const delay = 1 / this.emission.rate;
                while (this.emissionTimer > delay) {
                    this.emissionTimer -= delay;
                    this.emitParticle();
                }
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            this.tickParticle(particle, delta);

            // Particles should be despawned (i.e. removed from the collection) if any of
            // the despawning rules apply to them.
            if (this.options.despawningRules.some((rule) => rule(particle))) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Performs an internal tick for the particle.
     *
     * @remarks
     * This method controls the particle's lifetime, location and velocity, according
     * to the elapsed delta and the configuration. Additionally, each of the emitter's
     * modules is applied to the particle.
     *
     * @param particle The particle to apply the tick for.
     * @param delta The time, in seconds, passed since the last tick.
     */
    private tickParticle(particle: Particle, delta: number): void {
        particle.lifetime -= delta;

        if (this.options.useGravity) {
            // Apply gravitational acceleration to the particle.
            particle.velocity = particle.velocity.add(
                Vector.up.scale(settings.gravity * delta)
            );
        }

        // Apply the particle's velocity to its location.
        particle.location = particle.location.add(
            particle.velocity.scale(delta)
        );

        // Apply the modules to the particle.
        for (const moduleFunction of this.options.modules) {
            moduleFunction(particle);
        }
    }

    /**
     * Emits a particle using the registered settings.
     * Also may despawn a particle if the maximum number of particles is exceeded.
     */
    private emitParticle(): Particle {
        const particle: Particle = new Particle({
            location: this.emission.sourceSampler(),
            lifetime: evaluateVariation(this.emission.initialLifetime),
            velocity: Vector.from2dAngle(
                evaluateVariation(this.emission.angle)
            ).scale(evaluateVariation(this.emission.initialSpeed)),
            size: evaluateVariation(this.emission.initialSize),
            rotation: evaluateVariation(this.emission.initialRotation),
            color: evaluateVariation(this.emission.initialColor),
        });
        this.particles.push(particle);

        // Ensure that no more particles than 'maxParticles' can exist.
        if (this.particles.length > this.options.maxParticles) {
            this.particles.shift();
        }

        return particle;
    }
}
