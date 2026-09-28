import { describe, expect, test } from "bun:test";

import { length } from "@/math/quat";
import { createRng } from "@/random/rng";
import { randomOrientation } from "@/samplers/quat";

import { sampledMaxAbsDeviation } from "../helpers";
import { makeTestCtx } from "./helpers";

describe("randomOrientation", () => {
	test("should produce a unit quaternion", () => {
		const rng = createRng(8);
		const sampler = randomOrientation();
		const maxDev = sampledMaxAbsDeviation(
			100_000,
			() => sampler(makeTestCtx(rng)),
			(q) => length(q),
			1,
		);
		expect(maxDev).toBeLessThan(10e-6);
	});
});
