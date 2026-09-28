<script setup lang="ts">
import CircleEditor from "./components/editors/CircleEditor.vue";
import PolygonEditor from "./components/editors/PolygonEditor.vue";
import SquareEditor from "./components/editors/SquareEditor.vue";
import StarEditor from "./components/editors/StarEditor.vue";
import PlaygroundHeader from "./components/PlaygroundHeader.vue";
import { providePlaygroundState } from "./state.ts";

providePlaygroundState();
</script>

<template>
	<PlaygroundHeader />
	<div class="px-12 py-6">
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			<SquareEditor />
			<CircleEditor />
			<StarEditor />
			<PolygonEditor />
		</div>
	</div>
</template>
