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

describe("executeDrawCommand with a text command", () => {
	// a 100px box, centered on a 200px canvas, spans 50 to 150 on both axes. glyph metrics differ between fonts and
	// platforms, and the edges are antialiased, so positions are checked to within a few pixels.
	const SIZE = 200;
	const box = { a: 100, b: 0, c: 0, d: 100, e: 100, f: 100 };
	// the test canvas measures glyphs snapped to the pixel grid, which can differ from the drawn outline by about a pixel.
	// small glyphs like "*" are scaled up the most to fill the box, so that error grows to a few pixels. a broken layout,
	// like centering on the font's line height, is off by well over 10px, so this still catches it.
	const TOLERANCE = 5;

	// "g" has a descender and "—" sits on the middle of the line, so neither is centered by the font's line box alone
	test.each(["*", "A", "g", "★", "Wy", "—"])(
		"%p fills the box in its longer direction, centered",
		(text) => {
			const canvas = createTestContext(SIZE, SIZE);

			executeDrawCommand(canvas.ctx, textCommand(text, box));

			const ink = inkBounds(canvas, SIZE);
			expect(ink).not.toBeNull();
			if (!ink) return;

			const width = ink.right - ink.left + 1;
			const height = ink.bottom - ink.top + 1;
			expect(Math.max(width, height)).toBeGreaterThanOrEqual(
				100 - 2 * TOLERANCE,
			);
			expect(ink.left).toBeGreaterThanOrEqual(50 - TOLERANCE);
			expect(ink.right).toBeLessThanOrEqual(150 + TOLERANCE);
			expect(ink.top).toBeGreaterThanOrEqual(50 - TOLERANCE);
			expect(ink.bottom).toBeLessThanOrEqual(150 + TOLERANCE);
			expect(
				Math.abs((ink.left + ink.right) / 2 - 100),
			).toBeLessThanOrEqual(TOLERANCE);
			expect(
				Math.abs((ink.top + ink.bottom) / 2 - 100),
			).toBeLessThanOrEqual(TOLERANCE);
		},
	);

	test("rotates with the transform around the particle's position", () => {
		const canvas = createTestContext(SIZE, SIZE);

		// a quarter turn: a tall glyph becomes wide
		executeDrawCommand(
			canvas.ctx,
			textCommand("|", { a: 0, b: 100, c: -100, d: 0, e: 100, f: 100 }),
		);

		const ink = inkBounds(canvas, SIZE);
		expect(ink).not.toBeNull();
		if (!ink) return;
		expect(ink.right - ink.left).toBeGreaterThan(ink.bottom - ink.top);
		expect(Math.abs((ink.left + ink.right) / 2 - 100)).toBeLessThanOrEqual(
			TOLERANCE,
		);
		expect(Math.abs((ink.top + ink.bottom) / 2 - 100)).toBeLessThanOrEqual(
			TOLERANCE,
		);
	});

	test("is filled with the fillStyle, including its opacity", () => {
		const opaque = createTestContext(SIZE, SIZE);
		const translucent = createTestContext(SIZE, SIZE);

		executeDrawCommand(opaque.ctx, textCommand("A", box, "#ff0000"));
		executeDrawCommand(
			translucent.ctx,
			textCommand("A", box, "rgb(255 0 0 / 0.5)"),
		);

		const pixel = findCoveredPixel(opaque, SIZE);
		expect(pixel).not.toBeNull();
		if (!pixel) return;
		expect(opaque.pixelAt(pixel.x, pixel.y)).toEqual([255, 0, 0, 255]);
		expect(translucent.pixelAt(pixel.x, pixel.y)[3]).toBeCloseTo(128, -1);
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

/**
 * A pixel the text covers fully, so its color isn't mixed with the background by antialiasing.
 */
function findCoveredPixel(
	{ pixelAt }: CanvasTestContext,
	size: number,
): { x: number; y: number } | null {
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (pixelAt(x, y)[3] === 255) return { x, y };
		}
	}
	return null;
}
