/**
 * A string of text or emoji, rendered optionally with a specified font.
 *
 * @summary Draws a particle as text or emoji.
 *
 * @group Particles
 */
export interface TextShape {
	type: "text";
	/**
	 * The text to draw, for example an emoji or glyph like `*`.
	 */
	text: string;
	/**
	 * A CSS font family.
	 *
	 * @defaultValue sans-serif
	 */
	font?: string;
}

export const TEXT_BASE_SIZE = 100;

const layouts = new Map<string, { scale: number; x: number; y: number }>();

export function textLayout(
	ctx: CanvasRenderingContext2D,
	text: string,
	font: string,
) {
	const key = `${font}\n${text}`;
	let layout = layouts.get(key);
	if (!layout) {
		clearOnFontLoad();
		ctx.font = `${TEXT_BASE_SIZE}px ${font}`;
		ctx.textAlign = "left";
		ctx.textBaseline = "alphabetic";
		const m = ctx.measureText(text);
		const width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
		const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
		layout = {
			scale: 1 / Math.max(width, height, 1e-6),
			x: (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2,
			y: (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2,
		};
		layouts.set(key, layout);
	}
	return layout;
}

let listening = false;
function clearOnFontLoad(): void {
	if (listening || typeof document === "undefined" || !document.fonts) return;
	listening = true;
	document.fonts?.addEventListener("loadingdone", () => layouts.clear());
}
