import { describe, expect, test } from "bun:test";

import { length } from "../../src/math/quat";
import { createRng } from "../../src/random/rng";
import { randomOrientation } from "../../src/samplers/quat";
import { sampledMaxAbsDeviation } from "../helpers";
import { createTestCtx } from "./helpers";

describe("randomOrientation", () => {
	test("should produce a unit quaternion", () => {
		const rng = createRng(8);
		const sampler = randomOrientation();
		const maxDev = sampledMaxAbsDeviation(
			100_000,
			() => sampler(createTestCtx(rng)),
			(q) => length(q),
			1,
		);
		expect(maxDev).toBeLessThan(10e-6);
	});
});
