import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import type { Vec2 } from "@/math/vec2";
import type { Particle } from "@/particle/particle";
import { attachLayer, type Layer, type LayerHandle } from "@/render/surface";

interface FakeCanvas {
	style: Record<string, string>;
	popover: string | null;
	width: number;
	height: number;
	clientWidth: number;
	clientHeight: number;
	attributes: Record<string, string>;
	removed: boolean;
	drawnAt: Vec2[]; // a history of the positions where particles were drawn at
	calls: { name: string; args: unknown[] }[]; // a history of setTransform and clearRect calls
	popoverCalls: string[]; // a history of showPopover and hidePopover calls
	getContext(): unknown;
	remove(): void;
	setAttribute(name: string, value: string): void;
	showPopover?(): void;
	hidePopover?(): void;
}

function makeFakeCanvas(width = 0, height = 0): FakeCanvas {
	const drawnAt: FakeCanvas["drawnAt"] = [];
	const calls: FakeCanvas["calls"] = [];
	const ctx = {
		fillStyle: "",
		setTransform(...args: number[]) {
			calls.push({ name: "setTransform", args });
		},
		clearRect(...args: number[]) {
			calls.push({ name: "clearRect", args });
		},
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
		popover: null,
		width: 0,
		height: 0,
		clientWidth: width,
		clientHeight: height,
		attributes: {},
		drawnAt,
		calls,
		popoverCalls: [],
		removed: false,
		getContext: () => ctx,
		remove() {
			this.removed = true;
		},
		setAttribute(name, value) {
			this.attributes[name] = value;
		},
		showPopover() {
			this.popoverCalls.push("show");
		},
		hidePopover() {
			this.popoverCalls.push("hide");
		},
	};
}

interface FakeLayer extends Layer {
	particles: Particle[];
	origin: Vec2;
	done: boolean;
	paused: boolean;
	advanced: number[]; // a history of the elapsed seconds passed to advance()
	completed: number; // how often onComplete was called
}

function makeLayer(origin: Vec2 = { x: 0, y: 0 }): FakeLayer {
	return {
		particles: [particleAtOrigin()],
		origin,
		done: false,
		paused: false,
		advanced: [],
		completed: 0,
		advance(dt) {
			this.advanced.push(dt);
		},
		onComplete() {
			this.completed++;
		},
	};
}

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

const globals = globalThis as Record<string, unknown>;
let saved: Record<string, unknown>;
let win: {
	devicePixelRatio: number;
	innerWidth: number;
	innerHeight: number;
	scrollX: number;
	scrollY: number;
	addEventListener(type: string, cb: () => void, options?: unknown): void;
	removeEventListener(type: string, cb: () => void): void;
};
let scrollListeners: { cb: () => void; options: unknown }[];
let created: FakeCanvas[]; // every canvas created via document.createElement
let frames: Map<number, (time: number) => void>;
let nextFrameId: number;
let resizeCallbacks: (() => void)[];
let reported: unknown[];
let handles: LayerHandle[];

beforeEach(() => {
	saved = {
		window: globals.window,
		document: globals.document,
		ResizeObserver: globals.ResizeObserver,
		requestAnimationFrame: globals.requestAnimationFrame,
		cancelAnimationFrame: globals.cancelAnimationFrame,
		reportError: globals.reportError,
	};
	scrollListeners = [];
	win = {
		devicePixelRatio: 2,
		innerWidth: 400,
		innerHeight: 800,
		scrollX: 0,
		scrollY: 0,
		addEventListener(type, cb, options) {
			if (type === "scroll") scrollListeners.push({ cb, options });
		},
		removeEventListener(type, cb) {
			if (type === "scroll")
				scrollListeners = scrollListeners.filter((l) => l.cb !== cb);
		},
	};
	created = [];
	frames = new Map();
	nextFrameId = 0;
	resizeCallbacks = [];
	reported = [];
	handles = [];

	globals.window = win;
	globals.document = {
		// a fixed overlay at 100% fills the viewport, so its client size matches it
		createElement: () => {
			const canvas = makeFakeCanvas(win.innerWidth, win.innerHeight);
			created.push(canvas);
			return canvas;
		},
		body: { appendChild() {} },
	};
	globals.ResizeObserver = class {
		constructor(cb: () => void) {
			resizeCallbacks.push(cb);
		}
		observe() {}
		disconnect() {}
	};
	globals.requestAnimationFrame = (callback: (time: number) => void) => {
		frames.set(++nextFrameId, callback);
		return nextFrameId;
	};
	globals.cancelAnimationFrame = (id: number) => {
		frames.delete(id);
	};
	globals.reportError = (error: unknown) => {
		reported.push(error);
	};
});

afterEach(() => {
	// surfaces are module state, so every test has to leave none behind
	for (const handle of handles) handle.detach();
	Object.assign(globals, saved);
});

function attach(layer: Layer, canvas?: FakeCanvas): LayerHandle {
	const handle = attachLayer(
		layer,
		canvas as unknown as HTMLCanvasElement | undefined,
	);
	handles.push(handle);
	return handle;
}

function runFrame(time: number): void {
	// runs the oldest queued frame, like the browser would on its next repaint
	const next = frames.entries().next();
	if (next.done) throw new Error("no frame is queued");
	const [id, callback] = next.value;
	frames.delete(id);
	callback(time);
}

function scroll(x: number, y: number): void {
	win.scrollX = x;
	win.scrollY = y;
	for (const { cb } of scrollListeners) cb();
}

function clearCount(canvas: FakeCanvas): number {
	return canvas.calls.filter((c) => c.name === "clearRect").length;
}

describe("overlay surface", () => {
	test("creates a single canvas for all layers attached without one", () => {
		attach(makeLayer());
		attach(makeLayer());

		expect(created).toHaveLength(1);
	});

	test("marks the overlay and hides it from assistive technology", () => {
		attach(makeLayer());

		expect(created[0].attributes["aria-hidden"]).toBe("true");
		expect(created[0].attributes).toHaveProperty("data-party-js");
	});

	test("sizes the overlay with CSS and its bitmap in device pixels", () => {
		attach(makeLayer());

		expect(created[0].style.width).toBe("100%");
		expect(created[0].style.height).toBe("100%");
		expect(created[0].width).toBe(800);
		expect(created[0].height).toBe(1600);
	});

	test("updates the bitmap size when the overlay is resized", () => {
		attach(makeLayer());
		const overlay = created[0];

		win.devicePixelRatio = 3;
		overlay.clientWidth = 300;
		overlay.clientHeight = 500;
		for (const cb of resizeCallbacks) cb();

		expect(overlay.width).toBe(900);
		expect(overlay.height).toBe(1500);
	});

	test("draws page coordinates relative to the scrolled viewport", () => {
		win.scrollX = 30;
		win.scrollY = 200;
		attach(makeLayer({ x: 100, y: 500 }));

		runFrame(0);

		expect(created[0].drawnAt).toEqual([{ x: 70, y: 300 }]);
	});

	test("shows the overlay as a manual popover", () => {
		attach(makeLayer());

		expect(created[0].popover).toBe("manual");
		expect(created[0].popoverCalls).toEqual(["show"]);
	});

	test("moves the overlay back to the top of the top layer when another layer attaches", () => {
		attach(makeLayer());
		attach(makeLayer());

		expect(created[0].popoverCalls).toEqual(["show", "hide", "show"]);
	});

	test("falls back to a z-index when popovers are not supported", () => {
		globals.document = {
			createElement: () => {
				const canvas = makeFakeCanvas(win.innerWidth, win.innerHeight);
				delete canvas.showPopover;
				delete canvas.hidePopover;
				created.push(canvas);
				return canvas;
			},
			body: { appendChild() {} },
		};

		attach(makeLayer());

		expect(created[0].popover).toBeNull();
		expect(created[0].style.zIndex).toBe("2147483647");
	});

	test("removes the overlay once the last layer detaches", () => {
		const a = attach(makeLayer());
		const b = attach(makeLayer());

		a.detach();
		expect(created[0].removed).toBe(false);

		b.detach();
		expect(created[0].removed).toBe(true);
	});

	test("creates a new overlay for a layer attached after the old one was removed", () => {
		attach(makeLayer()).detach();
		attach(makeLayer());

		expect(created).toHaveLength(2);
		expect(created[1].removed).toBe(false);
	});
});

describe("provided canvas", () => {
	test("does not create an overlay", () => {
		attach(makeLayer(), makeFakeCanvas(300, 150));

		expect(created).toHaveLength(0);
	});

	test("leaves the canvas's attributes and style alone", () => {
		const own = makeFakeCanvas(300, 150);
		attach(makeLayer(), own);

		expect(own.attributes).toEqual({});
		expect(own.style).toEqual({});
		expect(own.popoverCalls).toEqual([]);
	});

	test("sizes the bitmap from the canvas's client size in device pixels", () => {
		const own = makeFakeCanvas(300, 150);
		attach(makeLayer(), own);

		expect(own.width).toBe(600);
		expect(own.height).toBe(300);
	});

	test("draws relative to the canvas, ignoring page scroll", () => {
		win.scrollX = 30;
		win.scrollY = 200;
		const own = makeFakeCanvas(300, 150);
		attach(makeLayer({ x: 100, y: 500 }), own);

		runFrame(0);

		expect(own.drawnAt).toEqual([{ x: 100, y: 500 }]);
	});

	test("draws every layer on the same canvas within a single frame", () => {
		const own = makeFakeCanvas(300, 150);
		attach(makeLayer({ x: 10, y: 10 }), own);
		attach(makeLayer({ x: 20, y: 20 }), own);
		own.calls.length = 0; // ignore the calls made during setup

		runFrame(0);

		expect(clearCount(own)).toBe(1);
		expect(own.drawnAt).toEqual([
			{ x: 10, y: 10 },
			{ x: 20, y: 20 },
		]);
	});

	test("keeps layers on different canvases apart", () => {
		const first = makeFakeCanvas(300, 150);
		const second = makeFakeCanvas(300, 150);
		attach(makeLayer({ x: 10, y: 10 }), first);
		attach(makeLayer({ x: 20, y: 20 }), second);

		runFrame(0);
		runFrame(0);

		expect(first.drawnAt).toEqual([{ x: 10, y: 10 }]);
		expect(second.drawnAt).toEqual([{ x: 20, y: 20 }]);
	});

	test("clears the canvas and resets its transform once the last layer detaches", () => {
		const own = makeFakeCanvas(300, 150);
		const a = attach(makeLayer(), own);
		const b = attach(makeLayer(), own);
		own.calls.length = 0; // ignore the calls made during setup

		a.detach();
		expect(own.calls).toEqual([]);

		b.detach();
		expect(own.calls).toEqual([
			{ name: "setTransform", args: [1, 0, 0, 1, 0, 0] },
			{ name: "clearRect", args: [0, 0, 600, 300] },
		]);
		expect(own.removed).toBe(false);
	});
});

describe("frames", () => {
	test("clears the canvas once per frame, regardless of the number of layers", () => {
		attach(makeLayer());
		attach(makeLayer());
		attach(makeLayer());
		created[0].calls.length = 0; // ignore the calls made during setup

		runFrame(0);
		runFrame(16);

		expect(clearCount(created[0])).toBe(2);
	});

	test("draws layers in the order they were attached", () => {
		attach(makeLayer({ x: 30, y: 30 }));
		attach(makeLayer({ x: 10, y: 10 }));
		attach(makeLayer({ x: 20, y: 20 }));

		runFrame(0);

		expect(created[0].drawnAt).toEqual([
			{ x: 30, y: 30 },
			{ x: 10, y: 10 },
			{ x: 20, y: 20 },
		]);
	});

	test("skips advancing on the first frame, then advances by the elapsed seconds", () => {
		const layer = makeLayer();
		attach(layer);

		runFrame(1000);
		runFrame(1016);

		expect(layer.advanced).toEqual([0.016]);
	});

	test("advances a layer attached to a running surface from its first frame", () => {
		attach(makeLayer());
		runFrame(1000);

		const late = makeLayer();
		attach(late);
		runFrame(1016);

		expect(late.advanced).toEqual([0.016]);
	});

	test("keeps drawing a paused layer without advancing it", () => {
		const running = makeLayer({ x: 10, y: 10 });
		const paused = makeLayer({ x: 20, y: 20 });
		paused.paused = true;
		attach(running);
		attach(paused);

		runFrame(1000);
		runFrame(1016);

		expect(running.advanced).toEqual([0.016]);
		expect(paused.advanced).toEqual([]);
		expect(created[0].drawnAt).toContainEqual({ x: 20, y: 20 });
		expect(created[0].drawnAt).toHaveLength(4);
	});

	test("detaches a finished layer after drawing it and calls its onComplete", () => {
		const layer = makeLayer();
		attach(layer);
		runFrame(0);

		layer.done = true;
		runFrame(16);

		expect(layer.completed).toBe(1);
		expect(created[0].removed).toBe(true);
	});

	test("detaching a layer does not call its onComplete and leaves the others drawing", () => {
		const stopped = makeLayer({ x: 10, y: 10 });
		const other = makeLayer({ x: 20, y: 20 });
		const handle = attach(stopped);
		attach(other);
		runFrame(0);

		handle.detach();
		created[0].drawnAt.length = 0;
		runFrame(16);

		expect(stopped.completed).toBe(0);
		expect(created[0].drawnAt).toEqual([{ x: 20, y: 20 }]);
	});

	test("detaching a layer twice is harmless", () => {
		const handle = attach(makeLayer());
		attach(makeLayer());

		handle.detach();
		handle.detach();

		expect(created[0].removed).toBe(false);
	});

	test("draws a layer attached from another layer's onComplete starting with the next frame", () => {
		const first = makeLayer({ x: 10, y: 10 });
		const second = makeLayer({ x: 20, y: 20 });
		first.onComplete = () => {
			attach(second);
		};
		attach(first);
		first.done = true;

		runFrame(0);
		runFrame(16);

		expect(created.at(-1)?.drawnAt.at(-1)).toEqual({ x: 20, y: 20 });
	});

	test("stops requesting frames once no layer is left", () => {
		attach(makeLayer()).detach();

		expect(frames.size).toBe(0);
	});

	test("stops requesting frames once every layer is paused", () => {
		const layer = makeLayer();
		attach(layer);
		runFrame(0);

		layer.paused = true;
		runFrame(16);

		expect(frames.size).toBe(0);
	});

	test("wake() restarts a stopped surface without advancing on its first frame", () => {
		const layer = makeLayer();
		const handle = attach(layer);
		runFrame(0);
		layer.paused = true;
		runFrame(16);

		layer.paused = false;
		handle.wake();
		runFrame(5000);
		runFrame(5016);

		// no 4.984 from the time spent stopped
		expect(layer.advanced).toEqual([0.016]);
	});

	test("wake() on a running surface queues no extra frame", () => {
		const handle = attach(makeLayer());

		handle.wake();

		expect(frames.size).toBe(1);
	});

	test("redraws once on resize while stopped, so paused layers stay visible", () => {
		const layer = makeLayer();
		attach(layer);
		runFrame(0);
		layer.paused = true;
		runFrame(16);
		created[0].calls.length = 0;
		created[0].drawnAt.length = 0;

		for (const cb of resizeCallbacks) cb();

		expect(clearCount(created[0])).toBe(1);
		expect(created[0].drawnAt).toHaveLength(1);
		expect(frames.size).toBe(0);
	});

	test("detaches a layer that throws, reports the error and keeps drawing the others", () => {
		const error = new Error("broken behavior");
		const broken = makeLayer({ x: 10, y: 10 });
		broken.advance = () => {
			throw error;
		};
		const other = makeLayer({ x: 20, y: 20 });
		attach(broken);
		attach(other);
		runFrame(0);

		created[0].drawnAt.length = 0;
		runFrame(16);
		runFrame(32);

		expect(reported).toEqual([error]);
		expect(broken.completed).toBe(0);
		expect(other.advanced).toEqual([0.016, 0.016]);
		expect(created[0].drawnAt).toEqual([
			{ x: 20, y: 20 },
			{ x: 20, y: 20 },
		]);
	});
});

describe("scrolling", () => {
	test("listens for scrolling passively while the overlay exists", () => {
		const handle = attach(makeLayer());

		expect(scrollListeners).toHaveLength(1);
		expect(scrollListeners[0].options).toEqual({ passive: true });

		handle.detach();
		expect(scrollListeners).toHaveLength(0);
	});

	test("does not listen for scrolling on a provided canvas", () => {
		attach(makeLayer(), makeFakeCanvas(300, 150));

		expect(scrollListeners).toHaveLength(0);
	});

	test("redraws once on scroll while stopped, so paused particles stay in place on the page", () => {
		const layer = makeLayer({ x: 100, y: 500 });
		attach(layer);
		runFrame(0);
		layer.paused = true;
		runFrame(16);
		created[0].calls.length = 0;
		created[0].drawnAt.length = 0;

		scroll(0, 200);

		expect(clearCount(created[0])).toBe(1);
		expect(created[0].drawnAt).toEqual([{ x: 100, y: 300 }]);
		expect(layer.advanced).toEqual([]);
		expect(frames.size).toBe(0);
	});

	test("leaves redrawing to the next frame when scrolling while running", () => {
		attach(makeLayer());
		runFrame(0);
		created[0].calls.length = 0;
		created[0].drawnAt.length = 0;

		scroll(0, 200);

		expect(created[0].calls).toEqual([]);
		expect(created[0].drawnAt).toEqual([]);
	});
});
