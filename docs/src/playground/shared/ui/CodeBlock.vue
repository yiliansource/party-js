<script setup lang="ts">
import { CheckIcon, CopyIcon } from "@lucide/vue";
import { computed, ref } from "vue";

import { codeColors } from "../../../brand/code-theme.mjs";
import { comment as commentToken, plain, type Token, toText } from "../tokens";

const { file, comment, tokens } = defineProps<{
	file?: string;
	comment?: string;
	tokens: Token[];
}>();

const copied = ref(false);
let timer: number | undefined;

const allTokens = computed(() => [
	...(comment ? [commentToken(`// ${comment}`), plain("\n")] : []),
	...tokens,
]);

async function copyToClipboard() {
	try {
		await navigator.clipboard.writeText(toText(tokens));
	} catch {
		return;
	}

	copied.value = true;

	clearTimeout(timer);
	timer = window.setTimeout(() => {
		copied.value = false;
	}, 1600);
}
</script>

<template>
	<div class="w-full min-w-0 bg-code-bg border border-code-line rounded-2xl">
		<div
			class="h-11 flex flex-row items-center border-b border-code-line"
			:style="{ color: codeColors.comment }"
		>
			<span v-if="file" class="ml-4 text-sm font-mono font-medium">{{
				file
			}}</span>
			<div class="ml-auto mr-2 flex flex-row gap-2 items-center">
				<slot name="actions"></slot>
				<button
					type="button"
					class="px-3 py-1.5 flex flex-row items-center gap-2 bg-transparent hover:bg-code-line rounded-xl text-inherit cursor-pointer"
					@click="copyToClipboard"
				>
					<CopyIcon :size="16" v-if="!copied" />
					<CheckIcon :size="16" v-else />
					<span class="text-sm font-semibold" aria-live="polite">{{
						copied ? "Copied" : "Copy"
					}}</span>
				</button>
			</div>
		</div>
		<pre
			class="py-3 px-4 text-sm font-mono leading-6 whitespace-pre overflow-x-auto tab-4"
		><span v-for="(token, index) in allTokens" :key="index" :style="{ color: codeColors[token.kind] }">{{
			token.text
		}}</span></pre>
	</div>
</template>
