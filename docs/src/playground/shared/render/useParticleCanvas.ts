import type { LightingFn, Particle, Vec2, Vec3 } from "party-js";
import {
	createRenderer,
	type Renderer,
} from "party-js/internal/render/renderer";
import { onBeforeUnmount, onMounted, type ShallowRef } from "vue";

export interface CanvasSize {
	width: number;
	height: number;
}

export interface FrameScene {
	particles: readonly Particle[];
	origin: Vec2;
	light?: Vec3;
	lighting?: LightingFn;
}

export function useParticleCanvas(
	canvas: Readonly<ShallowRef<HTMLCanvasElement | null>>,
	frame: (dt: number, size: CanvasSize) => FrameScene,
): void {
	let renderer: Renderer | undefined;
	let handle = 0;
	let last: number | undefined;

	function loop(time: number) {
		const el = canvas.value;
		if (el && renderer) {
			const dt =
				last === undefined ? 0 : Math.min((time - last) / 1000, 0.1);
			const scene = frame(dt, {
				width: el.clientWidth,
				height: el.clientHeight,
			});
			renderer.drawFrame(
				scene.particles,
				scene.origin,
				scene.light,
				scene.lighting,
			);
		}
		last = time;
		handle = requestAnimationFrame(loop);
	}

	onMounted(() => {
		if (!canvas.value) return;
		renderer = createRenderer({ canvas: canvas.value });
		handle = requestAnimationFrame(loop);
	});

	onBeforeUnmount(() => {
		cancelAnimationFrame(handle);
		renderer?.dispose();
	});
}
