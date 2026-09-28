import { describe, expect, test } from "bun:test";

import { length } from "@/math/vec3";
import { createRng } from "@/random/rng";
import { randomSpin } from "@/samplers/vec3";

import { sampledMinMax } from "../helpers";
import { makeTestCtx } from "./helpers";

describe("randomSpin", () => {
	test("has magnitude inside [min, max]", () => {
		const [min, max] = [3, 7];
		const rng = createRng(5);
		const sampler = randomSpin(min, max);
		const { min: sampledMin, max: sampledMax } = sampledMinMax(
			100_000,
			() => sampler(makeTestCtx(rng)),
			(v) => length(v),
		);
		expect(sampledMin).toBeGreaterThanOrEqual(min);
		expect(sampledMax).toBeLessThanOrEqual(max);
	});
});
