<script setup lang="ts">
const model = defineModel<number>({ required: true });

defineProps<{
	label: string;
	min: number;
	max: number;
}>();
</script>

<template>
	<div class="flex flex-row justify-between items-center">
		<p
			class="text-xs font-medium tracking-wide text-content-secondary uppercase"
		>
			{{ label }}
		</p>
		<div
			class="flex items-stretch h-8 border border-card-muted rounded-lg divide-x divide-card-muted font-mono text-content-secondary"
		>
			<button
				class="bg-gray-100 cursor-pointer w-8 disabled:bg-gray-200"
				type="button"
				:disabled="model <= min"
				@click="model--"
			>
				-
			</button>
			<input
				type="number"
				class="flex bg-gray-50 text-content-primary text-sm text-center w-10 [&::-webkit-inner-spin-button]:appearance-none outline-none"
				v-model.number="model"
			>
			<button
				class="bg-gray-100 cursor-pointer w-8 disabled:bg-gray-200"
				type="button"
				:disabled="model >= max"
				@click="model++"
			>
				+
			</button>
		</div>
	</div>
</template>
