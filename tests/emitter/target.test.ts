import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { emissionTarget } from "@/emitter/target";
import { PartyJSError } from "@/errors";

import { type FakeBrowser, stubBrowser } from "../browser";

let browser: FakeBrowser;

beforeEach(() => {
	browser = stubBrowser();
});

afterEach(() => {
	browser.restore();
});

/**
 * Creates a fake element whose bounding rect (in viewport coordinates) is the given one.
 */
function element(left: number, top: number, width: number, height: number) {
	const el = new HTMLElement();
	Object.assign(el, {
		getBoundingClientRect: () => ({ left, top, width, height }),
	});
	return el;
}

/**
 * Creates a fake canvas at the given viewport position, with an optional border.
 */
function canvas(left: number, top: number, border = 0) {
	return {
		getBoundingClientRect: () => ({ left, top }),
		clientLeft: border,
		clientTop: border,
	} as unknown as HTMLCanvasElement;
}

function scrollTo(x: number, y: number) {
	Object.assign(window, { scrollX: x, scrollY: y });
}

describe("emissionTarget", () => {
	describe("with an element", () => {
		test("the origin is the element's center, in page coordinates", () => {
			scrollTo(30, 400);
			const { origin } = emissionTarget(element(100, 50, 80, 40));
			expect(origin).toEqual({ x: 170, y: 470 });
		});

		test("the shape covers the element's whole area", () => {
			const { shape } = emissionTarget(element(100, 50, 80, 40));
			expect(shape).toEqual({ type: "rect", width: 80, height: 40 });
		});
	});

	describe("with a point", () => {
		test("the origin is the point", () => {
			const { origin } = emissionTarget({ x: 120, y: 340 });
			expect(origin).toEqual({ x: 120, y: 340 });
		});

		test("the shape is a single point", () => {
			const { shape } = emissionTarget({ x: 120, y: 340 });
			expect(shape).toEqual({ type: "disk", radius: 0 });
		});

		test("does not keep a reference to the given point", () => {
			const point = { x: 120, y: 340 };
			const { origin } = emissionTarget(point);
			point.x = 0;
			expect(origin.x).toBe(120);
		});
	});

	describe("with a canvas", () => {
		test("an element's origin is measured from the canvas' top-left corner", () => {
			scrollTo(30, 400);
			const { origin } = emissionTarget(
				element(100, 50, 80, 40),
				canvas(20, 10),
			);
			expect(origin).toEqual({ x: 120, y: 60 });
		});

		test("a point is converted from page coordinates", () => {
			scrollTo(0, 400);
			const { origin } = emissionTarget(
				{ x: 120, y: 500 },
				canvas(20, 10),
			);
			expect(origin).toEqual({ x: 100, y: 90 });
		});

		test("the canvas' border is not part of its drawing area", () => {
			const { origin } = emissionTarget(
				element(100, 50, 80, 40),
				canvas(20, 10, 4),
			);
			expect(origin).toEqual({ x: 116, y: 56 });
		});

		test("does not change the shape", () => {
			const { shape } = emissionTarget(
				element(100, 50, 80, 40),
				canvas(20, 10),
			);
			expect(shape).toEqual({ type: "rect", width: 80, height: 40 });
		});
	});

	test("throws a PartyJSError outside a browser", () => {
		browser.restore();
		expect(() => emissionTarget({ x: 0, y: 0 })).toThrow(PartyJSError);
	});
});
