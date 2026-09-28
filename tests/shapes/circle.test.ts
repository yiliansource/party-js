import { describe, expect, test } from "bun:test";

import { buildCirclePath } from "@/shapes/circle";

import { exceedsUnitBox } from "./helpers";

describe("buildCirclePath", () => {
	test("stays inside unit box", () => {
		expect(exceedsUnitBox(buildCirclePath())).toBe(false);
	});
});
