import type { Behavior, BehaviorUpdateContext } from "../behavior/behavior";
import { isDead } from "../particle/lifecycle";
import type { Particle } from "../particle/particle";
import type { Rng } from "../random";
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
	rng: Rng;
	behaviors?: Behavior[];
}

export class Emitter {
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
		this.rng = options.rng;
	}

	public get isExpired(): boolean {
		return isScheduleExpired(this.schedule, this.scheduleState);
	}

	public get isDone(): boolean {
		return this.isExpired && this.particles.length === 0;
	}

	public tick(dt: number): void {
		const { state, spawnCount } = advanceSchedule(
			this.schedule,
			this.scheduleState,
			dt,
		);
		this.scheduleState = state;

		for (let i = 0; i < spawnCount; i++) {
			const ctx: SamplerContext = {
				rng: this.rng,
				index: this.spawnedCount,
			};
			this.particles.push(spawnParticle(this.particleInit, ctx));
			this.spawnedCount++;
		}

		const stepCtx: BehaviorUpdateContext = { rng: this.rng, dt };
		stepParticles(this.particles, this.behaviors, stepCtx);

		for (let i = this.particles.length - 1; i >= 0; i--) {
			if (isDead(this.particles[i])) this.particles.splice(i, 1);
		}
	}
}
