<script setup lang="ts">
import PathPreview from "../PathPreview.vue";

const model = defineModel<boolean>();

defineProps<{
	path: Path2D;
}>();
</script>

<template>
	<div
		class="flex flex-row items-start gap-4"
		:class="[model ? '' : 'opacity-25']"
	>
		<button
			type="button"
			@click="() => model = !model"
			:class="['cursor-pointer']"
		>
			<PathPreview :size="32" :path="path" :dark="false" />
		</button>
		<div class="grow" :class="[model ? '' : 'pointer-events-none']">
			<slot></slot>
		</div>
	</div>
</template>
