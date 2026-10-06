import { rectFromElement } from "../emitter/element";
import { Emitter, type EmitterOptions } from "../emitter/emitter";
import { type EmissionShape, type Live, resolve } from "../emitter/shape";
import type { Vec2 } from "../math/vec2";
import type { Vec3 } from "../math/vec3";
import { createFixedTimestepLoop } from "../physics/loop";
import {
	createAnimationLoop,
	createRenderer,
	type LightingFn,
} from "../render";

export interface Effect {
	stop(): void;
	pause(): void;
	resume(): void;
}

export type EffectTarget = HTMLElement | Vec2;

export interface CreateEffectOptions {
	emitterOptions: EmitterOptions;
	origin: Live<Vec2>;
	canvas?: HTMLCanvasElement;
	light?: Vec3;
	lighting?: LightingFn;
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

export function createEffect(options: CreateEffectOptions): Effect {
	const emitter = new Emitter(options.emitterOptions);
	const renderer = createRenderer({ canvas: options.canvas });

	const fixedLoop = createFixedTimestepLoop({
		fixedDt: 1 / 120,
		onStep: (dt) => emitter.tick(dt),
	});

	const loop = createAnimationLoop(fixedLoop, () => {
		const origin = resolve(options.origin);
		const screenOrigin = {
			x: origin.x - window.scrollX,
			y: origin.y - window.scrollY,
		};
		renderer.drawFrame(
			emitter.particles,
			screenOrigin,
			options.light,
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
