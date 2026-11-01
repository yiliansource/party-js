import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { createCanvas } from "@napi-rs/canvas";

import { resolveParticleInit, spawnParticle } from "@/emitter/spawn";
import { PartyJSError } from "@/errors";
import { createRng } from "@/random/rng";
import { executeDrawCommand } from "@/render/canvas";
import { buildDrawCommand, type DrawCommand } from "@/render/drawCommand";
import { fitImage, resolveImage } from "@/shapes/image";
import { validateShape } from "@/shapes/validate";

import { makeTestParticle } from "../helpers";
import { type CanvasTestContext, createTestContext } from "../render/helpers";

const identityTransform = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

/**
 * Stands in for the browser's `Image`, so tests decide when (and whether) an image finishes loading.
 */
class FakeImage {
	static created: FakeImage[] = [];

	src = "";
	complete = false;
	naturalWidth = 0;
	naturalHeight = 0;

	private settle!: { resolve: () => void; reject: (error: Error) => void };
	private readonly decoding = new Promise<void>((resolve, reject) => {
		this.settle = { resolve, reject };
	});

	constructor() {
		FakeImage.created.push(this);
	}

	decode(): Promise<void> {
		return this.decoding;
	}

	load(width = 10, height = 10): void {
		this.complete = true;
		this.naturalWidth = width;
		this.naturalHeight = height;
		this.settle.resolve();
	}

	fail(): void {
		this.complete = true;
		this.settle.reject(new Error("the image is broken"));
	}
}

const globals = globalThis as Record<string, unknown>;
const saved = { Image: globals.Image, reportError: globals.reportError };
let reportedErrors: unknown[] = [];

beforeEach(() => {
	FakeImage.created = [];
	reportedErrors = [];
	globals.Image = FakeImage;
	globals.reportError = (error: unknown) => reportedErrors.push(error);
});

afterEach(() => {
	globals.Image = saved.Image;
	globals.reportError = saved.reportError;
});

/**
 * Lets promise callbacks, like the ones after `decode()`, run.
 */
const settled = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * A real canvas to use as an image source, filled with a single color.
 */
function solidImage(width: number, height: number, color = "#ff0000") {
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
	return canvas as unknown as HTMLCanvasElement;
}

// each test uses its own URLs, since loaded images stay cached for the whole test run
describe("resolveImage with a URL", () => {
	test("loads the image, and skips it until it has loaded", async () => {
		expect(resolveImage("/loading.png")).toBeUndefined();

		expect(FakeImage.created).toHaveLength(1);
		const [image] = FakeImage.created;
		expect(image.src).toBe("/loading.png");

		image.load();
		await settled();

		expect(resolveImage("/loading.png")).toBe(
			image as unknown as HTMLImageElement,
		);
	});

	test("loads each URL only once", async () => {
		resolveImage("/once.png");
		resolveImage("/once.png");
		FakeImage.created[0].load();
		await settled();
		resolveImage("/once.png");

		expect(FakeImage.created).toHaveLength(1);
	});

	test("reports an image that fails to load once, and keeps skipping it", async () => {
		resolveImage("/broken.png");
		FakeImage.created[0].fail();
		await settled();

		expect(resolveImage("/broken.png")).toBeUndefined();
		expect(resolveImage("/broken.png")).toBeUndefined();
		await settled();

		expect(reportedErrors).toHaveLength(1);
		expect(reportedErrors[0]).toBeInstanceOf(PartyJSError);
		expect(String(reportedErrors[0])).toContain("/broken.png");
	});

	test("draws an image that loaded without a size, like an SVG without dimensions in Firefox", async () => {
		resolveImage("/no-size.svg");
		FakeImage.created[0].load(0, 0);
		await settled();

		expect(resolveImage("/no-size.svg")).toBeDefined();
	});
});

describe("resolveImage with an image source", () => {
	test("returns a source that can be drawn as it is", () => {
		const canvas = solidImage(4, 4);

		expect(resolveImage(canvas)).toBe(canvas);
	});

	test("skips an <img> that is still loading", () => {
		const image = { complete: false, naturalWidth: 0 } as HTMLImageElement;

		expect(resolveImage(image)).toBeUndefined();
	});

	test("skips an <img> that failed to load, which drawImage would throw for", () => {
		const image = { complete: true, naturalWidth: 0 } as HTMLImageElement;

		expect(resolveImage(image)).toBeUndefined();
	});
});

describe("fitImage", () => {
	test("keeps the aspect ratio, with the longer side at 1", () => {
		expect(fitImage(solidImage(200, 100))).toEqual([1, 0.5]);
		expect(fitImage(solidImage(50, 100))).toEqual([0.5, 1]);
		expect(fitImage(solidImage(30, 30))).toEqual([1, 1]);
	});

	test("reads the size an <img> or <video> was loaded with", () => {
		const image = {
			naturalWidth: 300,
			naturalHeight: 100,
			width: 1,
			height: 1,
		};
		const video = { videoWidth: 160, videoHeight: 90, width: 1, height: 1 };

		expect(fitImage(image as unknown as HTMLImageElement)).toEqual([
			1,
			1 / 3,
		]);
		expect(fitImage(video as unknown as HTMLVideoElement)).toEqual([
			1,
			90 / 160,
		]);
	});

	test("falls back to a square without a size", () => {
		const image = { naturalWidth: 0, naturalHeight: 0 };

		expect(fitImage(image as unknown as HTMLImageElement)).toEqual([1, 1]);
	});
});

describe("buildDrawCommand with an image shape", () => {
	test("draws nothing for an image that hasn't loaded yet", () => {
		const image = { complete: false, naturalWidth: 0 } as HTMLImageElement;
		const particle = makeTestParticle({ shape: { type: "image", image } });

		expect(buildDrawCommand(particle, identityTransform)).toBeNull();
	});

	test("carries the image, its fitted size and the particle's opacity", () => {
		const image = solidImage(200, 100);
		const particle = makeTestParticle({
			shape: { type: "image", image },
			color: { l: 0.5, a: 0, b: 0, alpha: 0.4 },
		});

		const cmd = buildDrawCommand(particle, identityTransform);

		expect(cmd).toEqual({
			kind: "image",
			image,
			width: 1,
			height: 0.5,
			alpha: 0.4,
			transform: identityTransform,
		});
	});
});

describe("executeDrawCommand with an image command", () => {
	const SIZE = 200;
	// a 100px box, centered on a 200px canvas
	const box = { a: 100, b: 0, c: 0, d: 100, e: 100, f: 100 };

	function imageCommand(alpha: number): DrawCommand {
		return {
			kind: "image",
			image: solidImage(20, 10),
			width: 1,
			height: 0.5,
			alpha,
			transform: box,
		};
	}

	function covers({ pixelAt }: CanvasTestContext, x: number, y: number) {
		return pixelAt(x, y)[3] > 0;
	}

	test("draws the image at its fitted size, centered", () => {
		const canvas = createTestContext(SIZE, SIZE);

		executeDrawCommand(canvas.ctx, imageCommand(1));

		// 100 by 50 pixels: 50 to 150 across, 75 to 125 down
		expect(canvas.pixelAt(100, 100)).toEqual([255, 0, 0, 255]);
		expect(covers(canvas, 52, 77)).toBe(true);
		expect(covers(canvas, 147, 122)).toBe(true);
		expect(covers(canvas, 100, 72)).toBe(false);
		expect(covers(canvas, 100, 128)).toBe(false);
		expect(covers(canvas, 47, 100)).toBe(false);
	});

	test("fades with the particle's opacity", () => {
		const canvas = createTestContext(SIZE, SIZE);

		executeDrawCommand(canvas.ctx, imageCommand(0.5));

		expect(canvas.pixelAt(100, 100)[3]).toBeCloseTo(128, -1);
	});

	test("leaves the context's opacity as it found it", () => {
		const { ctx } = createTestContext(SIZE, SIZE);
		ctx.globalAlpha = 0.8;

		executeDrawCommand(ctx, imageCommand(0.5));

		expect(ctx.globalAlpha).toBeCloseTo(0.8);
	});
});

describe("validateShape with an image shape", () => {
	test("accepts a URL or an image source", () => {
		expect(() =>
			validateShape({ type: "image", image: "/logo.png" }, "shape"),
		).not.toThrow();
		expect(() =>
			validateShape({ type: "image", image: solidImage(1, 1) }, "shape"),
		).not.toThrow();
	});

	test("rejects an empty or missing image", () => {
		expect(() =>
			validateShape({ type: "image", image: "" }, "shape"),
		).toThrow();
		expect(() =>
			validateShape(
				{ type: "image" } as unknown as {
					type: "image";
					image: string;
				},
				"shape",
			),
		).toThrow();
		expect(() =>
			validateShape(
				{ type: "image", image: null } as unknown as {
					type: "image";
					image: string;
				},
				"shape",
			),
		).toThrow();
	});
});

describe("spawning a particle with an image shape", () => {
	test("starts loading its URL right away, before the particle is first drawn", () => {
		const init = resolveParticleInit({
			size: 10,
			color: "#ff0000",
			shape: { type: "image", image: "/early.png" },
			lifetime: 1,
		});

		spawnParticle(init, { rng: createRng(1), index: 0 });

		expect(FakeImage.created.map((image) => image.src)).toEqual([
			"/early.png",
		]);
	});
});
