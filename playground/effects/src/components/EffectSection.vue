<script setup lang="ts">
defineProps<{
	id: string;
	title: string;
	signature: string;
}>();
</script>

<template>
	<section class="flex flex-col" :id="id">
		<div class="flex flex-row py-6 gap-3">
			<div v-if="$slots.icon" class="py-2 ml-2 text-primary">
				<slot name="icon"></slot>
			</div>
			<div class="flex flex-col">
				<h2 class="text-xl font-bold">{{ title }}</h2>
				<p class="text-sm font-mono text-content-secondary">
					{{ signature }}
				</p>
			</div>
		</div>
		<div class="flex flex-row gap-4 *:flex-1">
			<slot></slot>
		</div>
	</section>
</template>
