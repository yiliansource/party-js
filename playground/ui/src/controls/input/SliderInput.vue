<script setup lang="ts">
const model = defineModel<number>({ required: true });

const props = withDefaults(
	defineProps<{
		min: number;
		max: number;
		step?: number;
		accent?: string;
	}>(),
	{
		step: 1,
	},
);
</script>

<template>
	<input
		v-model.number="model"
		type="range"
		:min="min"
		:max="max"
		:step="step"
		class="slider-input"
	>
</template>

<style scoped>
.slider-input {
	-webkit-appearance: none;
	appearance: none;
	width: 100%;
	height: 4px;
	border-radius: 999px;
	background: var(--card-muted);
	cursor: pointer;
}

.slider-input::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 14px;
	height: 14px;
	border-radius: 999px;
	background: #fff;
	border: 2px solid var(--color-primary);
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.slider-input::-moz-range-thumb {
	width: 14px;
	height: 14px;
	border-radius: 999px;
	background: #fff;
	border: 2px solid var(--color-primary);
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}
</style>
