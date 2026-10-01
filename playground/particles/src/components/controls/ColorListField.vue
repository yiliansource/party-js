<script setup lang="ts">
import { TrashIcon } from "@lucide/vue";
import { reactive, watch } from "vue";

import { type Color, color, toCssColor } from "@/color/color";

const model = defineModel<string[]>({ required: true });

interface Row {
	id: number;
	draft: string;
	parsed: Color | null;
}

let nextId = 0;
function tryParseColor(input: string): Color | null {
	try {
		return color(input);
	} catch {
		return null;
	}
}
function makeRow(initial: string): Row {
	return { id: nextId++, draft: initial, parsed: tryParseColor(initial) };
}

const rows = reactive<Row[]>(model.value.map(makeRow));

watch(model, (newColors) => {
	rows.splice(0, rows.length, ...newColors.map(makeRow));
});

function onRowInput(row: Row, value: string): void {
	row.draft = value;
	row.parsed = tryParseColor(value);
	if (row.parsed) {
		model.value[rows.indexOf(row)] = value;
	}
}
function addRow(): void {
	const c = "#ffffff";
	rows.push(makeRow(c));
	model.value.push(c);
}
function removeRow(row: Row): void {
	const index = rows.indexOf(row);
	rows.splice(index, 1);
	model.value.splice(index, 1);
}
</script>

<template>
	<div class="flex flex-col gap-1">
		<div v-for="row in rows" :key="row.id" class="flex flex-row gap-1">
			<span
				:class="[
                    'inline-block my-auto mr-1 size-5 border-2 rounded-md',
                    row.parsed ? 'border-card-muted' : 'border-red-400 border-dashed'
                ]"
				:style="row.parsed ? { background: toCssColor(row.parsed) } : {}"
			/>
			<input
				type="text"
				:class="[
                    'grow px-2 py-1 border-2 font-mono text-sm rounded-lg outline-none',
                    row.parsed ? 'border-card-muted' : 'border-red-400'
                ]"
				:value="row.draft"
				@input="onRowInput(row, ($event.target as HTMLInputElement).value)"
			>
			<button
				class="ml-1 p-1 cursor-pointer text-content-secondary"
				type="button"
				@click="removeRow(row)"
			>
				<TrashIcon class="size-4" />
			</button>
		</div>
		<button
			class="px-4 py-1.5 border-2 border-card-muted border-dashed rounded-lg w-full uppercase text-content-secondary font-medium text-xs cursor-pointer"
			type="button"
			@click="addRow"
		>
			Add Color
		</button>
	</div>
</template>
