<script setup lang="ts">
import { PauseIcon, PlayIcon } from "@lucide/vue";

import PlaygroundHeader from "@ui/PlaygroundHeader.vue";

import { useParticlePlaygroundState } from "../state";

const state = useParticlePlaygroundState();
</script>

<template>
	<PlaygroundHeader title="Particles">
		<div class="flex flex-row gap-2">
			<button
				type="button"
				:class="[
					'px-5 py-1 flex flex-row items-center gap-1 cursor-pointer font-semibold text-sm text-white rounded-full',
					state.playing ? 'bg-primary' : 'bg-stone-500'
				]"
				@click="state.playing = !state.playing"
			>
				<PlayIcon class="size-5" v-if="state.playing" />
				<PauseIcon class="size-5" v-else />
				<span>{{ state.playing ? "Playing" : "Stopped" }} </span>
			</button>
			<div
				class="px-4 py-2 font-mono text-xs bg-stone-300 text-stone-700 rounded-full"
			>
				particles: <span>{{ state.particleCount }}</span>
			</div>
		</div>
	</PlaygroundHeader>
</template>
