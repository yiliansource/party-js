import { PartyJSError } from "../errors";
import { createShapeCache } from "./cache";

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

	const vertices: [number, number][] = [];
	for (let i = 0; i < sides; i++) {
		const angle = -Math.PI / 2 + (2 * i * Math.PI) / sides;
		vertices.push([Math.cos(angle), Math.sin(angle)]);
	}

	const xs = vertices.map(([x]) => x);
	const ys = vertices.map(([, y]) => y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);
	const scale = 1 / Math.max(maxX - minX, maxY - minY);
	const centerX = (minX + maxX) / 2;
	const centerY = (minY + maxY) / 2;

	const path = new Path2D();
	vertices.forEach(([x, y], i) => {
		const sx = (x - centerX) * scale;
		const sy = (y - centerY) * scale;
		if (i === 0) path.moveTo(sx, sy);
		else path.lineTo(sx, sy);
	});
	path.closePath();

	return path;
}
