import { describe, expect, test } from "bun:test";

import { buildPolygonPath } from "@/shapes/polygon";

import { exceedsUnitBox } from "./helpers";

describe("buildPolygonPath", () => {
	test("stays inside unit box", () => {
		for (let n = 3; n <= 10; n++) {
			expect(exceedsUnitBox(buildPolygonPath(n))).toBe(false);
		}
	});

	test("throws if sides < 3", () => {
		expect(() => buildPolygonPath(2)).toThrow();
	});
});
