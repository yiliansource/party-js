import type { ProjectionOrigin } from "../render/projection";
import type { RectEmissionShape } from "./shape";

export function rectFromElement(
	element: HTMLElement,
	origin: ProjectionOrigin,
): RectEmissionShape {
	const rect = element.getBoundingClientRect();
	const centerX = rect.x + rect.width / 2 + window.scrollX;
	const centerY = rect.y + rect.height / 2 + window.scrollY;
	return {
		type: "rect",
		center: {
			x: centerX - origin.x,
			y: origin.y - centerY,
			z: 0,
		},
		width: rect.width,
		height: rect.height,
	};
}
