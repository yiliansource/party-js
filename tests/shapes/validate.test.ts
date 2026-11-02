import { describe, expect, test } from "bun:test";

import { validateShape } from "@/shapes/validate";

describe("validateShape", () => {
	test("validates polygon shapes", () => {
		expect(() =>
			validateShape({ type: "polygon", sides: 2 }, "polygon"),
		).toThrow();
		expect(() =>
			validateShape({ type: "polygon", sides: NaN }, "polygon"),
		).toThrow();
	});

	test("validates star shapes", () => {
		expect(() =>
			validateShape({ type: "star", points: 2 }, "star"),
		).toThrow();
		expect(() =>
			validateShape({ type: "star", points: NaN }, "star"),
		).toThrow();
		for (const innerRadius of [0, 1.5, NaN]) {
			expect(() =>
				validateShape({ type: "star", innerRadius }, "star"),
			).toThrow();
		}
		expect(() =>
			validateShape(
				{ type: "star", points: 4, innerRadius: 0.22 },
				"star",
			),
		).not.toThrow();
	});

	test("validates square shapes", () => {
		expect(() =>
			validateShape({ type: "square", aspectRatio: -1 }, "square"),
		).toThrow();
		expect(() =>
			validateShape({ type: "square", aspectRatio: NaN }, "square"),
		).toThrow();
		expect(() =>
			validateShape({ type: "square", aspectRatio: -Infinity }, "square"),
		).toThrow();
		expect(() =>
			validateShape({ type: "square", aspectRatio: Infinity }, "square"),
		).toThrow();

		expect(() =>
			validateShape({ type: "square", cornerRadius: -2 }, "square"),
		).toThrow();
		expect(() =>
			validateShape({ type: "square", cornerRadius: NaN }, "square"),
		).toThrow();
	});
});
