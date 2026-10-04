import { type InjectionKey, inject, provide, reactive } from "vue";

import type { ParticlePlaygroundConfig } from "./config";

export interface ParticlePlaygroundState {
	dark: boolean;
	playing: boolean;
	particleCount: number;
	config: ParticlePlaygroundConfig;
}

const key: InjectionKey<ParticlePlaygroundState> = Symbol(
	"particle-playground-state",
);

export function provideParticlePlaygroundState() {
	const state = reactive<ParticlePlaygroundState>({
		dark: true,
		playing: true,
		particleCount: 0,
		config: {
			schedule: {
				duration: 2,
				loops: Number.POSITIVE_INFINITY,
				rate: 10,
				bursts: [],
			},
			shape: {
				type: "disk",
				center: { x: 0, y: 0 },
				radius: 100,
			},
			speedMin: 0,
			speedMax: 0,
			size: 10,
			lifetime: 5,
			color: {
				type: "pick",
				colors: ["#ff4d6d", "#ffd23f"],
			},
			shapes: {
				square: {
					enabled: false,
					aspectRatio: 1,
					borderRadius: 0.25,
				},
				circle: {
					enabled: true,
				},
				star: {
					enabled: false,
					points: 5,
				},
				polygon: {
					enabled: false,
					sides: 5,
				},
			},
			behaviors: {
				gravity: {
					enabled: true,
					strength: 200,
				},
				drag: {
					enabled: true,
					terminalVelocity: 400,
				},
			},
		},
	});
	provide(key, state);

	return state;
}

export function useParticlePlaygroundState(): ParticlePlaygroundState {
	const state = inject(key);
	if (!state)
		throw new Error(
			"useParticlePlaygroundState() called outside provideParticlePlaygroundState()",
		);

	return state;
}
