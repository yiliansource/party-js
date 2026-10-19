import { assertBrowser } from "../errors";
import type { Vec2 } from "../math/vec2";
import type { EmissionShape } from "./shape";

/**
 * What an effect bursts out of: an element on the page, or a point.
 *
 * For an element, particles are emitted from the whole area. For a point, they spawn exactly there, in page
 * coordinates, i.e. in pixels from the top-left corner of the document, with +y pointing down. Either way,
 * the position is read only once, when the effect starts; moving or scrolling afterwards does not move
 * the effect.
 *
 * @summary An element or point that an effect bursts out of.
 *
 * @example
 * ```ts
 * confetti(document.querySelector("#submit")!);
 * confetti({ x: event.pageX, y: event.pageY });
 * ```
 *
 * @group Effects
 */
export type EffectTarget = HTMLElement | Vec2;

/**
 * Where an effect happens and which area its particles spawn from, as returned by
 * {@link emissionTarget | emissionTarget()}.
 *
 * @summary An effect's origin and the area its particles spawn from.
 *
 * @group Custom effects
 */
export interface EmissionTarget {
	/**
	 * The effect's origin, for {@link CreateEffectOptions.origin}: the target's center, in page coordinates,
	 * or in the canvas' coordinates if a canvas was given.
	 */
	origin: Vec2;
	/**
	 * The area particles spawn from, relative to the `origin`, for {@link emitFrom | emitFrom()}: the element's
	 * whole area, or a single point.
	 */
	shape: EmissionShape;
}

/**
 * Turns an element or a point into an origin and an emission area for {@link createEffect | createEffect()},
 * the same way the built-in effects like {@link confetti | confetti()} do. Use it to make a custom effect burst
 * out of an element.
 *
 * The target is measured once, when this function is called. Moving or scrolling afterwards does not
 * move the effect.
 *
 * @param target - An element, or a point in page coordinates.
 * @param canvas - The canvas the effect draws onto, if it doesn't use the default fullscreen canvas.
 * The origin is then measured from the canvas' top-left corner, as {@link CreateEffectOptions.canvas} expects.
 * @returns The origin, and the area for {@link emitFrom | emitFrom()}.
 *
 * @throws {@link PartyJSError} If called outside a browser, for example during server-side rendering.
 *
 * @summary Turns an element or point into an origin and an emission area.
 *
 * @example
 * ```ts
 * const { origin, shape } = emissionTarget(button);
 *
 * createEffect({
 *     origin,
 *     schedule: { bursts: [{ count: 30 }] },
 *     particleInit: {
 *         position: emitFrom(shape),
 *         // ...
 *     },
 * });
 * ```
 *
 * @group Custom effects
 */
export function emissionTarget(
	target: EffectTarget,
	canvas?: HTMLCanvasElement,
): EmissionTarget {
	assertBrowser();

	// where the coordinate system starts, in page coordinates: the canvas' drawing area, inside its border
	let offset: Vec2 = { x: 0, y: 0 };
	if (canvas) {
		const rect = canvas.getBoundingClientRect();
		offset = {
			x: rect.left + canvas.clientLeft + window.scrollX,
			y: rect.top + canvas.clientTop + window.scrollY,
		};
	}

	if (target instanceof HTMLElement) {
		const rect = target.getBoundingClientRect();
		return {
			origin: {
				x: rect.left + rect.width / 2 + window.scrollX - offset.x,
				y: rect.top + rect.height / 2 + window.scrollY - offset.y,
			},
			shape: { type: "rect", width: rect.width, height: rect.height },
		};
	}

	return {
		origin: { x: target.x - offset.x, y: target.y - offset.y },
		shape: { type: "disk", radius: 0 },
	};
}
