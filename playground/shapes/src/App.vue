<script setup lang="ts">
import CircleEditor from "./components/editors/CircleEditor.vue";
import PolygonEditor from "./components/editors/PolygonEditor.vue";
import SquareEditor from "./components/editors/SquareEditor.vue";
import StarEditor from "./components/editors/StarEditor.vue";
import Header from "./components/Header.vue";
import { provideShapePlaygroundState } from "./state.ts";

provideShapePlaygroundState();
</script>

<template>
	<Header />
	<div class="px-12 py-6">
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			<SquareEditor />
			<CircleEditor />
			<StarEditor />
			<PolygonEditor />
		</div>
	</div>
</template>
