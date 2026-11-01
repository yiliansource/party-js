<script setup lang="ts">
import { ref, watch } from "vue";

import PanelText from "../ui/PanelText.vue";
import TextField from "../ui/TextField.vue";

const image = defineModel<string>("image", { required: true });

// every URL is loaded and kept by party.js, so the shape only changes once the URL is complete (on Enter or blur),
// not for every partial URL typed on the way
const url = ref(image.value);
watch(image, (value) => {
	url.value = value;
});

function commit() {
	const value = url.value.trim();
	if (value === "") url.value = image.value;
	else image.value = value;
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<TextField
			v-model="url"
			label="Image URL"
			placeholder="/favicon.svg"
			@change="commit"
		/>
		<PanelText>
			The image keeps its aspect ratio and its own colors, and only fades
			with the particle.
		</PanelText>
	</div>
</template>
