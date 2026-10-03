import { Emitter, type EmitterOptions } from "../emitter/emitter";
import type { Vec3 } from "../math/vec3";
import { createFixedTimestepLoop } from "../physics/loop";
import {
	createAnimationLoop,
	createRenderer,
	type LightingFn,
	type ProjectionOrigin,
} from "../render";

export interface Effect {
	stop(): void;
}

export interface CreateEffectOptions {
	emitterOptions: EmitterOptions;
	origin: ProjectionOrigin;
	canvas?: HTMLCanvasElement;
	light?: Vec3;
	lighting?: LightingFn;
	onComplete?: () => void;
}

export function createEffect(options: CreateEffectOptions): Effect {
	const emitter = new Emitter(options.emitterOptions);
	const renderer = createRenderer({ canvas: options.canvas });

	const fixedLoop = createFixedTimestepLoop({
		fixedDt: 1 / 120,
		onStep: (dt) => emitter.tick(dt),
	});

	const loop = createAnimationLoop(fixedLoop, () => {
		const screenOrigin = {
			x: options.origin.x - window.scrollX,
			y: options.origin.y - window.scrollY,
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
	return { stop: () => stop(false) };
}
