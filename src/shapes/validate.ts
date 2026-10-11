import { invalidOption } from "../errors";
import type { ParticleShape } from "./shape";

const isIntegerAtLeast = (n: number, min: number) =>
	Number.isInteger(n) && n >= min;

export function validateShape(shape: ParticleShape, where: string): void {
	switch (shape.type) {
		case "polygon":
			if (!isIntegerAtLeast(shape.sides, 3))
				throw invalidOption(
					`${where}.sides`,
					"an integer of at least 3",
					shape.sides,
				);
			break;

		case "star":
			if (
				shape.points !== undefined &&
				!isIntegerAtLeast(shape.points, 3)
			)
				throw invalidOption(
					`${where}.points`,
					"an integer of at least 3",
					shape.points,
				);
			break;

		case "square":
			if (
				shape.aspectRatio !== undefined &&
				!(shape.aspectRatio > 0 && Number.isFinite(shape.aspectRatio))
			)
				throw invalidOption(
					`${where}.aspectRatio`,
					"a positive, finite number",
					shape.aspectRatio,
				);

			if (
				shape.cornerRadius !== undefined &&
				(shape.cornerRadius < 0 || Number.isNaN(shape.cornerRadius))
			)
				throw invalidOption(
					`${where}.cornerRadius`,
					"at least 0",
					shape.cornerRadius,
				);
			break;
	}
}
