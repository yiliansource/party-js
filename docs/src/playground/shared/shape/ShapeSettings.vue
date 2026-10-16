<script setup lang="ts">
import PanelText from "../ui/PanelText.vue";
import type { ShapeDraft } from "./draft";
import PathSettings from "./PathSettings.vue";
import PolygonSettings from "./PolygonSettings.vue";
import SquareSettings from "./SquareSettings.vue";
import StarSettings from "./StarSettings.vue";

const { draft } = defineProps<{ draft: ShapeDraft }>();
</script>

<template>
	<SquareSettings
		v-if="draft.type === 'square'"
		v-model:aspect-ratio="draft.square.aspectRatio"
		v-model:corner-radius="draft.square.cornerRadius"
	/>
	<StarSettings
		v-else-if="draft.type === 'star'"
		v-model:points="draft.star.points"
	/>
	<PolygonSettings
		v-else-if="draft.type === 'polygon'"
		v-model:sides="draft.polygon.sides"
	/>
	<PathSettings v-else-if="draft.type === 'path'" v-model:d="draft.path.d" />
	<PanelText v-else>A circle has no settings. It's always round.</PanelText>
</template>
