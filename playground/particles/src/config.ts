import type { EmissionSchedule } from "@/emitter/schedule";
import type { EmissionShape } from "@/emitter/shape";

export interface PickColorConfig {
	type: "pick";
	colors: string[];
}
export interface GradientColorConfig {
	type: "gradient";
	colors: string[];
}
export interface RandomHueColorConfig {
	type: "randomHue";
	chroma: number;
	luminance: number;
}
export type ColorConfig =
	| PickColorConfig
	| GradientColorConfig
	| RandomHueColorConfig;

export interface ParticleShapeConfig {
	square: {
		enabled: boolean;
		aspectRatio: number;
		borderRadius: number;
	};
	circle: {
		enabled: boolean;
	};
	star: {
		enabled: boolean;
		points: number;
	};
	polygon: {
		enabled: boolean;
		sides: number;
	};
}

export interface ParticleBehaviorConfig {
	gravity: {
		enabled: boolean;
		strength: number;
	};
	drag: {
		enabled: boolean;
		terminalVelocity: number;
	};
}

export interface ParticlePlaygroundConfig {
	schedule: EmissionSchedule;
	shape: EmissionShape;
	speedMin: number;
	speedMax: number;
	size: number;
	lifetime: number;
	color: ColorConfig;
	shapes: ParticleShapeConfig;
	behaviors: ParticleBehaviorConfig;
}
