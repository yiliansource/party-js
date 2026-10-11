import { describe, expect, test } from "bun:test";

import {
	type ResolvedParticleInit,
	resolveParticleInit,
	spawnParticle,
} from "@/emitter/spawn";
import type { Quat, Vec3 } from "@/math";
import type { SamplerContext } from "@/samplers";

import { quatCloseTo, vec3CloseTo } from "../math/helper";

describe("resolveParticleInit", () => {
	test("validates size", () => {
		expect(() =>
			resolveParticleInit({
				size: -5,
				color: "#ff0000",
				shape: { type: "circle" },
				lifetime: 1,
			}),
		).toThrow();
	});

	test("validates color", () => {
		expect(() =>
			resolveParticleInit({
				size: 10,
				color: "not-a-color",
				shape: { type: "circle" },
				lifetime: 1,
			}),
		).toThrow();
	});

	test("validates lifetime", () => {
		expect(() =>
			resolveParticleInit({
				size: 10,
				color: "#ff0000",
				shape: { type: "circle" },
				lifetime: -5,
			}),
		).toThrow();
	});

	test("fills in defaults for omitted properties", () => {
		const resolved = resolveParticleInit({
			size: 1,
			color: "#ff0000",
			shape: { type: "circle" },
			lifetime: 1,
		}) as ResolvedParticleInit & {
			position: Vec3;
			velocity: Vec3;
			orientation: Quat;
			angularVelocity: Vec3;
		};

		vec3CloseTo(resolved.position, { x: 0, y: 0, z: 0 });
		vec3CloseTo(resolved.velocity, { x: 0, y: 0, z: 0 });
		quatCloseTo(resolved.orientation, { x: 0, y: 0, z: 0, w: 1 });
		vec3CloseTo(resolved.angularVelocity, { x: 0, y: 0, z: 0 });
	});
});

const fakeParticleOptions: ResolvedParticleInit = {
	position: { x: 0, y: 0, z: 0 },
	velocity: { x: 0, y: 0, z: 0 },
	orientation: { x: 0, y: 0, z: 0, w: 1 },
	angularVelocity: { x: 0, y: 0, z: 0 },
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
	test("spawned particles own their sampled values", () => {
		const velocity: Vec3 = { x: 0, y: 50, z: 0 };
		const a = spawnParticle({ ...fakeParticleOptions, velocity }, fakeCtx);
		const b = spawnParticle({ ...fakeParticleOptions, velocity }, fakeCtx);

		a.velocity.y = 20;
		expect(b.velocity.y).toBe(50);
	});

	test("particle fields are not frozen", () => {
		const particle = spawnParticle(fakeParticleOptions, fakeCtx);

		expect(() => {
			particle.position.x = 1;
			particle.velocity.y = 1;
			particle.orientation.x = 1;
			particle.orientation.w = 0;
			particle.angularVelocity.z = 1;
		}).not.toThrow();
	});
});
