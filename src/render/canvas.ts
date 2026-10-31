import { TEXT_BASE_SIZE, textLayout } from "../shapes/text";
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

	if (command.kind !== "image") ctx.fillStyle = command.fillStyle;

	switch (command.kind) {
		case "path":
			ctx.fill(command.path);
			break;
		case "custom":
			command.draw(ctx, command.particle);
			break;
		case "text": {
			const { scale, x, y } = textLayout(ctx, command.text, command.font);
			ctx.scale(scale, scale);
			ctx.font = `${TEXT_BASE_SIZE}px ${command.font}`;
			ctx.textAlign = "left";
			ctx.textBaseline = "alphabetic";
			ctx.textRendering = "geometricPrecision";
			ctx.fillText(command.text, -x, -y);
			break;
		}
		case "image":
			ctx.globalAlpha *= command.alpha;
			ctx.drawImage(
				command.image,
				-command.width / 2,
				-command.height / 2,
				command.width,
				command.height,
			);
			break;
	}

	ctx.restore();
}
