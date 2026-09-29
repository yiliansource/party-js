import { describe, expect, test } from "bun:test";

import {
	advanceSchedule,
	type EmissionSchedule,
	initialScheduleState,
	isScheduleExpired,
} from "@/emitter/schedule";

describe("advanceSchedule", () => {
	test("a burst at time 0 fires on the very first tick", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 1,
			rate: 0,
			bursts: [{ time: 0, count: 5 }],
		};
		const { spawnCount } = advanceSchedule(
			schedule,
			initialScheduleState,
			0.016,
		);
		expect(spawnCount).toBe(5);
	});

	test("a burst does not fire again on a later tick within the same loop", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 1,
			rate: 0,
			bursts: [{ time: 0, count: 5 }],
		};
		const first = advanceSchedule(schedule, initialScheduleState, 0.016);
		const second = advanceSchedule(schedule, first.state, 0.016);
		expect(second.spawnCount).toBe(0);
	});

	test("a burst scheduled later fires once elapsed time reaches it", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 1,
			rate: 0,
			bursts: [{ time: 0.5, count: 3 }],
		};
		const before = advanceSchedule(schedule, initialScheduleState, 0.4);
		expect(before.spawnCount).toBe(0);

		const after = advanceSchedule(schedule, before.state, 0.2);
		expect(after.spawnCount).toBe(3);
	});

	test("a large dt still fires a burst it steps over, exactly once", () => {
		const schedule: EmissionSchedule = {
			duration: 5,
			loops: 1,
			rate: 0,
			bursts: [{ time: 0.5, count: 3 }],
		};
		const { spawnCount } = advanceSchedule(
			schedule,
			initialScheduleState,
			2,
		);
		expect(spawnCount).toBe(3);
	});

	test("continuous rate spawns exactly one particle per interval", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 1,
			rate: 10,
			bursts: [],
		};
		const { spawnCount } = advanceSchedule(
			schedule,
			initialScheduleState,
			0.12,
		);
		expect(spawnCount).toBe(1);
	});

	test("continuous rate accumulates a fractional remainder across ticks", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 1,
			rate: 10,
			bursts: [],
		};
		let state = initialScheduleState;
		let total = 0;
		for (let i = 0; i < 10; i++) {
			const result = advanceSchedule(schedule, state, 0.09);
			state = result.state;
			total += result.spawnCount;
		}
		expect(total).toBe(8);
	});

	test("continuous rate catches up correctly after a large dt", () => {
		const schedule: EmissionSchedule = {
			duration: 5,
			loops: 1,
			rate: 10,
			bursts: [],
		};
		const { spawnCount } = advanceSchedule(
			schedule,
			initialScheduleState,
			1,
		);
		expect(spawnCount).toBe(10);
	});

	test("spawning stops for good once a finite loop count is exhausted", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 1,
			rate: 10,
			bursts: [{ time: 2, count: 99 }],
		};
		const past = advanceSchedule(schedule, initialScheduleState, 3);
		const again = advanceSchedule(schedule, past.state, 1);
		expect(again.spawnCount).toBe(0);
	});

	test("elapsed never overshoots duration, even across several exact-multiple loop wraps", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: Number.POSITIVE_INFINITY,
			rate: 0,
			bursts: [],
		};
		const { state } = advanceSchedule(schedule, initialScheduleState, 5);
		expect(state.currentLoop).toBe(5);
		expect(state.elapsed).toBe(0);
	});

	test("a burst re-fires on every loop", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 3,
			rate: 0,
			bursts: [{ time: 0, count: 5 }],
		};
		let state = initialScheduleState;
		let total = 0;
		for (let i = 0; i < 3; i++) {
			const result = advanceSchedule(schedule, state, 1);
			state = result.state;
			total += result.spawnCount;
		}
		expect(total).toBe(15);
	});

	test("a dt spanning several whole loops fires the burst once per loop crossed", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: Number.POSITIVE_INFINITY,
			rate: 0,
			bursts: [{ time: 0, count: 5 }],
		};
		const { spawnCount } = advanceSchedule(
			schedule,
			initialScheduleState,
			3.5,
		);
		expect(spawnCount).toBe(20);
	});

	test("an infinite loop count never expires, however many loops pass", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: Number.POSITIVE_INFINITY,
			rate: 0,
			bursts: [],
		};
		const { state } = advanceSchedule(schedule, initialScheduleState, 1000);
		expect(isScheduleExpired(schedule, state)).toBe(false);
	});

	test("throws for a non-positive duration, rather than getting stuck looping forever", () => {
		const schedule: EmissionSchedule = {
			duration: 0,
			loops: 1,
			rate: 0,
			bursts: [],
		};
		expect(() =>
			advanceSchedule(schedule, initialScheduleState, 0.016),
		).toThrow();
	});
});

describe("isScheduleExpired", () => {
	test("false before duration has elapsed", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 1,
			rate: 0,
			bursts: [],
		};
		expect(isScheduleExpired(schedule, initialScheduleState)).toBe(false);
	});

	test("true once the only loop's duration has elapsed", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 1,
			rate: 0,
			bursts: [],
		};
		const { state } = advanceSchedule(schedule, initialScheduleState, 1);
		expect(isScheduleExpired(schedule, state)).toBe(true);
	});

	test("false after one of several loops has elapsed", () => {
		const schedule: EmissionSchedule = {
			duration: 1,
			loops: 3,
			rate: 0,
			bursts: [],
		};
		const { state } = advanceSchedule(schedule, initialScheduleState, 1);
		expect(isScheduleExpired(schedule, state)).toBe(false);
	});
});
