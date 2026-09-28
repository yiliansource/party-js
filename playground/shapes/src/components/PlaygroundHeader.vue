<script setup lang="ts">
import { usePlaygroundState } from "../state";

const accentColors = ["#FC6D55", "#E9BB25", "#9D51EA", "#00AF96", "#F43CA0"];

const state = usePlaygroundState();
</script>

<template>
	<div
		class="px-12 py-6 bg-card border-b-card-muted border-b-2 flex flex-row justify-between items-center"
	>
		<div class="flex flex-col">
			<h1 class="text-xl font-bold">party.js</h1>
			<h2
				class="text-xs font-medium tracking-wide text-content-secondary uppercase"
			>
				Shape Playground
			</h2>
		</div>
		<div class="flex flex-row divide-x-2 divide-card-muted">
			<div class="flex flex-col pr-6">
				<p
					class="mb-2 text-xs font-medium tracking-wide text-content-secondary uppercase"
				>
					Guides
				</p>
				<button
					type="button"
					:class="['h-6 w-12 rounded-full flex items-center px-0.5 cursor-pointer', state.guides ? 'bg-neutral-900' : 'bg-neutral-200']"
					@click="() => state.guides = !state.guides"
				>
					<div
						:class="['size-5 bg-white rounded-full', state.guides ? 'ml-auto' : 'ml-0']"
					></div>
				</button>
			</div>
			<div class="flex flex-col px-6">
				<p
					class="mb-2 text-xs font-medium tracking-wide text-content-secondary uppercase"
				>
					Canvas
				</p>
				<div
					class="flex flex-row text-xs font-semibold bg-neutral-200 rounded-2xl *:px-4 *:py-1.5 *:rounded-2xl *:cursor-pointer"
				>
					<button
						:class="[state.dark === false ? 'bg-white text-neutral-900 outline-2' : 'text-neutral-500']"
						type="button"
						@click="() => state.dark = false"
					>
						Light
					</button>
					<button
						:class="[state.dark === true ? 'bg-neutral-900 text-white outline-2' : 'text-neutral-500']"
						type="button"
						@click="() => state.dark = true"
					>
						Dark
					</button>
				</div>
			</div>
			<div class="flex flex-col pl-6">
				<p
					class="mb-2 text-xs font-medium tracking-wide text-content-secondary uppercase"
				>
					Fill
				</p>
				<div class="flex flex-row gap-2">
					<button
						:class="['size-5 rounded-full cursor-pointer', state.accent === color && 'outline-2']"
						type="button"
						v-for="color in accentColors"
						:key="color"
						:style="{ backgroundColor: color }"
						@click="() => state.accent = color"
					></button>
				</div>
			</div>
		</div>
	</div>
</template>
