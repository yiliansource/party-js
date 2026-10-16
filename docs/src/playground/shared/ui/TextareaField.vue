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
			spellcheck="false"
			autocapitalize="off"
			autocomplete="off"
			class="px-3 py-2 resize-y overflow-y-scroll min-h-24 font-mono text-sm bg-field rounded-xl rounded-r-sm
                shadow-[inset_0_0_0_1px_var(--color-field-line)]
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
		></textarea>
	</label>
</template>
