import { describe, expect, test } from "bun:test";

import { color } from "../../src/color/color";
import { fromPolar, lerpHue, toPolar } from "../../src/color/oklch";

// reference values were computed independently with culori (oklab)

describe("toPolar", () => {
	test("converts a chromatic color to (l, c, h)", () => {
		const red = color("red");
		const polar = toPolar(red);
		expect(polar.l).toBeCloseTo(0.6279553639214311, 9);
		expect(polar.c).toBeCloseTo(0.2576833038053608, 9);
		expect(polar.h).toBeCloseTo(29.233880279627854, 9);
	});

	test("converts a second chromatic color, in a different hue quadrant", () => {
		const blue = color("blue");
		const polar = toPolar(blue);
		expect(polar.l).toBeCloseTo(0.45201371817442365, 9);
		expect(polar.c).toBeCloseTo(0.31321438863448475, 9);
		expect(polar.h).toBeCloseTo(264.05202261636987, 9);
	});

	test("returns hue in [0, 360) rather than a negative angle", () => {
		const blue = color("blue"); // raw atan2 angle here would be negative
		const polar = toPolar(blue);
		expect(polar.h).toBeGreaterThanOrEqual(0);
		expect(polar.h).toBeLessThan(360);
	});

	test("an achromatic color has zero chroma and does not produce NaN hue", () => {
		const gray = color("gray");
		const polar = toPolar(gray);
		expect(polar.c).toBeCloseTo(0, 9);
		expect(Number.isNaN(polar.h)).toBe(false);
	});
});

describe("fromPolar", () => {
	test("is the inverse of toPolar", () => {
		const green = color("green");
		const roundTripped = fromPolar(toPolar(green), green.alpha);
		expect(roundTripped.l).toBeCloseTo(green.l, 9);
		expect(roundTripped.a).toBeCloseTo(green.a, 9);
		expect(roundTripped.b).toBeCloseTo(green.b, 9);
	});

	test("lets alpha pass through unchanged", () => {
		const polar = toPolar(color("red"));
		expect(fromPolar(polar, 1).alpha).toBe(1);
		expect(fromPolar(polar, 0.4).alpha).toBe(0.4);
		expect(fromPolar(polar, 0).alpha).toBe(0);
	});
});

describe("lerpHue", () => {
	test("interpolates linearly when the short way round does not cross the 0/360 seam", () => {
		expect(lerpHue(0, 90, 0.5)).toBeCloseTo(45, 9);
		expect(lerpHue(10, 50, 0.25)).toBeCloseTo(20, 9);
	});

	test("takes the shorter path across the 0/360 seam", () => {
		expect(lerpHue(350, 10, 0.5)).toBeCloseTo(0, 9);
		expect(lerpHue(10, 350, 0.5)).toBeCloseTo(0, 9);
	});

	test("returns the same hue for any t when both endpoints are equal", () => {
		expect(lerpHue(0, 0, 0.5)).toBeCloseTo(0, 9);
		expect(lerpHue(123.4, 123.4, 0.9)).toBeCloseTo(123.4, 9);
	});

	test("has a defined, deterministic tie-break for exactly-opposite hues", () => {
		// this pins down which tie-break we use
		expect(lerpHue(0, 180, 0.5)).toBeCloseTo(270, 9);
	});

	test("stays within [0, 360) across the full range of t", () => {
		for (let i = 0; i <= 10; i++) {
			const h = lerpHue(350, 10, i / 10);
			expect(h).toBeGreaterThanOrEqual(0);
			expect(h).toBeLessThan(360);
		}
	});
});
