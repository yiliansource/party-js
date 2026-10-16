<script setup lang="ts">
import { PartyPopperIcon, PauseIcon, PlayIcon } from "@lucide/vue";
import { color, confetti, type ParticleShape } from "party-js";
import * as quat from "party-js/internal/math/quat";
import { computed, useTemplateRef } from "vue";

import type { PreviewBackground } from "../../shared/preview";
import { confettiLighting, noLighting } from "../../shared/render/lighting";
import { previewParticle } from "../../shared/render/previewParticle";
import { useParticleCanvas } from "../../shared/render/useParticleCanvas";
import Button from "../../shared/ui/Button.vue";
import PreviewStage from "../../shared/ui/PreviewStage.vue";

const { shape, colors, size, lighting } = defineProps<{
	shape: ParticleShape;
	colors: readonly string[];
	size: number;
	lighting: boolean;
}>();
const background = defineModel<PreviewBackground>("background", {
	required: true,
});
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
	confetti(burstSource.value, {
		shapes: [shape],
		colors: [...colors],
		size,
		reducedMotion: "play",
	});
}
</script>

<template>
	<PreviewStage v-model="background">
		<canvas
			ref="canvas"
			class="block w-full h-full"
			aria-hidden="true"
		></canvas>
		<div
			ref="burstSource"
			class="absolute size-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
		></div>

		<template #actions>
			<button
				type="button"
				aria-label="Pause animation"
				:aria-pressed="paused"
				@click="paused = !paused"
				class="size-10 grid place-items-center bg-raised rounded-xl cursor-pointer"
			>
				<PlayIcon v-if="paused" :size="18" />
				<PauseIcon v-else :size="18" />
			</button>
		</template>
		<template #footer>
			<Button
				variant="accent"
				label="Try it in a burst"
				icon-placement="start"
				@click="burst"
			>
				<template v-slot:icon>
					<PartyPopperIcon />
				</template>
			</Button>
		</template>
	</PreviewStage>
</template>
