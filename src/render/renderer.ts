import { PartyJSError } from "../errors";
import type { Particle } from "../particle/particle";
import { drawFrame } from "./frame";
import type { ProjectionOrigin } from "./projection";

const DEFAULT_Z_INDEX = 2147483647;

export interface RendererOptions {
	zIndex?: number;
}

export interface Renderer {
	drawFrame(particles: readonly Particle[], origin: ProjectionOrigin): void;
	dispose(): void;
}

/**
 * Creates a renderer with its own canvas element, appended to `document.body` as a fixed,
 * full-viewport, pointer-events-none overlay.
 */
export function createRenderer(options: RendererOptions = {}): Renderer {
	const canvas = document.createElement("canvas");

	const supportsPopover = typeof canvas.showPopover === "function";
	if (supportsPopover) {
		canvas.popover = "manual";
	}

	canvas.style.position = "fixed";
	canvas.style.left = "0";
	canvas.style.top = "0";
	canvas.style.pointerEvents = "none";
	canvas.style.userSelect = "none";
	if (!supportsPopover)
		canvas.style.zIndex = String(options.zIndex ?? DEFAULT_Z_INDEX);

	const maybeCtx = canvas.getContext("2d");
	if (!maybeCtx) {
		throw new PartyJSError("failed to acquire a 2d canvas context");
	}
	const ctx: CanvasRenderingContext2D = maybeCtx;

	let logicalWidth = 0;
	let logicalHeight = 0;

	function resize(): void {
		const dpr = window.devicePixelRatio || 1;
		logicalWidth = window.innerWidth;
		logicalHeight = window.innerHeight;

		canvas.width = logicalWidth * dpr;
		canvas.height = logicalHeight * dpr;
		canvas.style.width = `${logicalWidth}px`;
		canvas.style.height = `${logicalHeight}px`;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	resize();
	window.addEventListener("resize", resize);
	document.body.appendChild(canvas);
	if (supportsPopover) canvas.showPopover();

	return {
		drawFrame(particles, origin) {
			drawFrame(ctx, particles, origin, logicalWidth, logicalHeight);
		},
		dispose() {
			window.removeEventListener("resize", resize);
			canvas.remove();
		},
	};
}
