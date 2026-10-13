<script setup lang="ts">
import { PartyPopperIcon, PauseIcon, PlayIcon } from "@lucide/vue";
import { color, confetti, type ParticleShape } from "party-js";
import * as quat from "party-js/internal/math/quat";
import { computed, useTemplateRef } from "vue";

import { confettiLighting, noLighting } from "../render/lighting";
import { previewParticle } from "../render/previewParticle";
import { useParticleCanvas } from "../render/useParticleCanvas";
import Button from "../ui/Button.vue";

const { shape, colors, size, lighting } = defineProps<{
	shape: ParticleShape;
	colors: readonly string[];
	size: number;
	lighting: boolean;
}>();
const paused = defineModel<boolean>("paused", { required: true });

const TUMBLE = { x: 35, y: 70, z: 20 };

const canvas = useTemplateRef<HTMLCanvasElement>("canvas");
const burstSource = useTemplateRef<HTMLDivElement>("burstSource");
const fill = computed(() => color(colors[0] ?? "#fff"));

const particle = previewParticle(shape, fill.value, 0);
particle.orientation = quat.fromAxisAngle({ x: 1, y: 1, z: 0 }, 0.6);

useParticleCanvas(canvas, (dt, { width, height }) => {
	if (!paused.value)
		particle.orientation = quat.integrate(particle.orientation, TUMBLE, dt);

	particle.shape = shape;
	particle.color = fill.value;
	particle.size = Math.min(width, height) * 0.45;

	return {
		particles: [particle],
		origin: { x: width / 2, y: height / 2 },
		lighting: lighting ? confettiLighting : noLighting,
	};
});

function burst() {
	if (!burstSource.value) return;
	confetti(burstSource.value, { shapes: [shape], colors: [...colors], size });
}
</script>

<template>
	<div class="relative bg-surface rounded-2xl h-90">
		<canvas
			ref="canvas"
			class="block w-full h-full"
			aria-hidden="true"
		></canvas>
		<div
			ref="burstSource"
			class="absolute size-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
		></div>

		<div
			class="absolute inset-4 flex flex-col justify-between pointer-events-none *:pointer-events-auto"
		>
			<span
				class="absolute left-0 top-1 text-xs font-mono font-medium text-subtle uppercase tracking-wider"
				>Preview</span
			>
			<div
				class="absolute top-0 right-0 flex flex-row items-center justify-between"
			>
				<button
					type="button"
					:aria-pressed="paused"
					@click="paused = !paused"
					class="size-10 grid place-items-center bg-raised rounded-xl cursor-pointer"
				>
					<PlayIcon v-if="paused" :size="18" />
					<PauseIcon v-else :size="18" />
				</button>
			</div>
			<Button
				class="absolute bottom-0 right-0"
				variant="accent"
				label="Try it in a burst"
				icon-placement="start"
				@click="burst"
			>
				<template v-slot:icon>
					<PartyPopperIcon />
				</template>
			</Button>
		</div>
	</div>
</template>
