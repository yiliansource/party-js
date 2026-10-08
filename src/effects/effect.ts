import type { Behavior } from "../behavior";
import type { EmissionSchedule, ParticleInit } from "../emitter";
import { rectFromElement } from "../emitter/element";
import { Emitter } from "../emitter/emitter";
import { type Live, resolveLive } from "../emitter/live";
import type { EmissionShape } from "../emitter/shape";
import type { Vec2 } from "../math/vec2";
import type { Vec3 } from "../math/vec3";
import { createFixedTimestepLoop } from "../physics/loop";
import { createRng, type Rng } from "../random/rng";
import type { LightingFn } from "../render";
import { createAnimationLoop } from "../render/loop";
import { createRenderer } from "../render/renderer";

/**
 * @group Effects
 */
export interface Effect {
	stop(): void;
	pause(): void;
	resume(): void;
}

/**
 * @group Effects
 */
export type EffectTarget = HTMLElement | Vec2;

/**
 * @group Custom effects
 */
export interface CreateEffectOptions {
	origin: Live<Vec2>;
	schedule: EmissionSchedule;
	particleInit: ParticleInit;
	behaviors?: Behavior[];
	canvas?: HTMLCanvasElement;
	light?: Live<Vec3>;
	lighting?: LightingFn;
	seed?: number;
	rng?: Rng;
	onComplete?: () => void;
}

export function resolveTarget(target: EffectTarget): {
	origin: Vec2;
	shape: EmissionShape;
} {
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

/**
 * @group Custom effects
 */
export function createEffect(options: CreateEffectOptions): Effect {
	const emitter = new Emitter({
		schedule: options.schedule,
		particleInit: options.particleInit,
		rng: options.rng ?? createRng(options.seed),
		behaviors: options.behaviors,
	});
	const renderer = createRenderer({ canvas: options.canvas });

	const fixedLoop = createFixedTimestepLoop({
		fixedDt: 1 / 120,
		onStep: (dt) => emitter.tick(dt),
	});

	const loop = createAnimationLoop(fixedLoop, () => {
		renderer.drawFrame(
			emitter.particles,
			resolveLive(options.origin),
			resolveLive(options.light),
			options.lighting,
		);
		if (emitter.isDone) stop(true);
	});

	function stop(natural = false): void {
		loop.stop();
		renderer.dispose();
		if (natural) options.onComplete?.();
	}

	loop.start();

	return {
		stop: () => stop(false),
		pause: () => loop.stop(),
		resume: () => loop.start(),
	};
}
