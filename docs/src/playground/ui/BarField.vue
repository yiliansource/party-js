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

// the value under a pointer: anywhere on the bar, rounded to the step and kept within bounds */
function valueAt(bar: HTMLElement, clientX: number) {
	const rect = bar.getBoundingClientRect();
	const f = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
	const stepped = min + Math.round((f * (max - min)) / step) * step;
	return Math.min(max, Math.max(min, stepped));
}

// the value before the current drag, so a drag that turns into a scroll can be undone
let dragStart: number | null = null;

function onPointerDown(event: PointerEvent) {
	if (event.button !== 0) return;
	const bar = event.currentTarget as HTMLElement;
	bar.setPointerCapture(event.pointerId);
	dragStart = value.value;
	value.value = valueAt(bar, event.clientX);
	event.preventDefault();
}

function onPointerMove(event: PointerEvent) {
	if (dragStart === null) return;
	value.value = valueAt(event.currentTarget as HTMLElement, event.clientX);
}

function onPointerUp() {
	dragStart = null;
}

// the browser took over the touch (e.g. the user started scrolling the page), so restore the old value.
function onPointerCancel() {
	if (dragStart !== null) value.value = dragStart;
	dragStart = null;
}
</script>

<template>
	<div
		class="group relative h-9.5 flex flex-row items-center bg-field rounded-xl overflow-hidden cursor-col-resize touch-pan-y select-none
			shadow-[inset_0_0_0_1px_var(--color-field-line)]
			has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-600"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@pointercancel="onPointerCancel"
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
		<!-- only for keyboard and screen readers, pointer input is handled by the bar itself -->
		<input
			:id
			class="absolute inset-0 opacity-0 pointer-events-none"
			v-model.number="value"
			type="range"
			:min
			:max
			:step
			:aria-valuetext="format(value)"
		>
	</div>
</template>
