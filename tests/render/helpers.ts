import { expect } from "bun:test";

import { createCanvas } from "@napi-rs/canvas";

import { buildDrawCommand, type DrawCommand } from "@/render/drawCommand";

export interface CanvasTestContext {
	ctx: CanvasRenderingContext2D;
	/** Reads a single pixel as [r, g, b, a], in device pixels. */
	pixelAt(x: number, y: number): [number, number, number, number];
}

export function createTestContext(
	width: number,
	height: number,
): CanvasTestContext {
	const canvas = createCanvas(width, height);
	const napiCtx = canvas.getContext("2d");
	const ctx = napiCtx as unknown as CanvasRenderingContext2D;

	return {
		ctx,
		pixelAt(x, y) {
			const { data } = napiCtx.getImageData(x, y, 1, 1);
			return [data[0], data[1], data[2], data[3]];
		},
	};
}

/**
 * Builds a draw command, for shapes that always produce one, and fails the test if there's nothing to draw.
 */
export function ensureDrawCommand(
	...args: Parameters<typeof buildDrawCommand>
): DrawCommand {
	const cmd = buildDrawCommand(...args);
	expect(cmd).not.toBeNull();
	return cmd as DrawCommand;
}
