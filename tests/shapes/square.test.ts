import { describe, expect, test } from "bun:test";

import { buildSquarePath } from "@/shapes/square";

import { exceedsUnitBox } from "./helpers";

describe("buildSquarePath", () => {
	test("stays inside unit box", () => {
		expect(exceedsUnitBox(buildSquarePath())).toBe(false);
		expect(exceedsUnitBox(buildSquarePath(0.8, 0.2))).toBe(false);
	});
});
