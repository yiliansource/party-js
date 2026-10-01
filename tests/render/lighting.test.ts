import { describe, expect, test } from "bun:test";

import * as quat from "@/math/quat";
import * as vec3 from "@/math/vec3";
import { computeLightingCoefficient, createLighting } from "@/render/lighting";

describe("computeLightingCoefficient", () => {
	test("identity orientation with unitZ light gives coefficient 1", () => {
		const coefficient = computeLightingCoefficient(
			quat.identity,
			vec3.unitZ,
		);
		expect(coefficient).toBeCloseTo(1, 9);
	});

	test("orientation orthogonal to light gives coefficient 0", () => {
		const orientation = quat.fromAxisAngle(vec3.unitY, Math.PI / 2);
		const coefficient = computeLightingCoefficient(orientation, vec3.unitZ);
		expect(coefficient).toBeCloseTo(0, 9);
	});

	test("orientation facing away from light gives coefficient -1", () => {
		const orientation = quat.fromAxisAngle(vec3.unitX, Math.PI);
		const coefficient = computeLightingCoefficient(orientation, vec3.unitZ);
		expect(coefficient).toBeCloseTo(-1, 9);
	});

	test("does not normalize light, i.e. a longer vector scales the coefficient", () => {
		const coefficient = computeLightingCoefficient(quat.identity, {
			x: 0,
			y: 0,
			z: 2,
		});
		expect(coefficient).toBeCloseTo(2, 9);
	});
});

describe("createLighting", () => {
	const fixture = { l: 0.8, a: 0.1, b: -0.05, alpha: 0.9 };

	test("default options: coefficient 0 scales lightness by the ambient floor only", () => {
		const lighting = createLighting();
		expect(lighting(fixture, 0)).toEqual({
			l: expect.closeTo(0.4, 9), // 0.8 * (0.5 + 1 * 0)
			a: 0.1,
			b: -0.05,
			alpha: 0.9,
		});
	});

	test("default options: positive and negative coefficients of equal magnitude match (lit from both sides)", () => {
		const lighting = createLighting();
		const fromFront = lighting(fixture, 1);
		const fromBehind = lighting(fixture, -1);
		expect(fromFront).toEqual(fromBehind);
		expect(fromFront.l).toBeCloseTo(1.2, 9); // 0.8 * (0.5 + 1 * 1)
	});

	test("never brightens black; l stays 0 regardless of coefficient", () => {
		const lighting = createLighting();
		const black = { l: 0, a: 0.5, b: 0.5, alpha: 1 };
		expect(lighting(black, 1).l).toBe(0);
		expect(lighting(black, 0).l).toBe(0);
	});

	test("only ever touches l; a, b and alpha always pass through unchanged", () => {
		const lighting = createLighting({ ambient: 0.1, intensity: 3 });
		for (const coefficient of [0, 0.3, -0.7, 1, -1]) {
			const result = lighting(fixture, coefficient);
			expect(result.a).toBe(fixture.a);
			expect(result.b).toBe(fixture.b);
			expect(result.alpha).toBe(fixture.alpha);
		}
	});

	test("custom ambient/intensity are applied instead of the defaults", () => {
		const lighting = createLighting({ ambient: 0, intensity: 2 });
		expect(lighting(fixture, 0.3).l).toBeCloseTo(0.48, 9); // 0.8 * (0 + 2 * 0.3)
	});

	test("ambient: 1, intensity: 0 disables lighting entirely - color passes through unchanged", () => {
		const lighting = createLighting({ ambient: 1, intensity: 0 });
		expect(lighting(fixture, 0.7)).toEqual(fixture);
	});
});
