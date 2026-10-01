import type { Behavior } from "@/behavior/behavior";
import { drag } from "@/behavior/drag";
import { gravity } from "@/behavior/gravity";
import { type Color, color } from "@/color";
import { type EmitterOptions, emitFrom } from "@/emitter";
import type { Rng } from "@/random";
import { gradient, randomHue } from "@/samplers/color";
import { pick } from "@/samplers/pick";
import { randomOrientation } from "@/samplers/quat";
import type { Sampler } from "@/samplers/types";
import { randomSpin } from "@/samplers/vec3";
import type { ParticleShape } from "@/shapes/shape";

import type {
	ColorConfig,
	ParticleBehaviorConfig,
	ParticlePlaygroundConfig,
	ParticleShapeConfig,
} from "./config";

export function toEmitterOptions(
	config: ParticlePlaygroundConfig,
	rng: Rng,
): EmitterOptions {
	return {
		schedule: config.schedule,
		rng,
		particleInit: {
			position: emitFrom(config.shape),
			velocity: { x: 0, y: 100, z: 0 },
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 180),
			size: config.size,
			lifetime: config.lifetime,
			color: buildColors(config.color),
			shape: pick(buildShapes(config.shapes)),
		},
		behaviors: buildBehaviors(config.behaviors),
	};
}

function buildColors(config: ColorConfig): Sampler<Color> {
	switch (config.type) {
		case "pick":
			return pick(config.colors.map(color));
		case "gradient":
			return gradient(config.colors.map(color));
		case "randomHue":
			return randomHue({ l: config.luminance, c: config.chroma });
	}
}

function buildShapes(config: ParticleShapeConfig): ParticleShape[] {
	const shapes: ParticleShape[] = [];

	if (config.square.enabled) {
		shapes.push({
			type: "square",
			aspectRatio: config.square.aspectRatio,
			cornerRadius: config.square.borderRadius,
		});
	}
	if (config.circle.enabled) {
		shapes.push({
			type: "circle",
		});
	}
	if (config.star.enabled) {
		shapes.push({
			type: "star",
			points: config.star.points,
		});
	}
	if (config.polygon.enabled) {
		shapes.push({
			type: "polygon",
			sides: config.polygon.sides,
		});
	}

	if (shapes.length === 0) {
		// fallback to draw invisible particles if none are selected
		shapes.push({
			type: "path",
			path: new Path2D(),
		});
	}

	return shapes;
}

function buildBehaviors(config: ParticleBehaviorConfig): Behavior[] {
	const behaviors: Behavior[] = [];

	if (config.gravity.enabled) {
		behaviors.push(gravity(config.gravity.strength));
	}
	if (config.drag.enabled) {
		behaviors.push(
			drag(config.drag.terminalVelocity, config.gravity.strength),
		);
	}

	return behaviors;
}
