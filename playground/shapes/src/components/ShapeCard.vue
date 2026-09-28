<script setup lang="ts">
import { usePlaygroundState } from "../state.ts";
import PathPreview from "./PathPreview.vue";

const props = defineProps<{
	name: string;
	type: string;
	path: Path2D;
}>();

const state = usePlaygroundState();
</script>

<template>
	<div class="p-6 mb-auto bg-card border-2 border-card-muted rounded-2xl">
		<div class="flex flex-col gap-4">
			<div class="flex flex-row justify-between items-center">
				<p class="text-xl font-bold">{{ props.name }}</p>
				<p
					class="px-3 py-1 inline-block text-xs rounded-xl bg-stone-200 text-content-secondary font-mono"
				>
					type: "{{ props.type }}"
				</p>
			</div>
			<PathPreview
				:path="path"
				:fill-style="state.accent"
				:dark="state.dark"
				:show-guides="state.guides"
			/>
			<div>
				<slot />
			</div>
		</div>
	</div>
</template>
