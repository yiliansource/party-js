<script setup lang="ts">
import {
	markRaw,
	onBeforeUnmount,
	onMounted,
	ref,
	shallowRef,
	useTemplateRef,
} from "vue";

import CodeConsole from "./components/CodeConsole.vue";
import CodeEditor from "./components/CodeEditor.vue";
import CodePreviewStage from "./components/CodePreviewStage.vue";
import { type ConsoleEntry, MAX_ENTRIES } from "./console";
import type { SandboxMessage } from "./sandbox/protocol";
import { CodeSandbox } from "./sandbox/sandbox";

const fileName = "effect.js";
const initialCode = `import { confetti } from "party-js";

export function run({ target }) {
	confetti(target);
}
`;

const code = ref(initialCode);
const ranCode = ref<string>();
const entries = shallowRef<ConsoleEntry[]>([]);
const editor = useTemplateRef<InstanceType<typeof CodeEditor>>("editor");

let nextId = 0;
let pending: ConsoleEntry[] = [];
let flushFrame: number | undefined;

/**
 * Adds an entry to the console. Entries are added once per frame, so code that logs in a loop can't flood the page.
 */
function log(entry: Omit<ConsoleEntry, "id" | "time">) {
	pending.push({ ...entry, id: nextId++, time: new Date() });
	flushFrame ??= requestAnimationFrame(() => {
		entries.value = [...entries.value, ...pending].slice(-MAX_ENTRIES);
		pending = [];
		flushFrame = undefined;
	});
}

function clear() {
	pending = [];
	entries.value = [];
}

function handleMessage(message: Exclude<SandboxMessage, { type: "ready" }>) {
	switch (message.type) {
		case "log":
			log({
				level: message.level,
				text: message.text,
				location: message.location,
			});
			break;
		case "error":
			log({
				level: "error",
				text: message.text,
				location: message.location,
			});
			if (message.location) {
				// the first line of a stack trace is the error's message.
				editor.value?.markError(
					message.location,
					message.text.split("\n")[0],
				);
			}
			break;
		case "loaded":
			if (message.ok && !message.hasRun) {
				log({
					level: "warn",
					text: `${fileName} doesn't export a run() function, so clicking the button does nothing.`,
				});
			}
			break;
	}
}

const sandbox = markRaw(new CodeSandbox({ onMessage: handleMessage }));

function run() {
	ranCode.value = code.value;
	editor.value?.clearMarkers();
	log({ level: "system", text: `Ran ${fileName}` });
	sandbox.run(code.value, fileName);
}

onMounted(run);
onBeforeUnmount(() => {
	if (flushFrame !== undefined) cancelAnimationFrame(flushFrame);
});
</script>

<template>
	<div
		class="relative grid grid-cols-[minmax(0,1fr)_600px] gap-y-4 gap-x-6 touch-manipulation"
	>
		<CodeEditor
			ref="editor"
			v-model="code"
			:file-name
			:dirty="code !== ranCode"
			@run="run"
		/>
		<div class="flex flex-col gap-4">
			<CodePreviewStage :sandbox />
			<CodeConsole
				:entries
				:file-name
				@clear="clear"
				@reveal="editor?.reveal($event)"
			/>
		</div>
	</div>
</template>
