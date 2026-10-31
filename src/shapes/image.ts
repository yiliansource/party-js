import { PartyJSError } from "../errors";

export interface ImageShape {
	type: "image";
	image: string | CanvasImageSource;
}

export function resolveImage(
	image: string | CanvasImageSource,
): HTMLImageElement | undefined {
	throw new PartyJSError("not implemented");
}

export function fitImage(
	image: CanvasImageSource,
): [width: number, height: number] {
	throw new PartyJSError("not implemented");
}
