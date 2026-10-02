import { describe, expect, test } from "bun:test";

import {
	type Easing,
	linear,
	sineIn,
	sineInOut,
	sineOut,
} from "@/behavior/easing";

function isMonotone(ease: Easing, step = 0.01): boolean {
	let prev = ease(0);
	for (let t = step; t <= 1; t += step) {
		const cur = ease(t);
		if (cur < prev) return false;
		prev = cur;
	}
	return true;
}

describe("linear", () => {
	test("returns the input value", () => {
		const ease = linear();
		for (let t = 0; t <= 1; t += 0.25) {
			expect(ease(t)).toBeCloseTo(t);
		}
	});
});

describe("sineIn", () => {
	test("correct values at endpoints", () => {
		const ease = sineIn();
		expect(ease(0)).toBeCloseTo(0);
		expect(ease(1)).toBeCloseTo(1);
	});

	test("is monotone", () => {
		expect(isMonotone(sineIn())).toBe(true);
	});
});

describe("sineOut", () => {
	test("correct values at endpoints", () => {
		const ease = sineOut();
		expect(ease(0)).toBeCloseTo(0);
		expect(ease(1)).toBeCloseTo(1);
	});

	test("is monotone", () => {
		expect(isMonotone(sineOut())).toBe(true);
	});
});

describe("sineInOut", () => {
	test("correct values at midpoint and endpoints", () => {
		const ease = sineInOut();
		expect(ease(0)).toBeCloseTo(0);
		expect(ease(0.5)).toBeCloseTo(0.5);
		expect(ease(1)).toBeCloseTo(1);
	});

	test("is monotone", () => {
		expect(isMonotone(sineInOut())).toBe(true);
	});
});
