<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs, watch } from "vue";

import { Emitter } from "@/emitter";
import { createFixedTimestepLoop } from "@/physics/loop";
import { createRng } from "@/random/rng";
import { type AnimationLoop, createAnimationLoop } from "@/render/loop";
import { createRenderer, type Renderer } from "@/render/renderer";

import { toEmitterOptions } from "../emitterOptions";
import { useParticlePlaygroundState } from "../state";

const canvasEl = ref<HTMLCanvasElement>();
const state = useParticlePlaygroundState();
const { dark, config, playing, particleCount } = toRefs(state);

let emitter: Emitter;
let renderer: Renderer;
let animationLoop: AnimationLoop;

function origin() {
	const canvas = canvasEl.value!;
	return {
		x: canvas.width / 2,
		y: canvas.height / 2,
	};
}

function rebuildEmitter(): void {
	emitter = new Emitter(toEmitterOptions(config.value, createRng()));
}

onMounted(() => {
	rebuildEmitter();
	renderer = createRenderer({ canvas: canvasEl.value });

	const fixedLoop = createFixedTimestepLoop({
		fixedDt: 1 / 120,
		onStep: (dt) => emitter.tick(dt),
	});
	animationLoop = createAnimationLoop(fixedLoop, () => {
		particleCount.value = emitter.particles.length;
		renderer.drawFrame(emitter.particles, origin());
	});

	if (playing.value) animationLoop.start();
});

onUnmounted(() => {
	animationLoop.stop();
	renderer.dispose();
});

watch(playing, (isPlaying) => {
	isPlaying ? animationLoop.start() : animationLoop.stop();
});

watch(config, rebuildEmitter, { deep: true });
</script>

<template>
	<div
		class="my-0 grow rounded-xl"
		:style="{ backgroundColor: dark ? '#1c1b1a' : '#efebe2'}"
	>
		<canvas ref="canvasEl" class="block w-full h-full" />
	</div>
</template>
