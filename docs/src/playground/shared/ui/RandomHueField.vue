<script setup lang="ts">
import { computed } from "vue";

import BarField from "./BarField.vue";

const l = defineModel<number>("l", { required: true });
const c = defineModel<number>("c", { required: true });

const GRADIENT_HUE_STEP_SIZE = 30;
const GRADIENT_HUE_STEPS = 360 / GRADIENT_HUE_STEP_SIZE + 1;
const gradientString = computed(() => {
	const hues = [...Array(GRADIENT_HUE_STEPS).keys()].map(
		(i) => (i * GRADIENT_HUE_STEP_SIZE) % 360,
	);
	return `linear-gradient(90deg, ${hues.map((h) => `oklch(${l.value} ${c.value} ${h})`).join(", ")})`;
});
</script>

<template>
	<div class="flex flex-col gap-2">
		<div
			class="h-4 w-full rounded-full"
			:style="{ background: gradientString }"
		></div>
		<BarField
			v-model="l"
			label="Lightness"
			:min="0.2"
			:max="0.95"
			:step="0.01"
		/>
		<BarField v-model="c" label="Chroma" :min="0" :max="0.3" :step="0.01" />
	</div>
</template>
