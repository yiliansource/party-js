import { describe, expect, test } from "bun:test";

import { createRng } from "@/random/rng";
import { evaluate } from "@/samplers/helpers";

import { makeTestCtx } from "./helpers";

describe("evaluate", () => {
	test("passes constants through unchanged", () => {
		expect(evaluate(27, makeTestCtx(createRng()))).toBe(27);
	});

	test("calls a sampler function with the context", () => {
		expect(
			evaluate((c) => c.index, makeTestCtx(createRng(), { index: 3 })),
		).toBe(3);
	});
});
