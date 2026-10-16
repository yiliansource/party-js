<script setup lang="ts" generic="T extends string">
export type ControlSize = "sm" | "md";
export interface ControlOption<V extends string = string> {
	value: V;
	label: string;
}

const model = defineModel<T>({ required: true });
const { options, size = "md" } = defineProps<{
	options: readonly ControlOption<T>[];
	size?: ControlSize;
}>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
	<div
		:class="[
			'flex flex-row border-raised bg-field mr-auto',
			size === 'md' && 'p-1 gap-1 border-2 rounded-xl',
			size === 'sm' && 'p-0.5 gap-px border rounded-xl'
		]"
	>
		<button
			v-for="option in options"
			:key="option.value"
			type="button"
			@click="emit('update:modelValue', option.value)"
			:class="[
				'rounded-lg font-semibold cursor-pointer',
				'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600',
				model === option.value ? 'text-fg bg-raised' : 'text-muted bg-transparent hover:text-fg hover:bg-surface',
				size === 'md' && 'px-4 py-2 text-sm',
				size === 'sm' && 'px-3 py-1.5 text-xs'
			]"
		>
			{{ option.label }}
		</button>
	</div>
</template>
