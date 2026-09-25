import { describe, expect, test } from "bun:test";

import { createRng } from "../../src/random/rng";
import { evaluate } from "../../src/samplers/helpers";
import { createTestCtx } from "./helpers";

describe("evaluate", () => {
	test("passes constants through unchanged", () => {
		expect(evaluate(27, createTestCtx(createRng()))).toBe(27);
	});

	test("calls a sampler function with the context", () => {
		expect(
			evaluate((c) => c.index, createTestCtx(createRng(), { index: 3 })),
		).toBe(3);
	});
});
