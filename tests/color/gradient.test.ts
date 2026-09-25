import { describe, expect, test } from "bun:test";

import { createGradient, evaluateGradient } from "../../src/color/gradient";

// reference l,a,b values below were computed independently

describe("evaluateGradient", () => {
	const redToBlue = createGradient(["red", "blue"]);

	test("interpolates a point 1/4th of the way between two stops", () => {
		const c = evaluateGradient(redToBlue, 0.25);
		expect(c).toEqual({
			l: expect.closeTo(0.5839699524846793, 6),
			a: expect.closeTo(0.27139030065223335, 6),
			b: expect.closeTo(-0.009769227690160084, 6),
			alpha: 1,
		});
	});

	test("interpolates the midpoint between two stops", () => {
		const c = evaluateGradient(redToBlue, 0.5);
		expect(c).toEqual({
			l: expect.closeTo(0.5399845410479274, 6),
			a: expect.closeTo(0.23842408702518889, 6),
			b: expect.closeTo(-0.15695540301146144, 6),
			alpha: 1,
		});
	});

	test("interpolates a point 3/4ths of the way between two stops", () => {
		const c = evaluateGradient(redToBlue, 0.75);
		expect(c).toEqual({
			l: expect.closeTo(0.49599912961117554, 6),
			a: expect.closeTo(0.1281459681403781, 6),
			b: expect.closeTo(-0.27051437677312284, 6),
			alpha: 1,
		});
	});

	test("midpoint interpolation happens in Oklch, not Oklab", () => {
		// this pins down in which space we interpolate
		const c = evaluateGradient(redToBlue, 0.5);
		const chroma = Math.sqrt(c.a * c.a + c.b * c.b);
		expect(chroma).toBeGreaterThan(0.2);
	});

	test("interior offset lands on a middle stop in a 3-stop gradient", () => {
		const middle = evaluateGradient(
			createGradient(["red", "green", "blue"]),
			0.5,
		);
		const green = evaluateGradient(createGradient(["green"]), 0);

		expect(middle).toEqual({
			l: expect.closeTo(green.l, 9),
			a: expect.closeTo(green.a, 9),
			b: expect.closeTo(green.b, 9),
			alpha: expect.closeTo(green.alpha, 9),
		});
	});
});
