<script setup lang="ts">
import { PlusIcon, XIcon } from "@lucide/vue";

import { MIXED_COLORS } from "../color";
import ColorInput from "./ColorInput.vue";

const value = defineModel<{ colors: string[] }>({ required: true });

function addColor() {
	value.value.colors.push(
		MIXED_COLORS[value.value.colors.length % MIXED_COLORS.length],
	);
}
function removeColor(index: number) {
	value.value.colors.splice(index, 1);
}
</script>

<template>
	<ul
		class="pl-0 list-none flex flex-row items-center flex-wrap gap-x-3 gap-y-2"
		aria-label="Palette"
	>
		<li v-for="(_, i) in value.colors" :key="i" class="relative">
			<ColorInput v-model="value.colors[i]" :label="`Color ${i + 1}`" />
			<button
				type="button"
				:aria-label="`Remove color ${i + 1}`"
				:disabled="value.colors.length === 1"
				@click="removeColor(i)"
				class="absolute right-0 -top-1 p-0.5 grid place-items-center text-subtle bg-raised rounded-full
					not-disabled:hover:text-muted cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
			>
				<XIcon :size="12" />
			</button>
		</li>
		<li>
			<button
				type="button"
				aria-label="Add color"
				@click="addColor"
				class="p-1.5 grid place-items-center text-muted bg-surface border border-raised rounded-full
					hover:bg-raised cursor-pointer"
			>
				<PlusIcon :size="16" />
			</button>
		</li>
	</ul>
</template>
