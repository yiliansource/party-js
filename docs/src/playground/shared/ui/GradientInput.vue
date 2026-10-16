<script setup lang="ts">
import { computed } from "vue";

import ColorInput from "./ColorInput.vue";

const value = defineModel<{ colors: string[] }>({ required: true });

const gradientString = computed(
	() =>
		`linear-gradient(90deg, ${value.value.colors[0]}, ${value.value.colors[1]})`,
);
</script>

<template>
	<div class="flex flex-col gap-2">
		<div
			class="h-4 w-full rounded-full"
			:style="{ background: gradientString }"
		></div>
		<div class="flex flex-row justify-between items-center">
			<span class="flex flex-row gap-2 items-center">
				<ColorInput v-model="value.colors[0]" label="Gradient start" />
				<span class="text-sm font-medium">From</span>
			</span>
			<span class="flex flex-row gap-2 items-center">
				<span class="text-sm font-medium">To</span>
				<ColorInput v-model="value.colors[1]" label="Gradient end" />
			</span>
		</div>
	</div>
</template>
