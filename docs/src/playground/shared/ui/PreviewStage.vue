<script setup lang="ts">
import type { PreviewBackground } from "../preview";
import SegmentedControl, { type ControlOption } from "./SegmentedControl.vue";

const background = defineModel<PreviewBackground>({ default: "page" });

const backgroundOptions: ControlOption<PreviewBackground>[] = [
	{ value: "page", label: "Page" },
	{ value: "dark", label: "Dark" },
	{ value: "light", label: "Light" },
];
</script>

<template>
	<div
		:data-preview-theme="background === 'page' ? undefined : background"
		class="relative bg-surface text-fg rounded-2xl h-90"
	>
		<slot></slot>

		<div class="absolute inset-4 pointer-events-none *:pointer-events-auto">
			<span
				class="absolute left-0 top-1 text-xs font-mono font-medium text-subtle uppercase tracking-wider"
				>Preview</span
			>
			<div
				class="absolute top-0 right-0 flex flex-row gap-3 items-center justify-between"
			>
				<slot name="actions"></slot>
				<SegmentedControl
					size="sm"
					label="Background"
					v-model="background"
					:options="backgroundOptions"
				/>
			</div>
			<div class="absolute bottom-0 right-0 flex flex-row items-center">
				<slot name="footer"></slot>
			</div>
		</div>
	</div>
</template>
