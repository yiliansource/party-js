import { describe, expect, test } from "bun:test";

import { buildStarPath } from "@/shapes/star";

import { exceedsUnitBox } from "./helpers";

describe("buildStarPath", () => {
	test("stays inside unit box", () => {
		for (let n = 3; n <= 10; n++) {
			expect(exceedsUnitBox(buildStarPath(n))).toBe(false);
		}
	});

	test("throws if points < 3", () => {
		expect(() => buildStarPath(2)).toThrow();
	});
});
