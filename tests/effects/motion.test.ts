import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { confetti } from "@/effects/confetti";
import { type CreateEffectOptions, createEffect } from "@/effects/effect";
import { setDefaultReducedMotion } from "@/effects/motion";
import { PartyJSError } from "@/errors";

import { type FakeBrowser, stubBrowser } from "../browser";

let browser: FakeBrowser;

beforeEach(() => {
	browser = stubBrowser();
});

afterEach(() => {
	browser.restore();
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

describe("reduced motion", () => {
	test("effects play when the user doesn't prefer reduced motion", () => {
		createEffect(options()).stop();

		expect(browser.canvasesCreated).toBe(1);
	});

	test("effects are skipped by default when the user prefers reduced motion", () => {
		browser.prefersReducedMotion = true;

		createEffect(options());

		expect(browser.canvasesCreated).toBe(0);
	});

	test("pause, resume and stop on a skipped effect do nothing", async () => {
		browser.prefersReducedMotion = true;

		const effect = createEffect(options());
		effect.pause();
		effect.resume();
		effect.stop();
		effect.stop();

		expect(browser.canvasesCreated).toBe(0);
	});

	test("invalid options throw even when the effect would be skipped", () => {
		browser.prefersReducedMotion = true;

		expect(() =>
			createEffect(options({ schedule: { loops: -1, rate: 1 } })),
		).toThrow(PartyJSError);
	});

	test('reducedMotion: "play" plays the effect anyway', () => {
		browser.prefersReducedMotion = true;

		createEffect(options({ reducedMotion: "play" })).stop();

		expect(browser.canvasesCreated).toBe(1);
	});

	test('setDefaultReducedMotion("play") plays effects without their own option', () => {
		browser.prefersReducedMotion = true;
		setDefaultReducedMotion("play");

		createEffect(options()).stop();

		expect(browser.canvasesCreated).toBe(1);
	});

	test("an effect's own option overrides the default", () => {
		browser.prefersReducedMotion = true;
		setDefaultReducedMotion("play");

		createEffect(options({ reducedMotion: "skip" }));

		expect(browser.canvasesCreated).toBe(0);
	});

	test("the default only matters when the user prefers reduced motion", () => {
		setDefaultReducedMotion("skip");

		createEffect(options()).stop();

		expect(browser.canvasesCreated).toBe(1);
	});

	test("built-in effects pass their reducedMotion option on", () => {
		browser.prefersReducedMotion = true;

		confetti({ x: 0, y: 0 });
		expect(browser.canvasesCreated).toBe(0);

		confetti({ x: 0, y: 0 }, { reducedMotion: "play" }).stop();
		expect(browser.canvasesCreated).toBe(1);
	});
});
