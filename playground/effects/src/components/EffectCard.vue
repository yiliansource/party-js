<script setup lang="ts">
import Card from "@ui/Card.vue";

defineProps<{
	title: string;
	trigger: (e: HTMLButtonElement) => void;
}>();
</script>

<template>
	<Card class="border-t-primary border-t-3">
		<p class="text-lg font-semibold">{{ title }}</p>
		<div class="mb-3 text-content-secondary text-sm">
			<slot></slot>
		</div>
		<button
			type="button"
			@click="(e) => trigger(e.target as HTMLButtonElement)"
			:class="[
				'bg-primary text-white px-6 py-2 rounded-full font-semibold cursor-pointer',
				'transition-all active:scale-90',
			]"
		>
			Trigger
		</button>
	</Card>
</template>
