import { PartyJSError } from "../errors";
import type { Vec2 } from "../math/vec2";
import type { Vec3 } from "../math/vec3";
import type { Particle } from "../particle/particle";
import { drawFrame } from "./frame";
import type { LightingFn } from "./lighting";

const DEFAULT_Z_INDEX = 2147483647;

export interface RendererOptions {
	canvas?: HTMLCanvasElement;
	zIndex?: number;
}

export interface Renderer {
	drawFrame(
		particles: readonly Particle[],
		origin: Vec2,
		light?: Vec3,
		lighting?: LightingFn,
	): void;
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

	if (ownsCanvas) {
		if (supportsPopover) canvas.popover = "manual";

		canvas.setAttribute("data-party-js", "");
		canvas.setAttribute("aria-hidden", "true");

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

		logicalWidth = ownsCanvas ? window.innerWidth : canvas.clientWidth;
		logicalHeight = ownsCanvas ? window.innerHeight : canvas.clientHeight;

		if (ownsCanvas) {
			canvas.style.width = `${logicalWidth}px`;
			canvas.style.height = `${logicalHeight}px`;
		}

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
		drawFrame(particles, origin, light, lighting) {
			drawFrame(
				ctx,
				particles,
				origin,
				logicalWidth,
				logicalHeight,
				light,
				lighting,
			);
		},
		dispose() {
			resizeObserver.disconnect();
			if (ownsCanvas) canvas.remove();
		},
	};
}
