import { PartyJSError } from "../errors";
import type { Particle } from "../particle/particle";
import { drawFrame } from "./frame";
import type { ProjectionOrigin } from "./projection";

const DEFAULT_Z_INDEX = 2147483647;

export interface RendererOptions {
	canvas?: HTMLCanvasElement;
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
	const canvas = options.canvas ?? document.createElement("canvas");
	const ownsCanvas = options.canvas === undefined;

	const supportsPopover = typeof canvas.showPopover === "function";
	if (ownsCanvas && supportsPopover) {
		canvas.popover = "manual";
	}

	if (ownsCanvas) {
		Object.assign(canvas.style, {
			position: "fixed",
			inset: "0",
			margin: "0",
			border: "none",
			padding: "0",
			background: "transparent",
			pointerEvents: "none",
			userSelect: "none",
			...(supportsPopover
				? {}
				: { zIndex: String(options.zIndex ?? DEFAULT_Z_INDEX) }),
		} satisfies Partial<CSSStyleDeclaration>);
	}

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
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	if (ownsCanvas) {
		document.body.appendChild(canvas);
		if (supportsPopover) canvas.showPopover();
	}

	resize();

	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(canvas);

	return {
		drawFrame(particles, origin) {
			drawFrame(ctx, particles, origin, logicalWidth, logicalHeight);
		},
		dispose() {
			resizeObserver.disconnect();
			if (ownsCanvas) canvas.remove();
		},
	};
}
