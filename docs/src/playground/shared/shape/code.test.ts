/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import { type Token, toText } from "../tokens";
import { shapeLiteral } from "./code";
import { createShapeDraft, SHAPE_DEFAULTS, type ShapeDraft } from "./draft";

const code = (overrides: Partial<ShapeDraft>) =>
	toText(shapeLiteral({ ...createShapeDraft(), ...overrides }));

describe("shapeLiteral", () => {
	test("a circle has only its type", () => {
		expect(code({ type: "circle" })).toBe('{ type: "circle" }');
	});

	test("only the selected type's settings are written", () => {
		// the draft keeps every type's settings, so switching types must not leak the others into the code
		expect(
			code({
				type: "circle",
				square: { aspectRatio: 0.5, cornerRadius: 0.3 },
				star: { ...SHAPE_DEFAULTS.star, points: 7 },
			}),
		).toBe('{ type: "circle" }');
	});

	test("settings that match the library's defaults are left out", () => {
		expect(code({ type: "star", star: { ...SHAPE_DEFAULTS.star } })).toBe(
			'{ type: "star" }',
		);
		expect(
			code({ type: "square", square: { ...SHAPE_DEFAULTS.square } }),
		).toBe('{ type: "square" }');
	});

	test("changed settings are written in a fixed order", () => {
		expect(
			code({ type: "star", star: { ...SHAPE_DEFAULTS.star, points: 4 } }),
		).toBe('{ type: "star", points: 4 }');
		expect(
			code({ type: "star", star: { points: 4, innerRadius: 0.22 } }),
		).toBe('{ type: "star", points: 4, innerRadius: 0.22 }');
		expect(
			code({
				type: "square",
				square: { aspectRatio: 0.5, cornerRadius: 0.1 },
			}),
		).toBe('{ type: "square", aspectRatio: 0.5, cornerRadius: 0.1 }');
	});

	test("a square with only one changed setting writes just that one", () => {
		expect(
			code({
				type: "square",
				square: { aspectRatio: 1, cornerRadius: 0.25 },
			}),
		).toBe('{ type: "square", cornerRadius: 0.25 }');
	});

	test("slider noise is rounded away", () => {
		expect(
			code({
				type: "square",
				square: { aspectRatio: 0.1 + 0.2, cornerRadius: 0 },
			}),
		).toBe('{ type: "square", aspectRatio: 0.3 }');
	});

	test("a polygon always writes its sides, since they're required", () => {
		expect(code({ type: "polygon", polygon: { sides: 5 } })).toBe(
			'{ type: "polygon", sides: 5 }',
		);
	});

	test("a path is written as a Path2D, trimmed and escaped", () => {
		expect(
			code({ type: "path", path: { d: '  M0 0 L0.5 0.5 "x  ' } }),
		).toBe('{ type: "path", path: new Path2D("M0 0 L0.5 0.5 \\"x") }');
	});

	test("text writes its font only when one is set", () => {
		expect(code({ type: "text", text: { text: "★", font: "" } })).toBe(
			'{ type: "text", text: "★" }',
		);
		expect(code({ type: "text", text: { text: "★", font: "serif" } })).toBe(
			'{ type: "text", text: "★", font: "serif" }',
		);
	});

	test("an image is written with its URL as `image`, matching the shape's field", () => {
		expect(code({ type: "image", image: { image: " /logo.png " } })).toBe(
			'{ type: "image", image: "/logo.png" }',
		);
	});

	test.each<Partial<ShapeDraft>>([
		{ type: "square", square: { aspectRatio: 0.5, cornerRadius: 0.1 } },
		{ type: "star", star: { ...SHAPE_DEFAULTS.star, points: 7 } },
		{ type: "polygon", polygon: { sides: 6 } },
		{ type: "path", path: { d: 'M0 0 "quoted"' } },
		{
			type: "text",
			text: { text: 'say "hi"', font: '"Comic Sans MS", serif' },
		},
		{ type: "image", image: { image: '/a "b".png' } },
	])("a $type is a valid object literal", (draft) => {
		const text = code(draft);
		expect(() => new Function(`return (${text});`)).not.toThrow();
	});

	test("tokens are colored like the docs' code blocks", () => {
		const kindOf = (tokens: Token[], text: string) =>
			tokens.find((t) => t.text === text)?.kind;

		const tokens = shapeLiteral({
			...createShapeDraft(),
			type: "path",
			path: { d: "M0 0" },
		});
		expect(kindOf(tokens, '"path"')).toBe("string");
		expect(kindOf(tokens, "new")).toBe("keyword");
		expect(kindOf(tokens, "Path2D")).toBe("fn");

		const star = shapeLiteral({
			...createShapeDraft(),
			type: "star",
			star: { ...SHAPE_DEFAULTS.star, points: 4 },
		});
		expect(kindOf(star, "4")).toBe("value");
	});
});
