import { describe, expect, test } from "bun:test";

import * as vec3 from "../../src/math/vec3";
import { vec3CloseTo } from "./helper";

describe("vec3", () => {
	test("add is componentwise", () => {
		vec3CloseTo(vec3.add({ x: 1, y: 2, z: 3 }, { x: 4, y: -5, z: 6 }), {
			x: 5,
			y: -3,
			z: 9,
		});
	});

	test("sub is componentwise", () => {
		vec3CloseTo(vec3.sub({ x: 5, y: 3, z: 1 }, { x: 2, y: 2, z: 2 }), {
			x: 3,
			y: 1,
			z: -1,
		});
	});

	test("scale multiplies with vec3", () => {
		vec3CloseTo(vec3.scale({ x: 1, y: -2, z: 3 }, 2), {
			x: 2,
			y: -4,
			z: 6,
		});
	});

	test("scale multiplies with scalar", () => {
		vec3CloseTo(vec3.scale({ x: 2, y: -1, z: 4 }, 3), {
			x: 6,
			y: -3,
			z: 12,
		});
	});

	test("negate flips every component", () => {
		vec3CloseTo(vec3.negate({ x: 1, y: -2, z: 0 }), { x: -1, y: 2, z: -0 });
	});

	test("dot of orthogonal unit vectors is zero", () => {
		expect(vec3.dot(vec3.unitX, vec3.unitY)).toBe(0);
	});

	test("dot of a vector with itself equals squared length", () => {
		const v = { x: 3, y: 4, z: 0 };
		expect(vec3.dot(v, v)).toBeCloseTo(vec3.lengthSq(v), 9);
	});

	test("cross of x and y axes yields z axis", () => {
		vec3CloseTo(vec3.cross(vec3.unitX, vec3.unitY), vec3.unitZ);
	});

	test("cross of a vector with itself is zero", () => {
		vec3CloseTo(
			vec3.cross({ x: 3, y: -1, z: 7 }, { x: 3, y: -1, z: 7 }),
			vec3.zero,
		);
	});

	test("cross product is anti-commutative", () => {
		const a = { x: 1, y: 0, z: 0 };
		const b = { x: 0, y: 2, z: 0 };
		vec3CloseTo(vec3.cross(a, b), vec3.negate(vec3.cross(b, a)));
	});

	test("length of a 3-4-0 vector is 5", () => {
		expect(vec3.length({ x: 3, y: 4, z: 0 })).toBeCloseTo(5, 9);
	});

	test("length of the zero vector is zero", () => {
		expect(vec3.length(vec3.zero)).toBe(0);
	});

	test("normalize produces a unit-length vector in the same direction", () => {
		const n = vec3.normalize({ x: 10, y: 0, z: 0 });
		expect(vec3.length(n)).toBeCloseTo(1, 9);
		vec3CloseTo(n, vec3.unitX);
	});

	test("normalize does not divide by zero for the zero vector", () => {
		vec3CloseTo(vec3.normalize(vec3.zero), vec3.zero);
	});

	test("lerp at t=0 and t=1 returns endpoints", () => {
		const a = { x: 0, y: 0, z: 0 };
		const b = { x: 10, y: -10, z: 20 };
		vec3CloseTo(vec3.lerp(a, b, 0), a);
		vec3CloseTo(vec3.lerp(a, b, 1), b);
	});

	test("lerp at t=0.5 returns midpoint", () => {
		vec3CloseTo(
			vec3.lerp({ x: 0, y: 0, z: 0 }, { x: 10, y: -10, z: 20 }, 0.5),
			{ x: 5, y: -5, z: 10 },
		);
	});
});
