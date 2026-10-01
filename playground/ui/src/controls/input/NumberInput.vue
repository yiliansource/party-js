<script setup lang="ts">
const model = defineModel<number>({ required: true });
defineProps<{
	min?: number;
	max?: number;
}>();
</script>

<template>
	<input
		class="px-2 py-1 border-2 border-card-muted font-mono text-sm rounded-lg outline-none"
		type="number"
		v-model="model"
		:min="min"
		:max="max"
	>
</template>
