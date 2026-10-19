import type { LightingFn, Particle, Vec2, Vec3 } from "party-js";
import {
	attachLayer,
	type LayerHandle,
} from "party-js/internal/render/surface";
import { onBeforeUnmount, onMounted, type ShallowRef } from "vue";

export interface CanvasSize {
	width: number;
	height: number;
}

export interface FrameScene {
	particles: readonly Particle[];
	origin: Vec2;
	light?: Vec3;
	lighting?: LightingFn | null;
}

export function useParticleCanvas(
	canvas: Readonly<ShallowRef<HTMLCanvasElement | null>>,
	frame: (dt: number, size: CanvasSize) => FrameScene,
): void {
	let handle: LayerHandle | undefined;

	onMounted(() => {
		const el = canvas.value;
		if (!el) return;

		const update = (dt: number) =>
			frame(dt, { width: el.clientWidth, height: el.clientHeight });
		let scene = update(0);

		handle = attachLayer(
			{
				get particles() {
					return scene.particles;
				},
				get origin() {
					return scene.origin;
				},
				get light() {
					return scene.light;
				},
				get lighting() {
					return scene.lighting;
				},
				done: false,
				paused: false,
				advance(dt) {
					scene = update(Math.min(dt, 0.1));
				},
			},
			el,
		);
	});

	onBeforeUnmount(() => handle?.detach());
}
