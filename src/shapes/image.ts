import { PartyJSError } from "../errors";

/**
 * A picture drawn at its own aspect ratio with its longer side filling the 1x1 box.
 *
 * Either pass a URL or anything the canvas can draw, like an `<img>`, `<canvas>` or `ImageBitmap`. Particles
 * whose image hasn't loaded yet aren't drawn, and appear once it has. An image that fails to load is reported
 * once, in the console.
 *
 * An image keeps its own colors: it fades out with the particle's opacity, but isn't tinted by its color or lit.
 *
 * @summary Draws a particle as an image.
 *
 * @example
 * ```ts
 * confetti(button, { shapes: [{ type: "image", image: "/logo.png" }] });
 * ```
 *
 * @group Particles
 */
export interface ImageShape {
	type: "image";
	/**
	 * A URL to load the image from, or anything the canvas can draw.
	 *
	 * Loading only starts when the first particle spawns, so a large image may not show up in the first effect.
	 * To show it right away, preload it, for example with `<link rel="preload" as="image" href="/logo.png">`,
	 * or pass an `<img>` that has already loaded. An SVG passed as an `<img>` needs a `width` and `height`.
	 */
	image: string | CanvasImageSource;
}

/**
 * Images loaded from URLs, with whether they can be drawn yet.
 */
const images = new Map<string, { image: HTMLImageElement; ready: boolean }>();

/**
 * Returns the image to draw, or `undefined` if there's nothing to draw yet. A URL starts loading the first time
 * it's seen, which only happens in the browser, since particles are only spawned and drawn there.
 */
export function resolveImage(
	image: string | CanvasImageSource,
): CanvasImageSource | undefined {
	if (typeof image !== "string")
		// an <img> that is still loading has no size yet, and drawImage throws for one that failed to load
		return !("naturalWidth" in image) || image.naturalWidth > 0
			? image
			: undefined;

	let entry = images.get(image);
	if (!entry) {
		const loaded = { image: new Image(), ready: false };
		loaded.image.src = image;
		// decode() also decodes the image off the main thread, so its first frame doesn't stutter.
		// it settles once the image is usable, even an SVG without a size, which `naturalWidth` would miss
		loaded.image.decode().then(
			() => {
				loaded.ready = true;
			},
			() =>
				reportError(
					new PartyJSError(`couldn't load the image "${image}"`),
				),
		);
		images.set(image, loaded);
		entry = loaded;
	}
	return entry.ready ? entry.image : undefined;
}

/**
 * The size to draw an image at, keeping its aspect ratio with the longer side at 1.
 */
export function fitImage(
	image: CanvasImageSource,
): [width: number, height: number] {
	const [width, height] =
		"naturalWidth" in image
			? [image.naturalWidth, image.naturalHeight]
			: "videoWidth" in image
				? [image.videoWidth, image.videoHeight]
				: "displayWidth" in image
					? [image.displayWidth, image.displayHeight]
					: // <canvas>, ImageBitmap and OffscreenCanvas. an SVG <image> has no plain numbers here, and is drawn square
						[image.width as number, image.height as number];

	if (!(width > 0 && height > 0)) return [1, 1];
	return width > height ? [1, height / width] : [width / height, 1];
}
