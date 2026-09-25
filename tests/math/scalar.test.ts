import { describe, expect, test } from "bun:test";

import { clamp, clamp01, deg2rad, lerp, rad2deg } from "../../src/math/scalar";

describe("lerp", () => {
	test("at t=0 returns a", () => {
		expect(lerp(10, 20, 0)).toBe(10);
	});

	test("at t=1 returns b", () => {
		expect(lerp(10, 20, 1)).toBe(20);
	});

	test("at t=0.5 returns midpoint", () => {
		expect(lerp(10, 20, 0.5)).toBeCloseTo(15, 9);
	});

	test("extrapolates for t outside [0, 1]", () => {
		expect(lerp(0, 10, 2)).toBeCloseTo(20, 9);
		expect(lerp(0, 10, -1)).toBeCloseTo(-10, 9);
	});

	test("handles a equals b", () => {
		expect(lerp(5, 5, 0.7)).toBe(5);
	});
});

describe("clamp", () => {
	test("passes through values inside the range", () => {
		expect(clamp(5, 0, 10)).toBe(5);
	});

	test("clamps values below the minimum", () => {
		expect(clamp(-5, 0, 10)).toBe(0);
	});

	test("clamps values above the maximum", () => {
		expect(clamp(15, 0, 10)).toBe(10);
	});

	test("boundary values are returned unchanged", () => {
		expect(clamp(0, 0, 10)).toBe(0);
		expect(clamp(10, 0, 10)).toBe(10);
	});
});

describe("clamp01", () => {
	test("clamps to [0, 1]", () => {
		expect(clamp01(-0.5)).toBe(0);
		expect(clamp01(1.5)).toBe(1);
		expect(clamp01(0.3)).toBeCloseTo(0.3, 9);
	});
});

describe("deg2rad & rad2deg", () => {
	test("180 degrees is pi radians", () => {
		expect(180 * deg2rad).toBeCloseTo(Math.PI, 9);
	});

	test("deg2rad and rad2deg are inverses", () => {
		const original = 137.5;
		expect(original * deg2rad * rad2deg).toBeCloseTo(original, 9);
	});
});
