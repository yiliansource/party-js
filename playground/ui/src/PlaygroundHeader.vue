<script setup lang="ts">
defineProps<{
	title: string;
}>();
</script>

<template>
	<header
		class="px-12 py-6 bg-card border-b-card-muted border-b-2 flex flex-row justify-between items-center"
	>
		<div class="flex flex-col">
			<h1 class="text-xl font-bold">party.js</h1>
			<h2
				class="text-xs font-medium tracking-wide text-content-secondary uppercase"
			>
				{{ title }} Playground
			</h2>
		</div>

		<slot></slot>
	</header>
</template>
