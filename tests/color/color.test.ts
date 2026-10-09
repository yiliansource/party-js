import { describe, expect, test } from "bun:test";

import { type Color, color } from "@/color/color";
import { parse } from "@/color/parse";
import { PartyJSError } from "@/errors";

describe("color", () => {
	test("returns Color objects unchanged", () => {
		const c = { l: 0.5, a: 0.1, b: -0.1, alpha: 1 };
		expect(color(c)).toBe(c);
	});

	test("parses color strings", () => {
		expect(color("#ff8800")).toEqual(parse("#ff8800") as Color);
	});

	test("throws a PartyJSError on invalid input", () => {
		expect(() => color("not-a-color")).toThrow(PartyJSError);
		expect(() => color("not-a-color")).toThrow(
			'invalid color "not-a-color"',
		);
	});

	test("does not support named colors", () => {
		expect(() => color("red")).toThrow(PartyJSError);
	});
});
