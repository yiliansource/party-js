import { invalidOption } from "../errors";
import { createShapeCache } from "./cache";
import { buildRegularPolygonPath } from "./utils";

/**
 * A regular polygonal shape, centered at (0, 0), with a specified number of sides.
 *
 * @summary Draws a particle as a regular polygon.
 *
 * @group Particles
 */
export interface PolygonShape {
	type: "polygon";
	/**
	 * The number of sides the regular polygon should have, which is expected to be an integer >= 3.
	 */
	sides: number;
}

const resolve = createShapeCache();

export function polygonPath(sides: number): Path2D {
	return resolve(`${sides}`, () => buildPolygonPath(sides));
}

export function buildPolygonPath(sides: number): Path2D {
	if (!Number.isInteger(sides) || sides < 3) {
		throw invalidOption(
			"polygon shape's sides",
			"an integer of at least 3",
			sides,
		);
	}

	return buildRegularPolygonPath(sides, () => 1);
}
