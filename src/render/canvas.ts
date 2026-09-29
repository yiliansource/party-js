import type { DrawCommand } from "./drawCommand";

/**
 * Executes a single draw command against a canvas context.
 */
export function executeDrawCommand(
	ctx: CanvasRenderingContext2D,
	command: DrawCommand,
): void {
	const { a, b, c, d, e, f } = command.transform;

	ctx.save();
	ctx.transform(a, b, c, d, e, f);

	ctx.fillStyle = command.fillStyle;
	if (command.kind === "path") {
		ctx.fill(command.path);
	} else {
		command.draw(ctx);
	}

	ctx.restore();
}
