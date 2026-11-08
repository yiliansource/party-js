<script setup lang="ts">
import { PlayIcon } from "@lucide/vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

import { site } from "../../../config/site";
import Button from "../../shared/ui/Button.vue";
import { monaco } from "../monaco/setup";
import { editorOptions, syncCodeFont } from "../monaco/theme.ts";

const container = ref<HTMLDivElement>();
let editor: monaco.editor.IStandaloneCodeEditor | undefined;
let stopFontSync: () => void;

const fileName = "effect.js";

onMounted(() => {
	const uri = monaco.Uri.parse(`file:///${fileName}`);
	const model =
		monaco.editor.getModel(uri) ??
		monaco.editor.createModel(
			`import { confetti } from "party-js";\n\n`,
			"javascript",
			uri,
		);

	editor = monaco.editor.create(container.value!, {
		...editorOptions(),
		model,
	});
	stopFontSync = syncCodeFont(editor);
});

onBeforeUnmount(() => {
	editor?.dispose();
	stopFontSync();
});
</script>

<template>
	<div class="flex flex-col bg-code-bg rounded-2xl border border-code-line">
		<div
			class="py-2 px-2 flex flex-row items-center justify-between border-b border-code-line"
		>
			<span class="px-3">
				<span class="font-mono font-semibold text-sm text-white">{{
					fileName
				}}</span>
				<span
					class="ml-2.5 inline-block bg-yellow-500 size-2 rounded-full"
				></span>
			</span>
			<span>
				<Button
					variant="accent"
					size="sm"
					label="Run"
					icon-placement="start"
				>
					<template v-slot:icon>
						<PlayIcon />
					</template>
				</Button>
			</span>
		</div>
		<div
			ref="container"
			class="monaco-component grow min-h-40 overflow-hidden"
		/>
		<div
			class="px-4 py-2 flex flex-row justify-between border-t border-code-line font-mono text-xs text-subtle"
		>
			<span>
				<span>JavaScript</span>
				<span class="mx-2">&middot;</span>
				<span>{{ site.name }} v{{ site.version }}</span>
			</span>
			<span>Ln 28, Col 29</span>
		</div>
	</div>
</template>
