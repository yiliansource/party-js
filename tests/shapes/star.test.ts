import { describe, expect, test } from "bun:test";

import { buildStarPath } from "@/shapes/star";

import { exceedsUnitBox } from "./helpers";

describe("buildStarPath", () => {
	test("stays inside unit box", () => {
		for (let n = 3; n <= 10; n++) {
			expect(exceedsUnitBox(buildStarPath(n))).toBe(false);
		}
	});

	test("stays inside unit box with any inner radius", () => {
		for (const innerRadius of [0.05, 0.22, 0.5, 1]) {
			expect(exceedsUnitBox(buildStarPath(4, innerRadius))).toBe(false);
		}
	});

	test("throws if points < 3", () => {
		expect(() => buildStarPath(2)).toThrow();
	});

	test("throws if the inner radius is not greater than 0 and at most 1", () => {
		for (const innerRadius of [0, -0.5, 1.5, Number.NaN]) {
			expect(() => buildStarPath(4, innerRadius)).toThrow();
		}
	});
});
