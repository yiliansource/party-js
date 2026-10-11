import { invalidOption, PartyJSError } from "../errors";
import type { Rng } from "../random";
import { evaluateSampler, type Sampler } from "../samplers";
import { type Live, resolveLive } from "./live";

/**
 * A group of particles emitted all at once, at a set time in each loop of an {@link EmissionSchedule}.
 *
 * @summary A group of particles emitted all at once.
 *
 * @group Custom effects
 */
export interface EmissionBurst {
	/**
	 * When the burst fires, in seconds from the start of each loop. Must be at least 0 and at most the schedule's
	 * `duration`, or an error will be thrown as the burst would never fire.
	 *
	 * @defaultValue 0
	 */
	time?: number;
	/**
	 * How many particles the burst emits. Sampled once each time the burst fires, with `ctx.index` set to the
	 * current loop. The sampled number will be rounded to the nearest integer.
	 */
	count: Sampler<number>;
}

/**
 * When and how many particles an effect emits.
 *
 * A schedule runs for `duration` seconds, `loops` times in a row. During that time, particles are emitted
 * continuously at `rate` per second, and each burst fires at its set time once per loop. The effect ends once
 * all loops have run and the last particle has expired (i.e. died).
 *
 * @summary When and how many particles an effect emits.
 *
 * @example
 * ```ts
 * // A single burst of 40 particles.
 * const scheduleA = { bursts: [{ count: 40 }] };
 *
 * // A steady stream of 20 particles per second, running forever.
 * const scheduleB = { loops: Infinity, rate: 20 };
 * ```
 *
 * @group Custom effects
 */
export interface EmissionSchedule {
	/**
	 * The length of one loop, in seconds. Must be positive and finite.
	 *
	 * @defaultValue 1
	 */
	duration?: number;
	/**
	 * How many loops the schedule runs. Use `Infinity` for an effect that runs until it's stopped.
	 *
	 * @defaultValue 1
	 */
	loops?: number;
	/**
	 * How many particles to emit per second, continuously. This is read on every simulation step, so a function
	 * can speed the stream up or slow it down, or (for example) make it dependent on the screen size.
	 *
	 * @defaultValue 0
	 */
	rate?: Live<number>;
	/**
	 * Groups of particles emitted all at once, each fired once per loop.
	 *
	 * @defaultValue []
	 */
	bursts?: EmissionBurst[];
}

export type ResolvedEmissionSchedule = Required<
	Omit<EmissionSchedule, "bursts">
> & {
	bursts: Required<EmissionBurst>[];
};

export interface ScheduleState {
	elapsed: number;
	emissionTimer: number;
	firedBurstIndices: readonly number[];
	currentLoop: number;
}

export const initialScheduleState: ScheduleState = {
	elapsed: 0,
	emissionTimer: 0,
	firedBurstIndices: [],
	currentLoop: 0,
};

export interface ScheduleAdvanceResult {
	state: ScheduleState;
	spawnCount: number;
}

export function resolveSchedule(
	schedule: EmissionSchedule,
): ResolvedEmissionSchedule {
	const resolved: ResolvedEmissionSchedule = {
		duration: schedule.duration ?? 1,
		loops: schedule.loops ?? 1,
		rate: schedule.rate ?? 0,
		bursts: (schedule.bursts ?? []).map((burst) => ({
			time: burst.time ?? 0,
			count: burst.count,
		})),
	};

	if (resolved.duration <= 0 || !Number.isFinite(resolved.duration))
		throw invalidOption(
			"schedule.duration",
			"a positive, finite number of seconds",
			resolved.duration,
		);

	if (
		resolved.loops <= 0 ||
		Number.isNaN(resolved.loops) ||
		(Number.isFinite(resolved.loops) && !Number.isInteger(resolved.loops))
	)
		throw invalidOption(
			"schedule.loops",
			"an integer of at least 1, or Infinity",
			resolved.loops,
		);

	if (
		typeof resolved.rate === "number" &&
		(resolved.rate < 0 || !Number.isFinite(resolved.rate))
	)
		throw invalidOption(
			"schedule.rate",
			"a finite number of at least 0",
			resolved.rate,
		);

	for (let i = 0; i < resolved.bursts.length; i++) {
		const burst = resolved.bursts[i];

		if (burst.time < 0 || burst.time > resolved.duration)
			throw invalidOption(
				`schedule.bursts[${i}].time`,
				`at least 0 and at most the schedule's duration of ${resolved.duration}${schedule.duration === undefined ? " (the default)" : ""}`,
				burst.time,
			);

		if (typeof burst.count === "number" && burst.count < 0)
			throw invalidOption(
				`schedule.bursts[${i}].count`,
				`at least 0`,
				burst.count,
			);
	}

	if (
		typeof resolved.rate === "number" &&
		resolved.rate === 0 &&
		resolved.bursts.length === 0
	)
		throw new PartyJSError(
			`schedule never emits any particles: set a rate above 0, or add a burst`,
		);

	return resolved;
}

export function isScheduleExpired(
	schedule: ResolvedEmissionSchedule,
	state: ScheduleState,
): boolean {
	return (
		Number.isFinite(schedule.loops) && state.currentLoop >= schedule.loops
	);
}

export function advanceSchedule(
	schedule: ResolvedEmissionSchedule,
	state: ScheduleState,
	dt: number,
	rng: Rng,
): ScheduleAdvanceResult {
	if (isScheduleExpired(schedule, state)) {
		return { state, spawnCount: 0 };
	}

	let { elapsed, firedBurstIndices, currentLoop } = state;
	let remaining = dt;
	let spawnCount = 0;

	while (remaining > 0) {
		if (Number.isFinite(schedule.loops) && currentLoop >= schedule.loops) {
			break;
		}

		const step = Math.min(remaining, schedule.duration - elapsed);
		const newElapsed = elapsed + step;

		const bursts = schedule.bursts ?? [];
		for (let index = 0; index < bursts.length; index++) {
			const burst = bursts[index];
			if (
				burst.time <= newElapsed &&
				!firedBurstIndices.includes(index)
			) {
				spawnCount += Math.round(
					evaluateSampler(burst.count, {
						rng,
						index: currentLoop,
					}),
				);
				firedBurstIndices = [...firedBurstIndices, index];
			}
		}

		elapsed = newElapsed;
		remaining -= step;

		if (elapsed >= schedule.duration) {
			currentLoop += 1;
			elapsed = 0;
			firedBurstIndices = [];
		}
	}

	let emissionTimer = state.emissionTimer + dt;
	const rate = resolveLive(schedule.rate);
	if (rate > 0) {
		const delay = 1 / rate;
		while (emissionTimer >= delay) {
			emissionTimer -= delay;
			spawnCount += 1;
		}
	}

	return {
		state: {
			elapsed,
			emissionTimer,
			firedBurstIndices,
			currentLoop,
		},
		spawnCount,
	};
}
