import { describe, expect, test } from "bun:test";

import { color } from "../../src/color/color";
import { PartyJSError } from "../../src/errors";

describe("color", () => {
	test("parses black and white to oklab", () => {
		expect(color("#ffffff")).toEqual({
			l: expect.closeTo(1, 6),
			a: expect.closeTo(0, 6),
			b: expect.closeTo(0, 6),
			alpha: 1,
		});
		expect(color("#000000")).toEqual({
			l: expect.closeTo(0, 6),
			a: expect.closeTo(0, 6),
			b: expect.closeTo(0, 6),
			alpha: 1,
		});
	});

	test("parses pure red to to oklab", () => {
		expect(color("#ff0000")).toEqual({
			l: expect.closeTo(0.6279553639214311, 6),
			a: expect.closeTo(0.22486306842627443, 6),
			b: expect.closeTo(0.12584627733058495, 6),
			alpha: 1,
		});
	});

	test("parses pure blue to oklab", () => {
		expect(color("#0000ff")).toEqual({
			l: expect.closeTo(0.45201371817442365, 6),
			a: expect.closeTo(-0.032456975170797764, 6),
			b: expect.closeTo(-0.31152816567757763, 6),
			alpha: 1,
		});
	});

	test("parses gray to mid lightness", () => {
		expect(color("#808080")).toEqual({
			l: expect.closeTo(0.5998708056221468, 6),
			a: expect.closeTo(0, 6),
			b: expect.closeTo(0, 6),
			alpha: 1,
		});
	});

	test("different colors do not produce the same value", () => {
		const red = color("#ff0000");
		const blue = color("#0000ff");
		expect(red).not.toEqual(blue);
	});

	test("equivalent hex and rgb inputs parse to the same color", () => {
		expect(color("#ff0000")).toEqual(color("rgb(255, 0, 0)"));
	});

	test("preserves alpha when specified", () => {
		expect(color("rgba(255, 0, 0, 0.5)").alpha).toBeCloseTo(0.5, 2);
	});

	test("is idempotent on converted colors", () => {
		const c = color("#ff8800");
		expect(color(c)).toBe(c);
	});

	test("throws a PartyJSError on invalid input", () => {
		expect(() => color("not-a-color")).toThrow(PartyJSError);
	});
});
