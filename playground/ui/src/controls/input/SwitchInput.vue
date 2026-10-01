<script setup lang="ts">
const model = defineModel<boolean>({ required: true });
</script>

<template>
	<button
		type="button"
		:class="[
			'h-5 w-10 rounded-full flex items-center px-0.5 cursor-pointer', 
			model ? 'bg-primary' : 'bg-neutral-200'
		]"
		@click="() => model = !model"
	>
		<div
			:class="['size-4 bg-white rounded-full', model ? 'ml-auto' : 'ml-0']"
		></div>
	</button>
</template>
