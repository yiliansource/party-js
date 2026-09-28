import { describe, expect, test } from "bun:test";

import { createFixedTimestepLoop } from "@/physics/loop";

describe("createFixedTimestepLoop", () => {
	test("advance runs exactly one step when given exactly one fixedDt", () => {
		let calls = 0;
		const loop = createFixedTimestepLoop({
			fixedDt: 0.02,
			onStep: () => {
				calls++;
			},
		});
		const steps = loop.advance(0.02);
		expect(steps).toBe(1);
		expect(calls).toBe(1);
	});

	test("carries a fractional remainder into the next advance() call", () => {
		let calls = 0;
		const loop = createFixedTimestepLoop({
			fixedDt: 0.02,
			onStep: () => {
				calls++;
			},
		});
		const steps1 = loop.advance(0.03);
		const steps2 = loop.advance(0.012);
		expect(steps1).toBe(1);
		expect(steps2).toBe(1);
		expect(calls).toBe(2);
	});

	test("clamps to maxStepsPerAdvance and drops the backlog on a long pause", () => {
		let calls = 0;
		const loop = createFixedTimestepLoop({
			fixedDt: 0.02,
			maxStepsPerAdvance: 5,
			onStep: () => {
				calls++;
			},
		});
		const steps = loop.advance(10); // 500 steps when uncapped
		expect(steps).toBe(5);
		expect(calls).toBe(5);
		expect(loop.advance(0)).toBe(0); // backlog was dropped
	});
});
