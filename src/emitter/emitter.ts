import {
	type Behavior,
	type BehaviorInitContext,
	type BehaviorUpdateContext,
	initBehavior,
} from "../behavior/behavior";
import { isDead } from "../particle/lifecycle";
import type { Particle } from "../particle/particle";
import { createRng, type Rng } from "../random/rng";
import type { SamplerContext } from "../samplers/types";
import { stepParticles } from "../simulation/step";
import {
	advanceSchedule,
	type EmissionSchedule,
	initialScheduleState,
	isScheduleExpired,
	type ScheduleState,
} from "./schedule";
import { type ParticleInit, spawnParticle } from "./spawn";

export interface EmitterOptions {
	schedule: EmissionSchedule;
	particleInit: ParticleInit;
	rng?: Rng;
	behaviors?: Behavior[];
}

export class Emitter {
	/**
	 * The particles owned by the emitter.
	 */
	public readonly particles: Particle[] = [];

	private readonly schedule: EmissionSchedule;
	private readonly particleInit: ParticleInit;
	private readonly behaviors: Behavior[];
	private readonly rng: Rng;

	private scheduleState: ScheduleState = initialScheduleState;
	private spawnedCount = 0;

	constructor(options: EmitterOptions) {
		this.schedule = options.schedule;
		this.particleInit = options.particleInit;
		this.behaviors = options.behaviors ?? [];
		this.rng = options.rng ?? createRng();
	}

	/**
	 * Checks if the the emitter has completed all of its loops.
	 */
	public get isExpired(): boolean {
		return isScheduleExpired(this.schedule, this.scheduleState);
	}

	/**
	 * Checks if the emitter and all of its particles have expired.
	 */
	public get isDone(): boolean {
		return this.isExpired && this.particles.length === 0;
	}

	/**
	 * Advances the emitter by the specified timestep.
	 *
	 * @param dt - The time to advance the emitter by, in seconds.
	 */
	public tick(dt: number): void {
		const { state, spawnCount } = advanceSchedule(
			this.schedule,
			this.scheduleState,
			dt,
			this.rng,
		);
		this.scheduleState = state;

		for (let i = 0; i < spawnCount; i++) {
			const spawnCtx: SamplerContext = {
				rng: this.rng,
				index: this.spawnedCount,
				batch: {
					index: i,
					size: spawnCount,
				},
			};
			const particle = spawnParticle(this.particleInit, spawnCtx);

			const initCtx: BehaviorInitContext = {
				rng: this.rng,
			};
			for (const behaviour of this.behaviors) {
				initBehavior(behaviour, particle, initCtx);
			}

			this.particles.push(particle);
			this.spawnedCount++;
		}

		const stepCtx: BehaviorUpdateContext = { rng: this.rng, dt };
		stepParticles(this.particles, this.behaviors, stepCtx);

		for (let i = this.particles.length - 1; i >= 0; i--) {
			if (isDead(this.particles[i])) this.particles.splice(i, 1);
		}
	}
}
