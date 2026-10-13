<script setup lang="ts">
import { CheckIcon, CopyIcon } from "@lucide/vue";
import { computed, ref } from "vue";

// biome-ignore lint/correctness/noUnusedImports: used in the for loop
import { codeColors } from "../../brand/code-theme.mjs";
import { comment, plain, type Token, toText } from "../code";

const { tokens } = defineProps<{
	tokens: Token[];
}>();

const copied = ref(false);
let timer: number | undefined;

const allTokens = computed(() => [
	comment("// use in 'shapes' in confetti()"),
	plain("\n"),
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
	<div class="w-full bg-code-bg border border-code-line rounded-2xl">
		<div
			class="h-11 flex flex-row items-center justify-between border-b border-code-line"
		>
			<span class="ml-4 text-subtle text-sm font-mono font-medium"
				>shape.js</span
			>
			<button
				type="button"
				class="mr-1 px-3 py-1.5 flex flex-row text-muted items-center gap-2 bg-transparent hover:bg-code-line rounded-xl cursor-pointer"
				@click="copyToClipboard"
			>
				<CopyIcon :size="16" v-if="!copied" />
				<CheckIcon :size="16" v-else />
				<span class="text-sm font-semibold">{{
					copied ? "Copied" : "Copy"
				}}</span>
			</button>
		</div>
		<pre
			class="py-3 px-4 text-sm font-mono leading-6 whitespace-pre-wrap"
		><span v-for="(token, index) in allTokens" :key="index" :style="{ color: codeColors[token.kind] }">{{
			token.text
		}}</span></pre>
	</div>
</template>
