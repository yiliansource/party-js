import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { executeDrawCommand } from "@/render/canvas";
import type { DrawCommand } from "@/render/drawCommand";
import { textLayout } from "@/shapes/text";
import { validateShape } from "@/shapes/validate";

import { makeTestParticle } from "../helpers";
import {
	type CanvasTestContext,
	createTestContext,
	ensureDrawCommand,
} from "../render/helpers";

const identityTransform = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

// the text shape clears its measurements when web fonts finish loading, which needs `document.fonts`. bun has no
// document, so a minimal one is provided for the whole file, before anything is measured.
const globals = globalThis as Record<string, unknown>;
const savedDocument = globals.document;
const fonts = new EventTarget();

beforeAll(() => {
	globals.document = { fonts };
});

afterAll(() => {
	globals.document = savedDocument;
});

/**
 * The box around every pixel that was drawn noticeably, in device pixels.
 */
function inkBounds(
	{ pixelAt }: CanvasTestContext,
	size: number,
): { left: number; right: number; top: number; bottom: number } | null {
	let left = Infinity;
	let right = -Infinity;
	let top = Infinity;
	let bottom = -Infinity;
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (pixelAt(x, y)[3] <= 20) continue;
			left = Math.min(left, x);
			right = Math.max(right, x);
			top = Math.min(top, y);
			bottom = Math.max(bottom, y);
		}
	}
	return right < 0 ? null : { left, right, top, bottom };
}

function textCommand(
	text: string,
	transform: DrawCommand["transform"],
	fillStyle = "#ff0000",
): DrawCommand {
	return { kind: "text", text, font: "sans-serif", transform, fillStyle };
}

describe("buildDrawCommand with a text shape", () => {
	test("produces a text command carrying the text and font", () => {
		const particle = makeTestParticle({
			shape: { type: "text", text: "★", font: "serif" },
		});

		const cmd = ensureDrawCommand(particle, identityTransform);

		expect(cmd.kind).toBe("text");
		if (cmd.kind === "text") {
			expect(cmd.text).toBe("★");
			expect(cmd.font).toBe("serif");
		}
	});

	test("falls back to sans-serif without a font", () => {
		const particle = makeTestParticle({
			shape: { type: "text", text: "★" },
		});

		const cmd = ensureDrawCommand(particle, identityTransform);

		expect(cmd.kind === "text" && cmd.font).toBe("sans-serif");
	});
});

describe("textLayout", () => {
	test("measures each text and font once", () => {
		const { ctx } = createTestContext(1, 1);

		const first = textLayout(ctx, "cached", "sans-serif");

		expect(textLayout(ctx, "cached", "sans-serif")).toBe(first);
		expect(textLayout(ctx, "cached", "serif")).not.toBe(first);
		expect(textLayout(ctx, "other", "sans-serif")).not.toBe(first);
	});

	test("measures again once web fonts have loaded", () => {
		// before a web font has loaded, the fallback font is measured, so that measurement must not stick
		const { ctx } = createTestContext(1, 1);
		const before = textLayout(ctx, "web font", "sans-serif");

		fonts.dispatchEvent(new Event("loadingdone"));

		expect(textLayout(ctx, "web font", "sans-serif")).not.toBe(before);
	});
});

/**
 * Glyph measurements at 100px, as `measureText` reports them for left-aligned text on the alphabetic baseline: how far
 * the ink reaches left of, right of, above and below the point the text is drawn at. Negative values mean the ink
 * stops short of that side, like the "—" that sits above the baseline. They're made up but shaped like real glyphs, so
 * the layout is checked without depending on the fonts of the machine running the tests.
 */
const GLYPHS: Record<
	string,
	{ left: number; right: number; ascent: number; descent: number }
> = {
	// small, and floating above the baseline
	"*": { left: -1, right: 38, ascent: 69, descent: -33 },
	A: { left: 0, right: 67, ascent: 69, descent: 0 },
	// a descender, so the ink isn't centered on the baseline or the line box
	g: { left: -4, right: 49, ascent: 52, descent: 19 },
	// a symbol whose ink overhangs the left of where it's drawn
	"★": { left: 6, right: 82, ascent: 73, descent: 4 },
	// wider than tall
	Wy: { left: 1, right: 128, ascent: 69, descent: 21 },
	// sits on the middle of the line
	"—": { left: 0, right: 100, ascent: 29, descent: -22 },
	// much taller than wide
	"|": { left: -9, right: 17, ascent: 74, descent: 21 },
};

type Matrix = [number, number, number, number, number, number];

function multiply(m: Matrix, n: Matrix): Matrix {
	return [
		m[0] * n[0] + m[2] * n[1],
		m[1] * n[0] + m[3] * n[1],
		m[0] * n[2] + m[2] * n[3],
		m[1] * n[2] + m[3] * n[3],
		m[0] * n[4] + m[2] * n[5] + m[4],
		m[1] * n[4] + m[3] * n[5] + m[5],
	];
}

interface FakeTextContext {
	ctx: CanvasRenderingContext2D;
	/** The context's text settings at every `measureText` call. */
	measured: { font: string; textAlign: string; textBaseline: string }[];
	/** Every `fillText` call, with the context's state at the time. */
	drawn: {
		text: string;
		font: string;
		textAlign: string;
		textBaseline: string;
		fillStyle: string;
		/** The box the glyph's ink covers on the canvas. */
		ink: { left: number; right: number; top: number; bottom: number };
	}[];
}

/**
 * A stand-in for a canvas context that measures text with {@link GLYPHS} and records where text is drawn, instead of
 * rendering it with a real font.
 */
function createFakeTextContext(): FakeTextContext {
	const drawn: FakeTextContext["drawn"] = [];
	const measured: FakeTextContext["measured"] = [];
	const stack: Matrix[] = [];
	let matrix: Matrix = [1, 0, 0, 1, 0, 0];

	const fontSize = (font: string): number => {
		const match = /([\d.]+)px/.exec(font);
		if (!match) throw new Error(`no px size in font "${font}"`);
		return Number(match[1]);
	};
	const glyph = (text: string) => {
		const metrics = GLYPHS[text];
		if (!metrics)
			throw new Error(`no test metrics for ${JSON.stringify(text)}`);
		return metrics;
	};

	const fake = {
		font: "10px sans-serif",
		textAlign: "start",
		textBaseline: "alphabetic",
		textRendering: "auto",
		fillStyle: "#000000",
		save() {
			stack.push(matrix);
		},
		restore() {
			matrix = stack.pop() ?? matrix;
		},
		transform(
			a: number,
			b: number,
			c: number,
			d: number,
			e: number,
			f: number,
		) {
			matrix = multiply(matrix, [a, b, c, d, e, f]);
		},
		scale(x: number, y: number) {
			matrix = multiply(matrix, [x, 0, 0, y, 0, 0]);
		},
		measureText(text: string) {
			measured.push({
				font: fake.font,
				textAlign: fake.textAlign,
				textBaseline: fake.textBaseline,
			});
			const k = fontSize(fake.font) / 100;
			const g = glyph(text);
			return {
				actualBoundingBoxLeft: g.left * k,
				actualBoundingBoxRight: g.right * k,
				actualBoundingBoxAscent: g.ascent * k,
				actualBoundingBoxDescent: g.descent * k,
			};
		},
		fillText(text: string, x: number, y: number) {
			const k = fontSize(fake.font) / 100;
			const g = glyph(text);
			const corners = [
				[x - g.left * k, y - g.ascent * k],
				[x + g.right * k, y - g.ascent * k],
				[x - g.left * k, y + g.descent * k],
				[x + g.right * k, y + g.descent * k],
			].map(([px, py]) => [
				matrix[0] * px + matrix[2] * py + matrix[4],
				matrix[1] * px + matrix[3] * py + matrix[5],
			]);
			const xs = corners.map(([px]) => px);
			const ys = corners.map(([, py]) => py);
			drawn.push({
				text,
				font: fake.font,
				textAlign: fake.textAlign,
				textBaseline: fake.textBaseline,
				fillStyle: fake.fillStyle,
				ink: {
					left: Math.min(...xs),
					right: Math.max(...xs),
					top: Math.min(...ys),
					bottom: Math.max(...ys),
				},
			});
		},
	};

	return {
		ctx: fake as unknown as CanvasRenderingContext2D,
		measured,
		drawn,
	};
}

describe("executeDrawCommand with a text command", () => {
	// a 100px box centered on (100, 100) spans 50 to 150 on both axes
	const SIZE = 200;
	const box = { a: 100, b: 0, c: 0, d: 100, e: 100, f: 100 };

	/** Draws the text with the fake context and returns the single glyph it drew. */
	function drawFake(text: string, transform = box, fillStyle = "#ff0000") {
		const fake = createFakeTextContext();
		executeDrawCommand(fake.ctx, {
			kind: "text",
			text,
			font: "test-font",
			transform,
			fillStyle,
		});
		expect(fake.drawn).toHaveLength(1);
		return fake.drawn[0];
	}

	test.each(["*", "A", "g", "★", "Wy", "—", "|"])(
		"%p fills the box in its longer direction, centered",
		(text) => {
			const { ink } = drawFake(text);

			const width = ink.right - ink.left;
			const height = ink.bottom - ink.top;
			expect(Math.max(width, height)).toBeCloseTo(100);
			expect((ink.left + ink.right) / 2).toBeCloseTo(100);
			expect((ink.top + ink.bottom) / 2).toBeCloseTo(100);
		},
	);

	test("draws with the font settings it measured with", () => {
		// the layout is only right if the text is drawn exactly as it was measured. measurements are cached per text and
		// font, so a font no other test uses makes sure this one measures.
		const fake = createFakeTextContext();
		executeDrawCommand(fake.ctx, {
			kind: "text",
			text: "g",
			font: "settings-test-font",
			transform: box,
			fillStyle: "#ff0000",
		});

		expect(fake.measured).toHaveLength(1);
		expect(fake.drawn).toHaveLength(1);
		const { text, font, textAlign, textBaseline } = fake.drawn[0];
		expect(text).toBe("g");
		expect({ font, textAlign, textBaseline }).toEqual(fake.measured[0]);
		expect(font).toBe("100px settings-test-font");
	});

	test("rotates with the transform around the particle's position", () => {
		// a quarter turn: a tall glyph becomes wide
		const { ink } = drawFake("|", {
			a: 0,
			b: 100,
			c: -100,
			d: 0,
			e: 100,
			f: 100,
		});

		expect(ink.right - ink.left).toBeCloseTo(100);
		expect(ink.bottom - ink.top).toBeLessThan(50);
		expect((ink.left + ink.right) / 2).toBeCloseTo(100);
		expect((ink.top + ink.bottom) / 2).toBeCloseTo(100);
	});

	test("is filled with the fillStyle, including its opacity", () => {
		expect(drawFake("A", box, "#ff0000").fillStyle).toBe("#ff0000");
		expect(drawFake("A", box, "rgb(255 0 0 / 0.5)").fillStyle).toBe(
			"rgb(255 0 0 / 0.5)",
		);
	});

	test("draws nothing for empty text, without throwing", () => {
		const canvas = createTestContext(SIZE, SIZE);

		expect(() =>
			executeDrawCommand(canvas.ctx, textCommand("", box)),
		).not.toThrow();
		expect(inkBounds(canvas, SIZE)).toBeNull();
	});

	test("leaves the context's text settings as it found them", () => {
		const { ctx } = createTestContext(10, 10);
		ctx.font = "12px serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		executeDrawCommand(ctx, textCommand("A", box));

		expect([ctx.font, ctx.textAlign, ctx.textBaseline]).toEqual([
			"12px serif",
			"center",
			"middle",
		]);
	});
});

describe("validateShape with a text shape", () => {
	test("accepts text with or without a font", () => {
		expect(() =>
			validateShape({ type: "text", text: "★" }, "shape"),
		).not.toThrow();
		expect(() =>
			validateShape({ type: "text", text: "★", font: "serif" }, "shape"),
		).not.toThrow();
	});

	test("rejects empty or missing text", () => {
		expect(() =>
			validateShape({ type: "text", text: "" }, "shape"),
		).toThrow();
		expect(() =>
			validateShape(
				{ type: "text" } as unknown as { type: "text"; text: string },
				"shape",
			),
		).toThrow();
	});

	test("rejects an empty font, which the canvas would silently ignore", () => {
		expect(() =>
			validateShape({ type: "text", text: "★", font: "" }, "shape"),
		).toThrow();
	});
});
