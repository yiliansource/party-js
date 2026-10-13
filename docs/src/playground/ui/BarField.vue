<script setup lang="ts">
import { computed, useId } from "vue";

const value = defineModel<number>({ required: true });
const {
	label,
	min,
	max,
	step = 0.01,
	format = String,
} = defineProps<{
	label: string;
	min: number;
	max: number;
	step?: number;
	format?: (value: number) => string;
}>();

const id = useId();
const fraction = computed(() => (value.value - min) / (max - min));
</script>

<template>
	<div
		class="group relative h-9.5 flex flex-row items-center bg-field rounded-xl overflow-hidden
			shadow-[inset_0_0_0_1px_var(--color-field-line)]
			has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-600"
	>
		<div
			class="relative h-full bg-bar-fill"
			:style="{ width: `${fraction * 100}%` }"
			aria-hidden="true"
		>
			<span
				class="absolute block -right-0.5 top-1/2 -translate-y-1/2 rounded-full bg-bar-edge
					w-1 h-5 group-focus-within:h-7 group-hover:h-7 not-motion-reduce:transition-[height]"
			></span>
		</div>
		<label
			class="absolute left-3 text-sm font-semibold text-fg"
			:for="id"
			>{{
				label
			}}</label
		>
		<span
			class="absolute right-3 text-xs font-mono font-semibold tracking-wider text-muted"
			aria-hidden="true"
			>{{
				format(value)
			}}</span
		>
		<input
			:id
			class="absolute inset-0 opacity-0 cursor-col-resize appearance-none
				[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-px
				[&::-moz-range-thumb]:w-px [&::-moz-range-thumb]:border-0"
			v-model.number="value"
			type="range"
			:min
			:max
			:step
			:aria-valuetext="format(value)"
		>
	</div>
</template>
