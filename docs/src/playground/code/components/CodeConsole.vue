<script setup lang="ts">
import { BanIcon } from "@lucide/vue";
import { nextTick, useTemplateRef, watch } from "vue";

import Button from "../../shared/ui/Button.vue";
import Panel from "../../shared/ui/Panel.vue";
import { type ConsoleEntry, formatTime } from "../console";
import type { SourceLocation } from "../sandbox/protocol";

const { entries, fileName } = defineProps<{
	entries: ConsoleEntry[];
	fileName: string;
}>();

const emit = defineEmits<{
	clear: [];
	reveal: [location: SourceLocation];
}>();

const list = useTemplateRef<HTMLDivElement>("list");

// keep the latest entry in view, unless the reader scrolled up to look at older ones.
watch(
	() => entries.at(-1)?.id,
	async () => {
		const element = list.value;
		if (!element) return;
		const atBottom =
			element.scrollHeight - element.scrollTop - element.clientHeight <
			24;
		await nextTick();
		if (atBottom) element.scrollTop = element.scrollHeight;
	},
);

const levelClass: Record<ConsoleEntry["level"], string> = {
	system: "text-subtle",
	log: "text-fg",
	info: "text-fg",
	debug: "text-muted",
	warn: "text-(--pj-aside-caution)",
	error: "text-(--pj-aside-danger)",
};
</script>

<template>
	<Panel title="Console" class="relative">
		<div class="absolute top-2 right-2">
			<Button
				variant="ghost"
				size="sm"
				label="Clear"
				icon-placement="start"
				:disabled="entries.length === 0"
				@click="emit('clear')"
			>
				<template v-slot:icon>
					<BanIcon />
				</template>
			</Button>
		</div>
		<div
			ref="list"
			role="log"
			aria-live="polite"
			class="max-h-60 overflow-y-auto font-mono text-sm"
		>
			<p v-if="entries.length === 0" class="text-subtle text-xs">
				Logs and errors from your code show up here.
			</p>
			<div
				v-for="entry in entries"
				:key="entry.id"
				class="grid grid-cols-[80px_minmax(0,1fr)_auto] gap-x-2 py-0.5"
			>
				<time
					:datetime="entry.time.toISOString()"
					class="text-subtle tabular-nums"
				>
					{{ formatTime(entry.time) }}
				</time>
				<span
					:class="[
						'whitespace-pre-wrap wrap-break-word',
						levelClass[entry.level],
					]"
				>
					{{ entry.text }}
				</span>
				<button
					v-if="entry.location"
					type="button"
					class="self-start text-subtle hover:text-fg underline-offset-2 hover:underline cursor-pointer"
					:title="`Go to line ${entry.location.line}`"
					@click="emit('reveal', entry.location)"
				>
					{{ fileName }}:{{ entry.location.line }}
				</button>
			</div>
		</div>
	</Panel>
</template>
