import { createCanvas, type Path2D as NapiPath2D } from "@napi-rs/canvas";

export function exceedsUnitBox(path: Path2D): boolean {
	const napiPath = path as NapiPath2D;
	const ctx = createCanvas(1, 1).getContext("2d");
	const offset = 0.505;
	const step = 0.005;

	let exceeds = false;
	for (let x = -offset; x <= offset; x += step) {
		if (ctx.isPointInPath(napiPath, x, -offset)) exceeds = true;
		if (ctx.isPointInPath(napiPath, x, offset)) exceeds = true;
	}
	for (let y = -offset; y <= offset; y += step) {
		if (ctx.isPointInPath(napiPath, -offset, y)) exceeds = true;
		if (ctx.isPointInPath(napiPath, offset, y)) exceeds = true;
	}
	return exceeds;
}
