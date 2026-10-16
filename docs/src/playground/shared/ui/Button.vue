<script setup lang="ts">
import {
	type ButtonSize,
	type ButtonVariant,
	buttonClass,
} from "../../../components/button";

const {
	label,
	variant = "primary",
	size = "md",
	iconPlacement = "end",
	href,
} = defineProps<{
	label: string;
	variant?: ButtonVariant;
	size?: ButtonSize;
	iconPlacement?: "start" | "end";
	href?: string;
}>();
</script>

<template>
	<component
		:is="href ? 'a' : 'button'"
		:href
		:type="href ? undefined : 'button'"
		:class="buttonClass(variant, size)"
	>
		<slot v-if="iconPlacement === 'start'" name="icon" />
		<span>{{ label }}</span>
		<slot v-if="iconPlacement === 'end'" name="icon" />
	</component>
</template>
