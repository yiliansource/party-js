<script setup lang="ts">
import { MinusIcon, PlusIcon } from "@lucide/vue";
import { useId } from "vue";

const value = defineModel<number>({ required: true });
const {
	label,
	min,
	max,
	step = 1,
} = defineProps<{
	label: string;
	min: number;
	max: number;
	step?: number;
}>();

const id = useId();

const clamp = (n: number) =>
	Math.min(max, Math.max(min, min + Math.round((n - min) / step) * step));

function commit(event: Event) {
	const input = event.target as HTMLInputElement;
	const next = Number.isNaN(input.valueAsNumber)
		? value.value
		: clamp(input.valueAsNumber);
	value.value = next;
	input.value = String(next);
}

function jumpToBound(event: KeyboardEvent) {
	if (event.key === "Home") value.value = min;
	else if (event.key === "End") value.value = max;
	else return;
	event.preventDefault();
}

// iOS Safari only applies :active to an element (or its ancestor) that has a touchstart listener.
const noop = () => {};

const buttonClass =
	"grid place-content-center w-9 h-full touch-manipulation not-disabled:cursor-pointer not-disabled:hover:bg-hover not-disabled:active:bg-line-strong rounded-xl";
</script>

<template>
	<div class="flex flex-row justify-between items-center">
		<label :for="id" class="text-sm font-semibold text-fg">{{
			label
		}}</label>
		<div
			class="group h-9 flex flex-row items-center bg-field rounded-xl overflow-hidden shadow-[inset_0_0_0_1px_var(--color-field-line)]
				*:bg-transparent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-600"
		>
			<button
				type="button"
				tabindex="-1"
				:aria-label="`Decrease ${label}`"
				:disabled="value <= min"
				@click="value = clamp(value - step)"
				:class="buttonClass"
				@touchstart.passive="noop"
			>
				<MinusIcon :size="16" />
			</button>
			<input
				:id
				type="number"
				inputmode="numeric"
				:min
				:max
				:step
				:value
				@change="commit"
				@keydown="jumpToBound"
				class="appearance-none w-10 text-center text-sm font-mono font-semibold outline-none
					[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
			>
			<button
				type="button"
				tabindex="-1"
				:aria-label="`Increase ${label}`"
				:disabled="value >= max"
				@click="value = clamp(value + step)"
				:class="buttonClass"
				@touchstart.passive="noop"
			>
				<PlusIcon :size="16" />
			</button>
		</div>
	</div>
</template>
