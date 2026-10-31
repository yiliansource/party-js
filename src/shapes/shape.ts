import type { Particle } from "../particle";
import type { CircleShape } from "./circle";
import type { ImageShape } from "./image";
import type { PolygonShape } from "./polygon";
import type { SquareShape } from "./square";
import type { StarShape } from "./star";
import type { TextShape } from "./text";

/**
 * A shape determined by a {@link Path2D}.
 *
 * The path is expected to fit in a 1x1 box centered at (0, 0), oriented to have +y pointing down.
 * A supplied {@link Path2D} should only be created once, outside of any samplers, to avoid it being
 * created for every particle.
 *
 * @summary Draws a particle according to a given path.
 *
 * @group Particles
 */
export interface PathShape {
	type: "path";
	path: Path2D;
}

/**
 * A shape drawn by a custom function, for anything a {@link Path2D} cannot express, such as text,
 * images or gradients.
 *
 * The function is called once per particle on every frame. Before it is called, the context is transformed
 * into shape space (centered at (0, 0), with +y pointing down, rotated according to the particle's `orientation`,
 * with 1 unit being equal to the particle's size) and `fillStyle` is set to the particle's (lit) color.
 *
 * The function also receives the particle being drawn, so the drawing can depend on it.
 *
 * You are free to modify any context state, since it is saved and restored around each call. Nothing will be drawn
 * unless your function does so, for example via `ctx.fill()`.
 *
 * If the shape can be built using a {@link Path2D}, it is recommended to use {@link PathShape} instead.
 *
 * @summary A custom draw instruction for a particle.
 *
 * @example
 * ```ts
 * const heart: CustomShape = {
 *     type: "custom",
 *     draw(ctx) {
 *         ctx.font = "1px sans-serif";
 *         ctx.textAlign = "center";
 *         ctx.textBaseline = "middle";
 *         ctx.fillText("♥", 0, 0);
 *     },
 * };
 * ```
 *
 * @group Particles
 */
export interface CustomShape {
	type: "custom";
	/**
	 * Draws the particle, in shape space.
	 *
	 * @param ctx - The canvas' context, already transformed into shape space, with `fillStyle` set to the particle's
	 * lit color.
	 * @param particle - The particle being drawn. Read it to draw something that depends on the particle, like its
	 * `age`, or its opacity for drawings that don't use `fillStyle`. This should never modify the particle,
	 * such changes should be done via a {@link Behavior} instead.
	 */
	draw: (ctx: CanvasRenderingContext2D, particle: Readonly<Particle>) => void;
}

/**
 * Controls the way a particle is drawn onto the canvas.
 *
 * Every shape is drawn in the same space: centered at (0, 0), fitting inside a 1x1 box from -0.5 to 0.5,
 * with +y pointing down, as it would on a regular canvas. That box is then scaled to the particle's `size`,
 * rotated by its `orientation`, and the `fillStyle` is set to its (lit) `color`. Built-in and path shapes
 * are filled with this color, while custom shapes draw themselves.
 *
 * @summary The shape a particle is drawn as.
 *
 * @group Particles
 */
export type ParticleShape =
	| SquareShape
	| CircleShape
	| StarShape
	| PolygonShape
	| PathShape
	| TextShape
	| ImageShape
	| CustomShape;
