import type { Behavior } from "../behavior";
import type { EmissionSchedule, ParticleInit } from "../emitter";
import { Emitter } from "../emitter/emitter";
import { type Live, resolveLive } from "../emitter/live";
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
 * An effect that was told to wind down with {@link Effect.end | end()} also ends by itself, once its last particle
 * has expired, so its result is `"completed"` too. An effect that is skipped due to reduced motion will still have
 * `"completed"` as its result.
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
 * has expired (i.e. died). You can use this handle to pause it, to let it wind down early with
 * {@link Effect.end | end()}, or to stop it right away with {@link Effect.stop | stop()}.
 *
 * @summary A handle to control a running effect.
 *
 * @example
 * ```ts
 * const effect = confetti(button);
 * effect.pause();
 * effect.resume();
 * effect.stop(); // removes the particles right away
 * ```
 *
 * @group Effects
 */
export interface Effect {
	/**
	 * Settles once the effect is over: with `"completed"` when it ended by itself, including after
	 * {@link Effect.end | end()}, or with `"stopped"` when it ended early, because {@link Effect.stop | stop()} was
	 * called or it threw while running. Never rejects.
	 */
	readonly finished: Promise<EffectResult>;
	/**
	 * Ends the effect immediately and removes its particles. The `finished` promise resolves as `"stopped"`, and
	 * the effect can't be resumed afterwards. Calling it again has no effect.
	 *
	 * The canvas the effect was drawn on is removed (or, if you provided it, cleared) once no other effect is
	 * drawing on it. To let the particles finish their lifetime instead, use {@link Effect.end | end()}.
	 */
	stop(): void;
	/**
	 * Stops the effect from emitting new particles, and lets the ones that are already alive finish their
	 * lifetime. The effect then ends by itself, and the `finished` promise resolves as `"completed"`. Useful to
	 * turn off an effect that runs forever, like a stream with `loops: Infinity`.
	 *
	 * On a paused effect, the remaining particles stay frozen until it's resumed. Calling
	 * {@link Effect.stop | stop()} afterwards still removes them right away. Calling it again, or after the effect
	 * has ended, has no effect.
	 */
	end(): void;
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
 * Options for {@link createEffect | createEffect()}, with everything that defines a custom effect: where it
 * happens, when particles are emitted, how they start out and how they change.
 *
 * @summary Everything that defines a custom effect.
 *
 * @group Custom effects
 */
export interface CreateEffectOptions extends BaseEffectOptions {
	/**
	 * The point particle positions are measured from. Read again on every frame, so a function can
	 * make the whole effect follow something or, for example, react to the window size.
	 *
	 * Without a `canvas`, party.js draws onto its own fullscreen canvas, and the origin is in page coordinates, i.e.
	 * pixels from the top-left of the document, with +y pointing down. With a `canvas`, it's in that canvas'
	 * coordinate system instead, i.e. pixels from its top-left corner.
	 *
	 * To start the effect at an element, use {@link measureTarget | measureTarget()}, which also handles
	 * the conversion to a canvas’ coordinates.
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
	 * A random number generator to use instead of the built-in one. This takes precedence over `seed`.
	 */
	rng?: Rng;
}

/**
 * Shared options for built-in and custom effects.
 *
 * @summary Shared options for effects.
 *
 * @group Effects
 */
export interface BaseEffectOptions {
	/**
	 * What the effect does when the user has asked their system for reduced motion. A skipped effect draws nothing,
	 * and the `finished` promise on the effect handle resolves as "completed" after `createEffect()` returns,
	 * unless you stop the effect immediately. See {@link ReducedMotion} for more information.
	 *
	 * Without this option, the default set with {@link setDefaultReducedMotion | setDefaultReducedMotion()} is used,
	 * which is `"skip"` unless you changed it.
	 */
	reducedMotion?: ReducedMotion;
	/**
	 * A canvas to draw onto. If none is provided, party.js draws onto a fullscreen canvas it shares between all
	 * effects, and removes it once no effect is using it anymore. If provided, positions are measured from the
	 * canvas' top-left corner: the built-in effects measure their target relative to it, and a custom effect's
	 * origin is given in its coordinates (see {@link measureTarget | measureTarget()}).
	 */
	canvas?: HTMLCanvasElement;
	/**
	 * A seed for the effect's random number generator. The same seed with the same options produces the same
	 * visuals each time. Without one, a random seed is generated and every run of the effect looks different.
	 */
	seed?: number;
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
		end() {},
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
		end: () => {
			emitter.end();
			handle.wake();
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
