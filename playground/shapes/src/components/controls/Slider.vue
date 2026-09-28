<script setup lang="ts">
const model = defineModel<number>({ required: true });

defineProps<{
	label: string;
	min: number;
	max: number;
	step?: number;
	format?: (value: number) => string;
	accent?: string;
}>();
</script>

<template>
	<div class="mb-3 flex flex-col gap-1.5">
		<div class="mb-1 flex items-center justify-between">
			<span
				class="text-xs font-medium tracking-wide text-content-secondary uppercase"
				>{{
					label
				}}</span
			>
			<span class="font-mono text-xs text-content-primary">{{
				format ? format(model) : model
			}}</span>
		</div>
		<input
			v-model.number="model"
			type="range"
			:min="min"
			:max="max"
			:step="step ?? 1"
			:style="{ accentColor: accent ?? '#f2795c', color: accent ?? '#f2795c' }"
			class="h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-200
				[&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none
				[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-current
				[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm
				[&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:appearance-none
				[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-current
				[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm"
		>
	</div>
</template>
