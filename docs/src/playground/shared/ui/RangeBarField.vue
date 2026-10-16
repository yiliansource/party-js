<script setup lang="ts">
import { clamp01 } from "party-js/internal/math/scalar";
import { computed, ref, useId } from "vue";

import { withUnit } from "../format";
import { snapToStep } from "../number";

const lo = defineModel<number>("lo", { required: true });
const hi = defineModel<number>("hi", { required: true });
const {
	label,
	min,
	max,
	step = 0.01,
	format = String,
	unit,
} = defineProps<{
	label?: string;
	min: number;
	max: number;
	step?: number;
	format?: (v: number) => string;
	unit?: string;
}>();

type Edge = "min" | "max";

const id = useId();
const fractionLo = computed(() => (lo.value - min) / (max - min));
const fractionHi = computed(() => (hi.value - min) / (max - min));

const readout = computed(() =>
	withUnit(`${format(lo.value)} - ${format(hi.value)}`, unit),
);
const minText = computed(() => withUnit(format(lo.value), unit));
const maxText = computed(() => withUnit(format(hi.value), unit));

function rawValueAt(bar: HTMLElement, clientX: number) {
	const rect = bar.getBoundingClientRect();
	const f = +clamp01((clientX - rect.left) / rect.width);
	return min + f * (max - min);
}
function valueAt(bar: HTMLElement, clientX: number) {
	return snapToStep(rawValueAt(bar, clientX), { min, max, step });
}
function edgeAt(bar: HTMLElement, clientX: number): Edge {
	return rawValueAt(bar, clientX) < (lo.value + hi.value) / 2 ? "min" : "max";
}
function updateEdge(value: number, edge: Edge) {
	const bounds = { min, max, step };
	if (edge === "min")
		lo.value = Math.min(value, snapToStep(hi.value - step, bounds));
	else hi.value = Math.max(value, snapToStep(lo.value + step, bounds));
}

let dragStart: number | null = null;

const dragEdge = ref<Edge | null>(null);
const nearEdge = ref<Edge | null>(null);

function onPointerDown(event: PointerEvent) {
	if (event.button !== 0) return;
	const bar = event.currentTarget as HTMLElement;
	bar.setPointerCapture(event.pointerId);

	dragEdge.value = edgeAt(bar, event.clientX);
	dragStart = dragEdge.value === "max" ? hi.value : lo.value;

	updateEdge(valueAt(bar, event.clientX), dragEdge.value);
	event.preventDefault();
}

function onPointerMove(event: PointerEvent) {
	const bar = event.currentTarget as HTMLElement;
	if (dragEdge.value) {
		updateEdge(valueAt(bar, event.clientX), dragEdge.value);
	} else {
		if (event.pointerType === "mouse")
			nearEdge.value = edgeAt(bar, event.clientX);
	}
}

function onPointerLeave() {
	if (!dragEdge.value) nearEdge.value = null;
}

function onPointerUp() {
	dragStart = null;
	dragEdge.value = null;
}

// the browser took over the touch (e.g. the user started scrolling the page), so restore the old value.
function onPointerCancel() {
	if (dragStart !== null && dragEdge.value !== null)
		updateEdge(dragStart, dragEdge.value);

	dragStart = null;
	dragEdge.value = null;
}

console.log();
</script>

<template>
	<div
		class="group relative h-9.5 flex flex-row items-center bg-field rounded-xl overflow-hidden cursor-col-resize touch-pan-y select-none
			shadow-[inset_0_0_0_1px_var(--color-field-line)]
			has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-600"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@pointerleave="onPointerLeave"
		@pointercancel="onPointerCancel"
		:data-near-edge="nearEdge ?? undefined"
	>
		<div
			class="relative h-full bg-bar-fill"
			:style="{ 
				left: `${fractionLo * 100}%`,
				width: `${(fractionHi - fractionLo) * 100}%`
			}"
			aria-hidden="true"
		>
			<span
				class="absolute block -left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-bar-edge
					w-1 h-5 group-data-[near-edge=min]:h-7 not-motion-reduce:transition-[height]"
			></span>
			<span
				class="absolute block -right-0.5 top-1/2 -translate-y-1/2 rounded-full bg-bar-edge
					w-1 h-5 group-data-[near-edge=max]:h-7 not-motion-reduce:transition-[height]"
			></span>
		</div>
		<label
			v-if="label"
			class="absolute left-3 text-sm font-semibold text-fg pointer-events-none"
			:for="id"
			>{{
				label
			}}</label
		>
		<span
			class="absolute right-3 text-xs font-mono font-semibold tracking-wider text-muted"
			aria-hidden="true"
			>{{
				readout
			}}</span
		>
		<!-- only for keyboard and screen readers, pointer input is handled by the bar itself -->
		<input
			type="range"
			class="absolute inset-y-0 left-0 w-1/2 opacity-0 pointer-events-none"
			v-model.number="lo"
			:min
			:max="hi - step"
			:step
			:aria-label="`${label}, minimum`"
			:aria-valuetext="minText"
			@focus="nearEdge = 'min'"
			@blur="nearEdge = null"
		>
		<input
			type="range"
			class="absolute inset-y-0 right-0 w-1/2 opacity-0 pointer-events-none"
			v-model.number="hi"
			:min="lo + step"
			:max
			:step
			:aria-label="`${label}, maximum`"
			:aria-valuetext="maxText"
			@focus="nearEdge = 'max'"
			@blur="nearEdge = null"
		>
	</div>
</template>
