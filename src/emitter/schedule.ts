import { PartyJSError } from "../errors";
import type { Rng } from "../random";
import { evaluate, type Sampler } from "../samplers";
import { type Live, resolveLive } from "./live";

export interface EmissionBurst {
	time: number;
	count: Sampler<number>;
}

export interface EmissionSchedule {
	duration: number;
	loops: number;
	rate: Live<number>;
	bursts: EmissionBurst[];
}

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

export function isScheduleExpired(
	schedule: EmissionSchedule,
	state: ScheduleState,
): boolean {
	return (
		Number.isFinite(schedule.loops) && state.currentLoop >= schedule.loops
	);
}

export function advanceSchedule(
	schedule: EmissionSchedule,
	state: ScheduleState,
	dt: number,
	rng: Rng,
): ScheduleAdvanceResult {
	if (schedule.duration < 1e-6) {
		throw new PartyJSError(
			`schedule duration must be positive, got ${schedule.duration}`,
		);
	}
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

		for (let index = 0; index < schedule.bursts.length; index++) {
			const burst = schedule.bursts[index];
			if (
				burst.time <= newElapsed &&
				!firedBurstIndices.includes(index)
			) {
				spawnCount += evaluate(burst.count, {
					rng,
					index: currentLoop,
				});
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
		state: { elapsed, emissionTimer, firedBurstIndices, currentLoop },
		spawnCount,
	};
}
