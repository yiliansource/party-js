<script setup lang="ts">
const props = defineProps<{
	title?: string;
}>();
</script>

<template>
	<div class="p-5 bg-surface rounded-2xl">
		<p
			v-if="title"
			class="mb-2 text-subtle text-xs font-mono tracking-wider font-semibold uppercase"
		>
			{{ title }}
		</p>
		<slot></slot>
	</div>
</template>
