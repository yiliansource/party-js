import { PartyJSError } from "../errors";
import type { Vec2 } from "../math/vec2";
import type { Vec3 } from "../math/vec3";
import type { Particle } from "../particle/particle";
import { drawParticles } from "./frame";
import type { LightingFn } from "./lighting";
import { type AnimationLoop, createAnimationLoop } from "./loop";

/**
 * Something drawn onto a surface every frame, usually a single effect.
 */
export interface Layer {
	readonly particles: readonly Particle[];
	/**
	 * In page coordinates for the overlay, in canvas coordinates for a provided canvas.
	 */
	readonly origin: Vec2;
	readonly light?: Vec3;
	readonly lighting?: LightingFn;
	/**
	 * Once true, the layer is drawn one last time, detached, and its `onComplete` is called.
	 */
	readonly done: boolean;
	/**
	 * A paused layer is still drawn every frame, but not advanced.
	 */
	readonly paused: boolean;
	advance(elapsedSeconds: number): void;
	onComplete?(): void;
}

export interface LayerHandle {
	/**
	 * Removes the layer without calling its `onComplete`. Safe to call more than once.
	 */
	detach(): void;
	/**
	 * Restarts the surface's loop after the layer was resumed.
	 */
	wake(): void;
}

const FALLBACK_Z_INDEX = 2147483647;

function createOverlayCanvas(): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	const supportsPopover = typeof canvas.showPopover === "function";
	if (supportsPopover) canvas.popover = "manual";

	canvas.setAttribute("data-party-js", "");
	canvas.setAttribute("aria-hidden", "true");

	Object.assign(canvas.style, {
		position: "fixed",
		inset: "0",
		width: "100%",
		height: "100%",
		margin: "0",
		border: "none",
		padding: "0",
		background: "transparent",
		pointerEvents: "none",
		userSelect: "none",
		...(supportsPopover ? {} : { zIndex: String(FALLBACK_Z_INDEX) }),
	} satisfies Partial<CSSStyleDeclaration>);

	document.body.appendChild(canvas);
	if (supportsPopover) canvas.showPopover();

	return canvas;
}

interface Surface {
	attach(layer: Layer): LayerHandle;
}

let overlay: Surface | null = null;
const provided = new Map<HTMLCanvasElement, Surface>();

/**
 * Attaches a layer to the surface of the given canvas, or to the shared page overlay if no canvas is given.
 * Surfaces are created on the first attach and torn down once their last layer detaches.
 */
export function attachLayer(
	layer: Layer,
	canvas?: HTMLCanvasElement,
): LayerHandle {
	if (canvas === undefined) {
		overlay ??= createSurface(createOverlayCanvas(), true, () => {
			overlay = null;
		});
		return overlay.attach(layer);
	} else {
		let surface = provided.get(canvas);
		if (!surface) {
			surface = createSurface(canvas, false, () =>
				provided.delete(canvas),
			);
			provided.set(canvas, surface);
		}
		return surface.attach(layer);
	}
}

function createSurface(
	canvas: HTMLCanvasElement,
	isOverlay: boolean,
	onEmpty: () => void,
): Surface {
	const maybeCtx = canvas.getContext("2d");
	if (!maybeCtx)
		throw new PartyJSError(
			"couldn't get a 2D context from the canvas - it may already be used with a different context type, such as WebGL",
		);
	const ctx: CanvasRenderingContext2D = maybeCtx;

	const layers: Layer[] = [];
	let width = 0;
	let height = 0;

	function render(elapsedSeconds: number | null): void {
		ctx.clearRect(0, 0, width, height);

		// a snapshot, since layers can be removed (on errors) or added (from onComplete) while rendering
		for (const layer of [...layers]) {
			try {
				if (elapsedSeconds !== null && !layer.paused)
					layer.advance(elapsedSeconds);

				drawParticles(
					ctx,
					layer.particles,
					toLocal(layer.origin),
					layer.light,
					layer.lighting,
				);
			} catch (error) {
				// one broken effect shouldn't take down every other effect on the surface
				remove(layer);
				reportError(error);
			}
		}

		for (const layer of [...layers]) {
			if (!layer.done) continue;

			remove(layer);
			layer.onComplete?.();
		}

		// paused layers stay visible without redrawing, so there's nothing to animate
		if (layers.every((layer) => layer.paused)) loop.stop();
	}

	function toLocal(point: Vec2): Vec2 {
		// the overlay is fixed to the viewport, while origins are given in page coordinates
		return isOverlay
			? { x: point.x - window.scrollX, y: point.y - window.scrollY }
			: point;
	}

	const loop: AnimationLoop = createAnimationLoop(render);

	function resize(): void {
		const dpr = window.devicePixelRatio || 1;
		width = canvas.clientWidth;
		height = canvas.clientHeight;

		canvas.width = width * dpr;
		canvas.height = height * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		// resizing wipes the bitmap, a running loop redraws on its next frame anyway
		if (!loop.running && layers.length > 0) render(null);
	}

	function scroll(): void {
		if (!loop.running) render(null);
	}

	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(canvas);
	resize();

	if (isOverlay) window.addEventListener("scroll", scroll, { passive: true });

	function remove(layer: Layer): void {
		const index = layers.indexOf(layer);
		if (index === -1) return;

		layers.splice(index, 1);
		if (layers.length === 0) teardown();
	}

	function teardown(): void {
		loop.stop();
		resizeObserver.disconnect();
		onEmpty();

		if (isOverlay) {
			canvas.remove();
			window.removeEventListener("scroll", scroll);
		} else {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	return {
		attach(layer) {
			// a dialog opened since the overlay was shown would cover it, so move it back to the top
			if (isOverlay && layers.length > 0 && canvas.hidePopover) {
				canvas.hidePopover();
				canvas.showPopover();
			}

			layers.push(layer);
			loop.start();

			return {
				detach: () => {
					remove(layer);
				},
				wake: () => {
					if (layers.includes(layer)) loop.start();
				},
			};
		},
	};
}
