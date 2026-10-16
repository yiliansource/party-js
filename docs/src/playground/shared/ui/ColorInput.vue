<script setup lang="ts">
import { computed } from "vue";

import { toHexColor } from "../color";

const color = defineModel<string>({ required: true });
const { label } = defineProps<{ label: string }>();

const hex = computed(() => toHexColor(color.value));
</script>

<template>
	<span
		class="relative block size-8 rounded-full cursor-pointer
			shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]
			has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-600"
		:style="{ background: hex }"
	>
		<input
			type="color"
			class="absolute inset-0 size-full opacity-0 cursor-pointer"
			:value="hex"
			:aria-label="label"
			@input="color = ($event.target as HTMLInputElement).value"
		>
	</span>
</template>
