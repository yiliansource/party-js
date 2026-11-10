<script setup lang="ts">
import { PlayIcon } from "@lucide/vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

import { site } from "../../../config/site";
import Button from "../../shared/ui/Button.vue";
import { monaco } from "../monaco/setup";
import { editorOptions, syncCodeFont } from "../monaco/theme.ts";
import type { SourceLocation } from "../sandbox/protocol";

const { fileName, dirty } = defineProps<{
	fileName: string;
	dirty: boolean;
}>();

const code = defineModel<string>({ required: true });

const emit = defineEmits<{
	run: [];
}>();

const MARKER_OWNER = "playground";

const container = ref<HTMLDivElement>();
const cursor = ref({ line: 1, column: 1 });
let editor: monaco.editor.IStandaloneCodeEditor | undefined;
let stopFontSync: (() => void) | undefined;

const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
const runShortcut = isMac ? "⌘ Enter" : "Ctrl+Enter";

onMounted(() => {
	const uri = monaco.Uri.parse(`file:///${fileName}`);
	const model =
		monaco.editor.getModel(uri) ??
		monaco.editor.createModel(code.value, "javascript", uri);
	code.value = model.getValue();

	editor = monaco.editor.create(container.value!, {
		...editorOptions(),
		model,
	});
	stopFontSync = syncCodeFont(editor);

	model.onDidChangeContent(() => {
		code.value = model.getValue();
	});
	editor.onDidChangeCursorPosition(({ position }) => {
		cursor.value = { line: position.lineNumber, column: position.column };
	});
	editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () =>
		emit("run"),
	);
});

onBeforeUnmount(() => {
	stopFontSync?.();
	editor?.dispose();
});

/**
 * Moves the cursor to a location in the code, e.g. where an error was thrown.
 */
function reveal({ line, column }: SourceLocation) {
	if (!editor) return;
	const position = { lineNumber: line, column };
	editor.setPosition(position);
	editor.revealPositionInCenterIfOutsideViewport(position);
	editor.focus();
}

/**
 * Underlines the code at a location with an error, until the markers are cleared.
 */
function markError({ line, column }: SourceLocation, message: string) {
	const model = editor?.getModel();
	if (!model || line > model.getLineCount()) return;

	const word = model.getWordAtPosition({ lineNumber: line, column });
	const markers = monaco.editor.getModelMarkers({
		owner: MARKER_OWNER,
		resource: model.uri,
	});
	monaco.editor.setModelMarkers(model, MARKER_OWNER, [
		...markers,
		{
			severity: monaco.MarkerSeverity.Error,
			message,
			startLineNumber: line,
			startColumn: word?.startColumn ?? column,
			endLineNumber: line,
			endColumn: word?.endColumn ?? model.getLineMaxColumn(line),
		},
	]);
}

function clearMarkers() {
	const model = editor?.getModel();
	if (model) monaco.editor.setModelMarkers(model, MARKER_OWNER, []);
}

defineExpose({ reveal, markError, clearMarkers });
</script>

<template>
	<div class="flex flex-col bg-code-bg rounded-2xl border border-code-line">
		<div
			class="py-2 px-2 flex flex-row items-center justify-between border-b border-code-line"
		>
			<span class="px-3">
				<span class="font-mono font-semibold text-sm text-white">
					{{ fileName }}
				</span>
				<span
					v-if="dirty"
					class="ml-2.5 inline-block bg-yellow-500 size-2 rounded-full"
					title="Changed since the last run"
				></span>
				<span v-if="dirty" class="sr-only">
					(changed since the last run)
				</span>
			</span>
			<span>
				<Button
					variant="accent"
					size="sm"
					label="Run"
					icon-placement="start"
					:title="`Run (${runShortcut})`"
					@click="emit('run')"
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
			<span>Ln {{ cursor.line }}, Col {{ cursor.column }}</span>
		</div>
	</div>
</template>
