import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { confetti } from "@/effects/confetti";
import { type CreateEffectOptions, createEffect } from "@/effects/effect";
import { setDefaultReducedMotion } from "@/effects/motion";
import { PartyJSError } from "@/errors";

const globals = globalThis as Record<string, unknown>;
const STUBBED = [
	"window",
	"document",
	"HTMLElement",
	"matchMedia",
	"ResizeObserver",
	"requestAnimationFrame",
	"cancelAnimationFrame",
] as const;

let saved: Record<string, unknown>;
let prefersReducedMotion: boolean;
let canvasesCreated: number;

// Just enough of a browser for an effect to start: a canvas that's never drawn to, and an animation loop that never
// fires. Whether a canvas was created tells whether the effect played or was skipped.
beforeEach(() => {
	saved = Object.fromEntries(STUBBED.map((name) => [name, globals[name]]));
	prefersReducedMotion = false;
	canvasesCreated = 0;

	globals.window = {
		devicePixelRatio: 1,
		innerWidth: 800,
		innerHeight: 600,
		scrollX: 0,
		scrollY: 0,
		addEventListener() {},
		removeEventListener() {},
	};
	globals.document = {
		createElement: () => {
			canvasesCreated++;
			return {
				style: {},
				setAttribute() {},
				getContext: () => ({ setTransform() {} }),
				remove() {},
			};
		},
		body: { appendChild() {} },
	};
	globals.HTMLElement = class {};
	globals.matchMedia = (query: string) => ({
		matches:
			prefersReducedMotion &&
			query === "(prefers-reduced-motion: reduce)",
	});
	globals.ResizeObserver = class {
		observe() {}
		disconnect() {}
	};
	globals.requestAnimationFrame = () => 1;
	globals.cancelAnimationFrame = () => {};
});

afterEach(() => {
	for (const name of STUBBED) globals[name] = saved[name];
	setDefaultReducedMotion("skip");
});

function options(
	overrides: Partial<CreateEffectOptions> = {},
): CreateEffectOptions {
	return {
		origin: { x: 0, y: 0 },
		schedule: { bursts: [{ count: 1 }] },
		particleInit: {
			size: 10,
			color: "#ff5a5f",
			shape: { type: "circle" },
			lifetime: 1,
		},
		...overrides,
	};
}

// Lets queued microtasks run, such as a skipped effect's `onComplete`.
const flushMicrotasks = () => Promise.resolve();

describe("reduced motion", () => {
	test("effects play when the user doesn't prefer reduced motion", () => {
		createEffect(options()).stop();

		expect(canvasesCreated).toBe(1);
	});

	test("effects are skipped by default when the user prefers reduced motion", () => {
		prefersReducedMotion = true;

		createEffect(options());

		expect(canvasesCreated).toBe(0);
	});

	test("a skipped effect calls onComplete once, asynchronously", async () => {
		prefersReducedMotion = true;
		let completed = 0;

		createEffect(options({ onComplete: () => completed++ }));
		expect(completed).toBe(0);

		await flushMicrotasks();
		expect(completed).toBe(1);

		await flushMicrotasks();
		expect(completed).toBe(1);
	});

	test("stopping a skipped effect before it completes cancels onComplete", async () => {
		prefersReducedMotion = true;
		let completed = 0;

		const effect = createEffect(options({ onComplete: () => completed++ }));
		effect.stop();
		await flushMicrotasks();

		expect(completed).toBe(0);
	});

	test("pause, resume and stop on a skipped effect do nothing", async () => {
		prefersReducedMotion = true;

		const effect = createEffect(options());
		effect.pause();
		effect.resume();
		effect.stop();
		effect.stop();
		await flushMicrotasks();

		expect(canvasesCreated).toBe(0);
	});

	test("invalid options throw even when the effect would be skipped", () => {
		prefersReducedMotion = true;

		expect(() =>
			createEffect(options({ schedule: { loops: -1, rate: 1 } })),
		).toThrow(PartyJSError);
	});

	test('reducedMotion: "play" plays the effect anyway', () => {
		prefersReducedMotion = true;

		createEffect(options({ reducedMotion: "play" })).stop();

		expect(canvasesCreated).toBe(1);
	});

	test('setDefaultReducedMotion("play") plays effects without their own option', () => {
		prefersReducedMotion = true;
		setDefaultReducedMotion("play");

		createEffect(options()).stop();

		expect(canvasesCreated).toBe(1);
	});

	test("an effect's own option overrides the default", () => {
		prefersReducedMotion = true;
		setDefaultReducedMotion("play");

		createEffect(options({ reducedMotion: "skip" }));

		expect(canvasesCreated).toBe(0);
	});

	test("the default only matters when the user prefers reduced motion", () => {
		setDefaultReducedMotion("skip");

		createEffect(options()).stop();

		expect(canvasesCreated).toBe(1);
	});

	test("built-in effects pass their reducedMotion option on", () => {
		prefersReducedMotion = true;

		confetti({ x: 0, y: 0 });
		expect(canvasesCreated).toBe(0);

		confetti({ x: 0, y: 0 }, { reducedMotion: "play" }).stop();
		expect(canvasesCreated).toBe(1);
	});
});
