import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import type { Particle } from "@/particle/particle";
import { createRenderer } from "@/render/renderer";

interface FakeCanvas {
	style: Record<string, string>;
	width: number;
	height: number;
	clientWidth: number;
	clientHeight: number;
	attributes: Record<string, string>;
	drawnAt: { x: number; y: number }[]; // a history of the positions where particles where drawn at
	getContext(): unknown;
	remove(): void;
	setAttribute(name: string, value: string): void;
}

function makeFakeCanvas(): FakeCanvas {
	const drawnAt: { x: number; y: number }[] = [];
	const ctx = {
		fillStyle: "",
		setTransform() {},
		clearRect() {},
		save() {},
		restore() {},
		transform(
			_a: number,
			_b: number,
			_c: number,
			_d: number,
			e: number,
			f: number,
		) {
			drawnAt.push({ x: e, y: f });
		},
	};
	return {
		style: {},
		width: 0,
		height: 0,
		clientWidth: 0,
		clientHeight: 0,
		attributes: {},
		drawnAt,
		getContext: () => ctx,
		remove() {},
		setAttribute(name, value) {
			this.attributes[name] = value;
		},
	};
}

const globals = globalThis as Record<string, unknown>;
let saved: Record<string, unknown>;
let resizeCallbacks: (() => void)[];
let canvas: FakeCanvas;
let win: {
	devicePixelRatio: number;
	innerWidth: number;
	innerHeight: number;
	scrollX: number;
	scrollY: number;
};

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
		scrollX: 0,
		scrollY: 0,
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

function particleAtOrigin(): Particle {
	return {
		position: { x: 0, y: 0, z: 0 },
		velocity: { x: 0, y: 0, z: 0 },
		orientation: { x: 0, y: 0, z: 0, w: 1 },
		angularVelocity: { x: 0, y: 0, z: 0 },
		size: 10,
		color: { l: 0.7, a: 0.1, b: 0.1, alpha: 1 },
		shape: { type: "custom", draw() {} },
		age: 0,
		lifetime: 1,
		data: new Map(),
	};
}

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

	test("draws page coordinates relative to the scrolled viewport", () => {
		win.scrollX = 30;
		win.scrollY = 200;
		const renderer = createRenderer();

		renderer.drawFrame([particleAtOrigin()], { x: 100, y: 500 });

		expect(canvas.drawnAt).toEqual([{ x: 70, y: 300 }]);
	});

	test("marks the canvas and hides it from assistive technology", () => {
		createRenderer();

		expect(canvas.attributes["aria-hidden"]).toBe("true");
		expect(canvas.attributes).toHaveProperty("data-party-js");
	});
});

describe("createRenderer (provided canvas)", () => {
	test("leaves a provided canvas's attributes alone", () => {
		const own = makeFakeCanvas();
		createRenderer({ canvas: own as unknown as HTMLCanvasElement });

		expect(own.attributes).toEqual({});
	});

	test("draws the origin relative to the canvas, ignoring page scroll", () => {
		win.scrollX = 30;
		win.scrollY = 200;
		const own = makeFakeCanvas();
		const renderer = createRenderer({
			canvas: own as unknown as HTMLCanvasElement,
		});

		renderer.drawFrame([particleAtOrigin()], { x: 100, y: 500 });

		expect(own.drawnAt).toEqual([{ x: 100, y: 500 }]);
	});
});
