import type { Behavior } from "../behavior";
import type { EmissionSchedule, ParticleInit } from "../emitter";
import { rectFromElement } from "../emitter/element";
import { Emitter } from "../emitter/emitter";
import { type Live, resolveLive } from "../emitter/live";
import type { EmissionShape } from "../emitter/shape";
import { assertBrowser } from "../errors";
import type { Vec2 } from "../math/vec2";
import type { Vec3 } from "../math/vec3";
import { createFixedTimestepLoop } from "../physics/loop";
import { createRng, type Rng } from "../random/rng";
import type { LightingFn } from "../render";
import { attachLayer, type Layer } from "../render/surface";
import { type ReducedMotion, shouldSkip } from "./motion";

/**
 * The result of a completed effect, either `"completed"` if it ended by itself or `"stopped"` if it ended early.
 * An effect that is skipped due to reduced motion will still have `"completed"` as its result.
 *
 * @summary The result of a completed effect.
 *
 * @group Effects
 */
export type EffectResult = "completed" | "stopped";

/**
 * A handle to a running effect, returned by {@link createEffect | createEffect()} and the built-in
 * effects, such as {@link confetti | confetti()}.
 *
 * An effect starts as soon as it's created, and ends by itself once its schedule is finished and the last particle
 * has expired (i.e. died). You can use this handle to pause it, or to end it early.
 *
 * @summary A handle to control a running effect.
 *
 * @example
 * ```ts
 * const effect = confetti(button);
 * effect.pause();
 * effect.resume();
 * effect.stop();
 * ```
 *
 * @group Effects
 */
export interface Effect {
	/**
	 * Settles once the effect is over: with `"completed"` when it ended by itself, or with `"stopped"` when it
	 * ended early, because {@link Effect.stop | stop()} was called or it threw while running. Never rejects.
	 */
	readonly finished: Promise<EffectResult>;
	/**
	 * Ends the effect immediately and removes its particles. The `finished` promise resolves as "stopped", and
	 * the effect can't be resumed afterwards. Calling it again has no effect.
	 *
	 * The canvas the effect was drawn on is removed (or, if you provided it, cleared) once no other effect is
	 * drawing on it.
	 */
	stop(): void;
	/**
	 * Freezes the effect: particles stop moving and stay visible where they are. Calling it while already paused
	 * has no effect.
	 */
	pause(): void;
	/**
	 * Continues a paused effect from where it was paused. The time spent paused is skipped, so particles
	 * do not jump ahead. Does nothing if the effect isn't paused or has already ended.
	 */
	resume(): void;
}

/**
 * What a built-in effect bursts out of: an element on the page, or a point.
 *
 * For an element, particles are emitted from the whole area. For a point, they spawn exactly there, in page
 * coordinates, i.e. in pixels from the top-left corner of the document, with +y pointing down. Either way,
 * the position is read only once, when the effect starts; moving or scrolling afterwards does not move
 * the effect.
 *
 * @summary An element or point that an effect bursts out of.
 *
 * @example
 * ```ts
 * confetti(document.querySelector("#submit")!);
 * confetti({ x: event.pageX, y: event.pageY });
 * ```
 *
 * @group Effects
 */
export type EffectTarget = HTMLElement | Vec2;

/**
 * Options for {@link createEffect | createEffect()}, with everything that defines a custom effect: where it
 * happens, when particles are emitted, how they start out and how they change.
 *
 * @summary Everything that defines a custom effect.
 *
 * @group Custom effects
 */
export interface CreateEffectOptions {
	/**
	 * The point particle positions are measured from. Read again on every frame, so a function can
	 * make the whole effect follow something or, for example, react to the window size.
	 *
	 * Without a `canvas`, party.js draws onto its own fullscreen canvas, and the origin is in page coordinates, i.e.
	 * pixels from the top-left of the document, with +y pointing down. With a `canvas`, it's in that canvas'
	 * coordinate system instead, i.e. pixels from its top-left corner.
	 */
	origin: Live<Vec2>;
	/**
	 * When and how many particles are emitted.
	 */
	schedule: EmissionSchedule;
	/**
	 * How new particles start out.
	 */
	particleInit: ParticleInit;
	/**
	 * How particles change over their lifetime, run in this order on every simulation step.
	 * See {@link Behavior}.
	 */
	behaviors?: Behavior[];
	/**
	 * A canvas to draw onto. If none is provided, party.js draws onto a fullscreen canvas it shares between all
	 * effects, and removes it once no effect is using it anymore. See `origin` for how the coordinates behave
	 * when a canvas is supplied, versus when not.
	 */
	canvas?: HTMLCanvasElement;
	/**
	 * The direction that light comes from, in particle space. The vector's length does not matter.
	 * This value is read every frame. The default value points straight from the viewer.
	 *
	 * @defaultValue { x: 0, y: 0, z: 1 }
	 */
	light?: Live<Vec3>;
	/**
	 * How a particle's color changes with the angle between its face and the light. See
	 * {@link createLighting | createLighting()}. Pass `null` to disable lighting.
	 *
	 * @defaultValue createLighting()
	 */
	lighting?: LightingFn | null;
	/**
	 * A seed for the effect's random number generator. The same seed with the same options produces the same
	 * visuals each time. Without one, a random seed is generated and every run of the effect looks different.
	 */
	seed?: number;
	/**
	 * A random number generator to use instead of the built-in one. This takes precedence over `seed`.
	 */
	rng?: Rng;
	/**
	 * What the effect does when the user has asked their system for reduced motion. A skipped effect draws nothing,
	 * and the `finished` promise on the effect handle resolves as "completed" after `createEffect()` returns,
	 * unless you stop the effect immediately. See {@link ReducedMotion} for more information.
	 *
	 * Without this option, the default set with {@link setDefaultReducedMotion | setDefaultReducedMotion()} is used,
	 * which is `"skip"` unless you changed it.
	 */
	reducedMotion?: ReducedMotion;
}

export function resolveTarget(target: EffectTarget): {
	origin: Vec2;
	shape: EmissionShape;
} {
	assertBrowser();

	if (target instanceof HTMLElement) {
		const rect = target.getBoundingClientRect();
		const origin: Vec2 = {
			x: rect.x + rect.width / 2 + window.scrollX,
			y: rect.y + rect.height / 2 + window.scrollY,
		};
		return { origin, shape: rectFromElement(target, origin) };
	}

	return {
		origin: { x: target.x, y: target.y },
		shape: { type: "disk", center: { x: 0, y: 0 }, radius: 0 },
	};
}

function createFinished(): [
	Promise<EffectResult>,
	(result: EffectResult) => void,
] {
	let settle!: (result: EffectResult) => void;
	const finished = new Promise<EffectResult>((resolve) => {
		settle = resolve;
	});
	return [finished, settle];
}

function skippedEffect(): Effect {
	const [finished, settle] = createFinished();
	queueMicrotask(() => settle("completed"));

	return {
		finished,
		stop: () => settle("stopped"),
		pause() {},
		resume() {},
	};
}

/**
 * Creates and starts a custom effect, using the provided options.
 *
 * The built-in effects like {@link confetti | confetti()} are made using this function. You can use it directly
 * if your needs are not covered by them.
 *
 * @param options - Everything that defines the effect.
 * @returns A handle to pause, resume or stop the effect early.
 *
 * @summary Creates and starts a custom effect.
 *
 * @example
 * ```ts
 * createEffect({
 *     origin: { x: 200, y: 300 },
 *     schedule: { bursts: [{ count: 30 }] },
 *     particleInit: {
 *         position: emitFrom({ type: "disk", radius: 20 }),
 *         velocity: cone(90, 30, range(200, 400)),
 *         orientation: randomOrientation(),
 *         angularVelocity: randomSpin(90, 270),
 *         size: range(8, 14),
 *         color: pick(["#ff5a5f", "#ffb400", "#00a699"]),
 *         shape: { type: "circle" },
 *         lifetime: range(2, 3),
 *     },
 *     behaviors: [gravity(800), fade(0, 0.5)],
 * });
 * ```
 *
 * @group Custom effects
 */
export function createEffect(options: CreateEffectOptions): Effect {
	assertBrowser();

	const emitter = new Emitter({
		schedule: options.schedule,
		particleInit: options.particleInit,
		rng: options.rng ?? createRng(options.seed),
		behaviors: options.behaviors,
	});

	if (shouldSkip(options.reducedMotion)) return skippedEffect();

	const fixedLoop = createFixedTimestepLoop({
		fixedDt: 1 / 120,
		onStep: (dt) => emitter.tick(dt),
	});

	let paused = false;
	const [finished, settle] = createFinished();

	const layer: Layer = {
		get particles() {
			return emitter.particles;
		},
		get origin() {
			return resolveLive(options.origin);
		},
		get light() {
			return resolveLive(options.light);
		},
		lighting: options.lighting,
		get done() {
			return emitter.isDone;
		},
		get paused() {
			return paused;
		},
		advance: (elapsedSeconds) => fixedLoop.advance(elapsedSeconds),
		onComplete: () => settle("completed"),
		onError: () => settle("stopped"),
	};

	const handle = attachLayer(layer, options.canvas);

	return {
		finished,
		stop: () => {
			handle.detach();
			settle("stopped");
		},
		pause: () => {
			paused = true;
		},
		resume: () => {
			paused = false;
			handle.wake();
		},
	};
}
