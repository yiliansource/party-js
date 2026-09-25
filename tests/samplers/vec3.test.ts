import { describe, expect, test } from "bun:test";

import { length } from "../../src/math/vec3";
import { createRng } from "../../src/random/rng";
import { randomSpin } from "../../src/samplers/vec3";
import { sampledMinMax } from "../helpers";
import { createTestCtx } from "./helpers";

describe("randomSpin", () => {
	test("has magnitude inside [min, max]", () => {
		const [min, max] = [3, 7];
		const rng = createRng(5);
		const sampler = randomSpin(min, max);
		const { min: sampledMin, max: sampledMax } = sampledMinMax(
			100_000,
			() => sampler(createTestCtx(rng)),
			(v) => length(v),
		);
		expect(sampledMin).toBeGreaterThanOrEqual(min);
		expect(sampledMax).toBeLessThanOrEqual(max);
	});
});
