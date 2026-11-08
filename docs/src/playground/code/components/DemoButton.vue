<script setup lang="ts">
import { MousePointerClickIcon } from "@lucide/vue";
</script>

<template>
	<button
		type="button"
		:class="[
			'px-6 py-2.5',
			'-translate-y-1.5 hover:-translate-y-1 active:translate-y-0',
			'shadow-[0_6px_0_var(--color-accent-700)] hover:shadow-[0_4px_0_var(--color-accent-700)] active:shadow-none',
			'flex flex-row items-center gap-2 cursor-pointer text-ink font-semibold bg-accent-500 rounded-xl',
			'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-600',
			'transition-[translate,box-shadow] duration-50 motion-reduce:transition-none',
		]"
	>
		<MousePointerClickIcon />
		<span>Click me</span>
	</button>
</template>
