import type { CircleShape } from "./circle";
import type { PolygonShape } from "./polygon";
import type { SquareShape } from "./square";
import type { StarShape } from "./star";

/**
 * A shape determined by a {@link Path2D}.
 *
 * The path is expected to fit in a 1x1 box centered at (0, 0), oriented to have +y pointing down.
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
 * into shape space (centered at (0, 0), with +y pointing down, skewed according to the particle's `orientation`,
 * with 1 unit being equal to the particle's size) and `fillStyle` is set to the particle's (lit) color.
 *
 * You are free to modify any context state, since it is restored before each draw call. Nothing will be drawn
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
	 * Draws the shape in shape space.
	 */
	draw: (ctx: CanvasRenderingContext2D) => void;
}

/**
 * Controls the way a particle is drawn onto the canvas.
 *
 * Every shape is drawn in the same space: centered at (0, 0), fitting inside a 1x1 box from -0.5 to 0.5,
 * with +y pointing down, as it would on a regular canvas. That box is then scaled to the particle's `size`,
 * rotated by its `orientation`, and filled with its (lit) color.
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
	| CustomShape;
