<script setup lang="ts" generic="T extends string">
import { useId } from "vue";

export interface SwatchOption<V extends string = string> {
	value: V;
	label: string;
	swatch: string;
}

const model = defineModel<T>({ required: true });
const { label, options } = defineProps<{
	label: string;
	options: readonly SwatchOption<T>[];
}>();

const name = useId();
</script>

<template>
	<fieldset class="p-0 mb-4">
		<legend class="mb-2 text-sm font-semibold text-fg">{{ label }}</legend>
		<span class="flex flex-row gap-2">
			<label
				v-for="option in options"
				:key="option.value"
				:title="option.label"
				:style="{ 'background': option.swatch }"
				class="relative inline-block size-7 rounded-full cursor-pointer
					shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]
					has-checked:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-fg)]
					has-focus-visible:outline-2 has-focus-visible:outline-offset-[6px] has-focus-visible:outline-accent-600"
			>
				<input
					v-model="model"
					type="radio"
					:name
					:value="option.value"
					class="sr-only"
				>
				<span class="sr-only">{{ option.label }}</span>
			</label>
		</span>
	</fieldset>
</template>
