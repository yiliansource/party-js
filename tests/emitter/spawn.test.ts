import { describe, expect, test } from "bun:test";

import { type ParticleInit, spawnParticle } from "@/emitter/spawn";
import type { Vec3 } from "@/math";
import type { SamplerContext } from "@/samplers";

import { quatCloseTo, vec3CloseTo } from "../math/helper";

const fakeParticleOptions: ParticleInit = {
	size: 1,
	color: "#ff0000",
	shape: { type: "circle" },
	lifetime: 1,
};
const fakeCtx: SamplerContext = {
	rng: () => 0,
	index: 0,
};

describe("spawnParticle", () => {
	test("fills in (unfrozen) defaults for omitted properties", () => {
		const particle = spawnParticle(fakeParticleOptions, fakeCtx);

		vec3CloseTo(particle.position, { x: 0, y: 0, z: 0 });
		vec3CloseTo(particle.velocity, { x: 0, y: 0, z: 0 });
		quatCloseTo(particle.orientation, { x: 0, y: 0, z: 0, w: 1 });
		vec3CloseTo(particle.angularVelocity, { x: 0, y: 0, z: 0 });

		expect(() => {
			particle.position.x = 1;
			particle.velocity.y = 1;
			particle.orientation.x = 1;
			particle.orientation.w = 0;
			particle.angularVelocity.z = 1;
		}).not.toThrow();
	});

	test("spawned particles own their sampled values", () => {
		const velocity: Vec3 = { x: 0, y: 50, z: 0 };
		const a = spawnParticle({ ...fakeParticleOptions, velocity }, fakeCtx);
		const b = spawnParticle({ ...fakeParticleOptions, velocity }, fakeCtx);

		a.velocity.y = 20;
		expect(b.velocity.y).toBe(50);
	});
});
