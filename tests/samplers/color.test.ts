import { describe, expect, test } from "bun:test";

import { toPolar } from "../../src/color/oklch";
import { createRng } from "../../src/random/rng";
import { gradient, randomHue } from "../../src/samplers/color";
import { sampledMinMax } from "../helpers";
import { createTestCtx } from "./helpers";

describe("gradient", () => {
	test("throws when an empty array is passed", () => {
		expect(() => gradient([])).toThrow();
	});
});

describe("randomHue", () => {
	test("outputs a valid hue in the range [0, 360)", () => {
		const rng = createRng();
		const sampler = randomHue({ c: 0, l: 0 });
		const { min, max } = sampledMinMax(
			100_000,
			() => sampler(createTestCtx(rng)),
			(v) => toPolar(v).h,
		);
		expect(min).toBeGreaterThanOrEqual(0);
		expect(max).toBeLessThan(360);
	});

	test("hue matches rng() * 360, l and c are passed through exactly", () => {
		const sample = randomHue({ l: 0.6, c: 0.15 });
		const polar = toPolar(sample(createTestCtx(() => 0.25)));
		expect(polar).toEqual({
			h: expect.closeTo(90, 9),
			l: expect.closeTo(0.6, 9),
			c: expect.closeTo(0.15, 9),
		});
	});

	test("defaults alpha to 1, or carries the given alpha through", () => {
		const withDefault = randomHue({ l: 0.6, c: 0.15 });
		expect(withDefault(createTestCtx(() => 0)).alpha).toBe(1);

		const withAlpha = randomHue({ l: 0.5, c: 0.3, alpha: 0.2 });
		expect(withAlpha(createTestCtx(() => 0)).alpha).toBe(0.2);
	});

	test("throws on invalid options", () => {
		expect(() => randomHue({ l: 1, c: -1 })).toThrow();
	});
});
