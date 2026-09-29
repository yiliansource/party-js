import { describe, expect, test } from "bun:test";

import * as quat from "@/math/quat";
import * as vec3 from "@/math/vec3";
import { project } from "@/render/projection";

import { makeTestParticle } from "../helpers";

describe("project", () => {
	test("identity orientation only flips y and translates by position + origin", () => {
		const particle = makeTestParticle({
			position: { x: 10, y: 20, z: 0 },
			orientation: quat.identity,
			size: 1,
		});

		const t = project(particle, { x: 100, y: 200 });

		expect(t).toEqual({
			a: expect.closeTo(1, 9),
			b: expect.closeTo(0, 9),
			c: expect.closeTo(0, 9),
			d: expect.closeTo(-1, 9),
			e: expect.closeTo(110, 9),
			f: expect.closeTo(180, 9),
		});
	});

	test("size scales the linear part but not the translation", () => {
		const particle = makeTestParticle({
			position: { x: 5, y: 0, z: 0 },
			orientation: quat.identity,
			size: 3,
		});

		const t = project(particle, { x: 0, y: 0 });

		expect(t).toEqual({
			a: expect.closeTo(3, 9),
			b: expect.anything(),
			c: expect.anything(),
			d: expect.closeTo(-3, 9),
			e: expect.closeTo(5, 9),
			f: expect.anything(),
		});
	});

	test("in-plane (z-axis) rotation produces a pure 2D rotation, adjusted for the y-flip", () => {
		const angle = Math.PI / 6;
		const particle = makeTestParticle({
			orientation: quat.fromAxisAngle(vec3.unitZ, angle),
		});

		const t = project(particle, { x: 0, y: 0 });

		expect(t).toEqual({
			a: expect.closeTo(Math.cos(angle), 9),
			b: expect.closeTo(-Math.sin(angle), 9),
			c: expect.closeTo(-Math.sin(angle), 9),
			d: expect.closeTo(-Math.cos(angle), 9),
			e: expect.anything(),
			f: expect.anything(),
		});
	});

	test("tumbling around a world axis (y) squashes width without touching height", () => {
		const results = [0, 30, 60, 89].map((deg) => {
			const angle = (deg * Math.PI) / 180;
			const particle = makeTestParticle({
				orientation: quat.fromAxisAngle(vec3.unitY, angle),
			});
			return project(particle, { x: 0, y: 0 });
		});

		const widths = results.map((t) => Math.hypot(t.a, t.b));
		for (let i = 1; i < widths.length; i++) {
			expect(widths[i]).toBeLessThan(widths[i - 1]);
		}
		expect(widths[3]).toBeLessThan(0.02);

		// the local y axis never left the screen plane, so its projected length (the c,d column) should stay exactly 1
		for (const t of results) {
			expect(Math.hypot(t.c, t.d)).toBeCloseTo(1, 9);
		}
	});

	test("a compound tumble is a genuine shear, not a reduced rotation angle", () => {
		const q = quat.multiply(
			quat.fromAxisAngle(vec3.unitY, Math.PI / 3),
			quat.fromAxisAngle(vec3.unitX, Math.PI / 9),
		);
		const particle = makeTestParticle({ orientation: q });

		const t = project(particle, { x: 0, y: 0 });
		const dot = t.a * t.c + t.b * t.d;

		expect(Math.abs(dot)).toBeGreaterThan(0.01);
	});

	test("world z position is ignored (pure orthographic, no perspective)", () => {
		const near = makeTestParticle({ position: { x: 0, y: 0, z: -50 } });
		const far = makeTestParticle({ position: { x: 0, y: 0, z: 50 } });

		expect(project(near, { x: 0, y: 0 })).toEqual(
			project(far, { x: 0, y: 0 }),
		);
	});
});
