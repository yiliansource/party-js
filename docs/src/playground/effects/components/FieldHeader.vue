<script setup lang="ts">
import { RotateCcwIcon } from "@lucide/vue";

const { label, changed, onReset } = defineProps<{
	label: string;
	changed?: boolean;
	onReset: () => void;
}>();
</script>

<template>
	<div class="min-h-7 flex flex-row flex-wrap items-center gap-x-1.5 gap-y-1">
		<div class="grow flex flex-row items-center gap-2">
			<span class="text-sm font-semibold text-fg">{{ label }}</span>
			<template v-if="changed">
				<span
					class="size-2 bg-coral rounded-full"
					aria-hidden="true"
				></span>
				<span class="sr-only">(changed)</span>
			</template>
		</div>
		<button
			type="button"
			:aria-label="`Reset ${label}`"
			:class="[
				'p-1.5 rounded-lg text-subtle bg-transparent hover:bg-raised cursor-pointer grid place-items-center',
				'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600',
				!changed && 'invisible'
			]"
			@click="onReset"
		>
			<RotateCcwIcon :size="16" aria-hidden="true" />
		</button>
		<div class="">
			<slot />
		</div>
	</div>
</template>
