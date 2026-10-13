<script setup lang="ts">
const text = defineModel<string>({ required: true });
const { label } = defineProps<{
	label: string;
}>();
</script>

<template>
	<label class="flex flex-col gap-1">
		<span class="text-sm font-semibold text-fg">{{ label }}</span>
		<textarea
			v-model="text"
			type="text"
			height
			class="px-3 py-2 resize-y overflow-y-scroll min-h-24 font-mono text-sm bg-field rounded-xl rounded-r-sm overflow-hidden
                shadow-[inset_0_0_0_1px_var(--color-field-line)]
                focus:outline-2 focus:outline-offset-2 focus:outline-accent-600"
		></textarea>
	</label>
</template>
