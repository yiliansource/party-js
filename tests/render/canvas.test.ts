import { describe, expect, test } from "bun:test";

import { executeDrawCommand } from "@/render/canvas";
import type { DrawCommand } from "@/render/drawCommand";
import { squarePath } from "@/shapes/square";

import { createTestContext } from "./helpers";

function squareCommand(
	transform: DrawCommand["transform"],
	fillStyle = "#ff0000",
): DrawCommand {
	return { kind: "path", path: squarePath(), transform, fillStyle };
}

describe("executeDrawCommand", () => {
	test("fills the path at the position and scale the transform specifies", () => {
		const { ctx, pixelAt } = createTestContext(100, 100);

		// a unit square scaled to 20px, centered at (50, 50), covers roughly 40-60 on both axes.
		executeDrawCommand(
			ctx,
			squareCommand({ a: 20, b: 0, c: 0, d: 20, e: 50, f: 50 }),
		);

		expect(pixelAt(50, 50)).toEqual([255, 0, 0, 255]);
		expect(pixelAt(45, 55)).toEqual([255, 0, 0, 255]);
		expect(pixelAt(10, 10)[3]).toBe(0); // well outside, untouched
		expect(pixelAt(65, 50)[3]).toBe(0); // just past the right edge
	});

	test("composes onto an existing base transform rather than replacing it", () => {
		const { ctx, pixelAt } = createTestContext(100, 100);

		ctx.scale(2, 2); // mimic a device-pixel-ratio

		// in the scaled space this is a 10-unit square at (25, 25), which in device pixels must land as a 20px square centered at (50, 50).
		executeDrawCommand(
			ctx,
			squareCommand({ a: 10, b: 0, c: 0, d: 10, e: 25, f: 25 }),
		);

		expect(pixelAt(50, 50)).toEqual([255, 0, 0, 255]);
		expect(pixelAt(25, 25)[3]).toBe(0); // if transform would have been replaced, the square would have landed at (25, 25)
	});

	test("leaves the context transform as it found it", () => {
		const { ctx } = createTestContext(100, 100);
		ctx.scale(2, 3);
		const before = ctx.getTransform();

		executeDrawCommand(
			ctx,
			squareCommand({ a: 5, b: 1, c: 2, d: 5, e: 10, f: 10 }),
		);

		const after = ctx.getTransform();
		expect([after.a, after.b, after.c, after.d, after.e, after.f]).toEqual([
			before.a,
			before.b,
			before.c,
			before.d,
			before.e,
			before.f,
		]);
	});

	test("a custom shape draws through the same transform", () => {
		const { ctx, pixelAt } = createTestContext(100, 100);

		const command: DrawCommand = {
			kind: "custom",
			transform: { a: 20, b: 0, c: 0, d: 20, e: 50, f: 50 },
			draw: (c) => {
				c.fillRect(-0.5, -0.5, 1, 1);
			},
			fillStyle: "#ff0000",
		};

		executeDrawCommand(ctx, command);

		expect(pixelAt(50, 50)).toEqual([255, 0, 0, 255]);
		expect(pixelAt(10, 10)[3]).toBe(0);
	});

	test("contains context state a custom shape changes", () => {
		const { ctx } = createTestContext(100, 100);

		const command: DrawCommand = {
			kind: "custom",
			transform: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
			draw: (c) => {
				c.globalAlpha = 0.25;
				c.scale(7, 7);
			},
			fillStyle: "#ff0000",
		};

		executeDrawCommand(ctx, command);

		expect(ctx.globalAlpha).toBe(1);
		const t = ctx.getTransform();
		expect([t.a, t.d]).toEqual([1, 1]);
	});
});
