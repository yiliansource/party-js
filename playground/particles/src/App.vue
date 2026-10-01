<script setup lang="ts">
import Header from "./components/Header.vue";
import PreviewCanvas from "./components/PreviewCanvas.vue";
import PreviewEditor from "./components/PreviewEditor.vue";
import { provideParticlePlaygroundState } from "./state.ts";

provideParticlePlaygroundState();
</script>

<template>
	<Header />
	<main class="grow flex flex-row gap-6 px-12 py-6 min-h-0">
		<PreviewCanvas />
		<PreviewEditor />
	</main>
</template>
