<script setup lang="ts">
const text = defineModel<string>({ required: true });
const { label, placeholder } = defineProps<{
	label: string;
	placeholder?: string;
}>();
</script>

<template>
	<label class="flex flex-col gap-1">
		<span class="text-sm font-semibold text-fg">{{ label }}</span>
		<input
			type="text"
			v-model="text"
			:placeholder="placeholder"
			class="px-3 py-2 text-sm bg-field rounded-xl
                shadow-[inset_0_0_0_1px_var(--color-field-line)]
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
		>
	</label>
</template>
