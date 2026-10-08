import { PartyJSError } from "../errors";
import { createShapeCache } from "./cache";
import { buildRegularPolygonPath } from "./utils";

/**
 * @group Particles
 */
export interface PolygonShape {
	type: "polygon";
	sides: number;
}

const resolve = createShapeCache();

export function polygonPath(sides: number): Path2D {
	return resolve(`${sides}`, () => buildPolygonPath(sides));
}

export function buildPolygonPath(sides: number): Path2D {
	if (!Number.isInteger(sides) || sides < 3) {
		throw new PartyJSError(
			`polygon()'s sides has to be an integer >= 3, got ${sides}`,
		);
	}

	return buildRegularPolygonPath(sides, () => 1);
}
