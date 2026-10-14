<script setup lang="ts">
import { color, type ParticleShape } from "party-js";
import * as quat from "party-js/internal/math/quat";
import { computed, useTemplateRef } from "vue";

import { confettiLighting, noLighting } from "../shared/render/lighting";
import { previewParticle } from "../shared/render/previewParticle";
import { useParticleCanvas } from "../shared/render/useParticleCanvas";

const { shape, colors, size, lighting } = defineProps<{
	shape: ParticleShape;
	colors: readonly string[];
	size: number;
	lighting: boolean;
}>();

const POSES = [
	quat.identity,
	quat.fromAxisAngle({ x: 0, y: 0, z: 1 }, 0.5),
	quat.fromAxisAngle({ x: 1, y: 0.3, z: 0 }, 0.9),
	quat.fromAxisAngle({ x: 0.2, y: 1, z: 0.4 }, 1.2),
	quat.fromAxisAngle({ x: 1, y: 1, z: 0.5 }, 0.7),
	quat.fromAxisAngle({ x: 0, y: 1, z: 0.2 }, 1.4),
];

const canvas = useTemplateRef<HTMLCanvasElement>("canvas");
const fills = computed(() => colors.map((c) => color(c)));

const particles = POSES.map((orientation) => {
	const particle = previewParticle(shape, "#000", size);
	particle.orientation = orientation;
	return particle;
});

useParticleCanvas(canvas, (_dt, { width, height }) => {
	const spacing = width / particles.length;
	particles.forEach((particle, i) => {
		particle.shape = shape;
		particle.size = size;
		particle.color = fills.value[i % fills.value.length];
		particle.position.x = (i - (particles.length - 1) / 2) * spacing;
	});

	return {
		particles,
		origin: { x: width / 2, y: height / 2 },
		lighting: lighting ? confettiLighting : noLighting,
	};
});
</script>

<template>
	<div class="pt-4 relative bg-surface rounded-2xl flex min-w-80 min-h-32">
		<canvas
			ref="canvas"
			class="block w-full h-20 mx-2 my-auto"
			aria-hidden="true"
		></canvas>
		<span
			class="absolute left-4 top-4 text-xs font-mono font-medium text-subtle uppercase tracking-wider"
		>
			Actual size
		</span>
	</div>
</template>
