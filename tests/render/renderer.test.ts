import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { createRenderer } from "@/render/renderer";

interface FakeCanvas {
	style: Record<string, string>;
	width: number;
	height: number;
	clientWidth: number;
	clientHeight: number;
	getContext(): unknown;
	remove(): void;
}

function makeFakeCanvas(): FakeCanvas {
	const ctx = { setTransform() {}, clearRect() {} };
	return {
		style: {},
		width: 0,
		height: 0,
		clientWidth: 0,
		clientHeight: 0,
		getContext: () => ctx,
		remove() {},
	};
}

const globals = globalThis as Record<string, unknown>;
let saved: Record<string, unknown>;
let resizeCallbacks: (() => void)[];
let canvas: FakeCanvas;
let win: { devicePixelRatio: number; innerWidth: number; innerHeight: number };

beforeEach(() => {
	saved = {
		window: globals.window,
		document: globals.document,
		ResizeObserver: globals.ResizeObserver,
	};
	resizeCallbacks = [];
	canvas = makeFakeCanvas();
	win = {
		devicePixelRatio: 2,
		innerWidth: 400,
		innerHeight: 800,
	};

	globals.window = win;
	globals.document = {
		createElement: () => canvas,
		body: { appendChild() {} },
	};
	globals.ResizeObserver = class {
		constructor(cb: () => void) {
			resizeCallbacks.push(cb);
		}
		observe() {}
		disconnect() {}
	};
});

afterEach(() => {
	Object.assign(globals, saved);
});

describe("createRenderer (owned canvas)", () => {
	test("sizes the bitmap in device pixels", () => {
		createRenderer();

		expect(canvas.width).toBe(800);
		expect(canvas.height).toBe(1600);
	});

	test("pins the CSS size to the logical viewport, independent of devicePixelRatio", () => {
		createRenderer();

		expect(canvas.style.width).toBe("400px");
		expect(canvas.style.height).toBe("800px");
	});

	test("updates bitmap and CSS size when the viewport or DPR changes", () => {
		createRenderer();

		win.devicePixelRatio = 3;
		win.innerWidth = 300;
		win.innerHeight = 500;
		for (const cb of resizeCallbacks) cb();

		expect(canvas.width).toBe(900);
		expect(canvas.height).toBe(1500);
		expect(canvas.style.width).toBe("300px");
		expect(canvas.style.height).toBe("500px");
	});
});
