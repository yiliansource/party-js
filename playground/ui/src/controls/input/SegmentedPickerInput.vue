<script setup lang="ts">
import { computed } from "vue";

const model = defineModel<string>();

export type Option = {
	label: string;
	value: string;
};

const props = defineProps<{
	options: string[] | Option[];
}>();

const normalizedOptions = computed(() =>
	props.options.map((o) => {
		if (typeof o !== "object") {
			return { label: o, value: o } satisfies Option;
		}
		return o;
	}),
);
</script>

<template>
	<div class="p-1 flex flex-row gap-1 bg-control-background rounded-lg">
		<button
			:class="[
			'px-3 py-1.5 grow text-sm cursor-pointer font-medium',
			opt.value === model ? 'text-content-primary bg-control-foreground rounded-md' : 'text-content-secondary'
		]"
			type="button"
			@click="() => model = opt.value"
			v-for="opt in normalizedOptions"
			:key="opt.value"
		>
			{{ opt.label }}
		</button>
	</div>
</template>
