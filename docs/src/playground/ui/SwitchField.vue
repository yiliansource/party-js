<!-- biome-ignore-all lint/a11y/useAriaPropsForRole: a native checkbox exposes its checked state itself; aria-checked would duplicate it -->
<script setup lang="ts">
import { switchClass } from "../../components/switch";

const checked = defineModel<boolean>({ required: true });
const { label, disabled = false } = defineProps<{
	label: string;
	disabled?: boolean;
}>();
</script>

<template>
	<label class="flex flex-row justify-between items-center">
		<span class="text-sm font-semibold text-fg">{{ label }}</span>
		<input
			v-model="checked"
			type="checkbox"
			role="switch"
			:class="switchClass"
			:disabled
		>
	</label>
</template>
