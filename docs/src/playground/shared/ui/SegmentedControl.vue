<script setup lang="ts" generic="T extends string">
export type ControlSize = "sm" | "md";
export interface ControlOption<V extends string = string> {
	value: V;
	label: string;
}

const model = defineModel<T>({ required: true });
const {
	label,
	options,
	size = "md",
} = defineProps<{
	label?: string;
	options: readonly ControlOption<T>[];
	size?: ControlSize;
}>();
</script>

<template>
	<fieldset
		:class="[
			'flex flex-row border-field-line bg-field mr-auto',
			size === 'md' && 'p-1 gap-1 border-2 rounded-xl',
			size === 'sm' && 'p-0.5 gap-px border rounded-xl'
		]"
	>
		<legend class="sr-only">{{ label }}</legend>
		<button
			v-for="option in options"
			:key="option.value"
			type="button"
			:aria-pressed="model === option.value"
			@click="model = option.value"
			:class="[
				'rounded-lg font-semibold cursor-pointer',
				'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600',
				'text-muted bg-transparent hover:text-fg aria-pressed:text-fg aria-pressed:bg-raised aria-pressed:shadow-sm',
				size === 'md' && 'px-4 py-2 text-sm',
				size === 'sm' && 'px-3 py-1.5 text-xs'
			]"
		>
			{{ option.label }}
		</button>
	</fieldset>
</template>
