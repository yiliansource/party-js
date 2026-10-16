/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import { cleanToStep, decimalsOf, snapToStep } from "./number";

describe("decimalsOf", () => {
	test.each([
		[1, 0],
		[10, 0],
		[0.1, 1],
		[0.05, 2],
		[2.5, 1],
		[1e-7, 7],
		[1.5e-7, 8],
		[1e21, 0],
		[-0.25, 2],
	])("%p has %p decimals", (n, decimals) => {
		expect(decimalsOf(n)).toBe(decimals);
	});
});

describe("cleanToStep", () => {
	test("removes floating-point noise", () => {
		expect(cleanToStep(0.1 + 0.2, 0.1)).toBe(0.3);
		expect(cleanToStep(0.7 * 3, 0.01)).toBe(2.1);
		expect(cleanToStep(1.1 * 1.1, 0.01)).toBe(1.21);
	});

	test("rounds to the step's decimals", () => {
		expect(cleanToStep(0.126, 0.01)).toBe(0.13);
		expect(cleanToStep(2.25, 1)).toBe(2);
		expect(cleanToStep(0.1234567891, 1e-7)).toBe(0.1234568);
	});

	test("doesn't move the value onto a multiple of the step", () => {
		expect(cleanToStep(305, 10)).toBe(305);
		expect(cleanToStep(0.13, 0.05)).toBe(0.13);
	});

	test("never returns -0", () => {
		expect(Object.is(cleanToStep(-0.001, 0.01), 0)).toBe(true);
	});
});

describe("snapToStep", () => {
	const count = { min: 1, max: 200, step: 1 };
	const velocity = { min: 0, max: 2000, step: 10 };
	const aspect = { min: 0.1, max: 1, step: 0.05 };
	const lifetime = { min: 0.5, max: 10, step: 0.1 };

	test("snaps to the nearest step", () => {
		expect(snapToStep(304, velocity)).toBe(300);
		expect(snapToStep(306, velocity)).toBe(310);
		expect(snapToStep(0.12, aspect)).toBe(0.1);
		expect(snapToStep(0.13, aspect)).toBe(0.15);
		expect(snapToStep(41.6, count)).toBe(42);
	});

	test("keeps values that are already on a step", () => {
		expect(snapToStep(300, velocity)).toBe(300);
		expect(snapToStep(0.65, aspect)).toBe(0.65);
		expect(snapToStep(2.3, lifetime)).toBe(2.3);
	});

	test("counts steps from min, not from 0", () => {
		const halves = { min: 0.5, max: 10, step: 1 };
		expect(snapToStep(2, halves)).toBe(2.5);
		expect(snapToStep(0.9, halves)).toBe(0.5);
		expect(snapToStep(3.9, { min: 1, max: 10, step: 2 })).toBe(3);
	});

	test("stays within the bounds", () => {
		expect(snapToStep(-50, velocity)).toBe(0);
		expect(snapToStep(9000, velocity)).toBe(2000);
		expect(snapToStep(0, count)).toBe(1);
		expect(snapToStep(Number.POSITIVE_INFINITY, aspect)).toBe(1);
		expect(snapToStep(Number.NEGATIVE_INFINITY, aspect)).toBe(0.1);
	});

	test("reaches max even when float error makes the step count fall short", () => {
		// (0.3 - 0) / 0.1 is 2.9999999999999996 and (0.7 - 0) / 0.1 is 6.999999999999999 in floating point
		expect(snapToStep(0.3, { min: 0, max: 0.3, step: 0.1 })).toBe(0.3);
		expect(snapToStep(0.7, { min: 0, max: 0.7, step: 0.1 })).toBe(0.7);
		expect(snapToStep(0.7, { min: 0.1, max: 0.7, step: 0.2 })).toBe(0.7);
		expect(snapToStep(1, aspect)).toBe(1);
	});

	test("never goes past max when max isn't on the grid", () => {
		const odd = { min: 0, max: 10, step: 3 };
		expect(snapToStep(10, odd)).toBe(9);
		expect(snapToStep(9.8, odd)).toBe(9);
	});

	test("results carry no floating-point noise", () => {
		for (let i = 0; i <= 95; i++) {
			const v = snapToStep(0.5 + i * 0.1, lifetime);
			expect(String(v).length).toBeLessThanOrEqual(4);
		}
		expect(snapToStep(0.1 + 0.2, { min: 0, max: 1, step: 0.1 })).toBe(0.3);
	});

	test("NaN gives min", () => {
		expect(snapToStep(Number.NaN, lifetime)).toBe(0.5);
	});

	test("rejects impossible bounds", () => {
		expect(() => snapToStep(1, { min: 0, max: 1, step: 0 })).toThrow(
			RangeError,
		);
		expect(() => snapToStep(1, { min: 0, max: 1, step: -1 })).toThrow(
			RangeError,
		);
		expect(() => snapToStep(1, { min: 2, max: 1, step: 1 })).toThrow(
			RangeError,
		);
	});
});
