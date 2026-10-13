<script setup lang="ts">
import { useId } from "vue";

const { title } = defineProps<{
	title?: string;
}>();
const id = useId();
</script>

<template>
	<section
		class="p-5 bg-surface rounded-2xl"
		:aria-labelledby="title ? id : undefined"
	>
		<h2
			v-if="title"
			:id
			class="mb-2 text-subtle text-xs font-mono tracking-wider font-semibold uppercase"
		>
			{{ title }}
		</h2>
		<div class="flex flex-col gap-4">
			<slot></slot>
		</div>
	</section>
</template>
