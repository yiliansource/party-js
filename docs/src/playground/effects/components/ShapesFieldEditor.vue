<script setup lang="ts">
import { PlusIcon, XIcon } from "@lucide/vue";
import { circlePath } from "party-js/internal/shapes/circle";
import { polygonPath } from "party-js/internal/shapes/polygon";
import { squarePath } from "party-js/internal/shapes/square";
import { starPath } from "party-js/internal/shapes/star";
import { computed, ref } from "vue";

import { createShapeDraft, type ShapeDraft } from "../../shared/shape/draft";
import ShapeEditor from "../../shared/shape/ShapeEditor.vue";
import PanelText from "../../shared/ui/PanelText.vue";
import ShapeIcon from "../../shared/ui/ShapeIcon.vue";
import { isDefault } from "../fields";
import type { EffectDraft, ShapesField } from "../schema";
import { useFieldValue } from "../useFieldValue";
import FieldHeader from "./FieldHeader.vue";

const { field, draft } = defineProps<{
	field: ShapesField;
	draft: EffectDraft;
}>();

const value = useFieldValue(
	() => draft,
	() => field,
);
const changed = computed(() => !isDefault(field, value.value));

interface ShapeDisplay {
	label: string;
	path: Path2D;
}

const shapeDisplays = computed(() => value.value.map(toShapeDisplay));

function toShapeDisplay(draft: ShapeDraft): ShapeDisplay {
	if (draft.type === "square") {
		return {
			label:
				draft.square.aspectRatio < 1
					? "Strip"
					: draft.square.cornerRadius === 0
						? "Square"
						: "Rounded square",
			path: squarePath(
				draft.square.aspectRatio,
				draft.square.cornerRadius,
			),
		};
	} else if (draft.type === "circle") {
		return {
			label: "Circle",
			path: circlePath(),
		};
	} else if (draft.type === "star") {
		return {
			label: `${draft.star.points}-point star`,
			path: starPath(draft.star.points),
		};
	} else if (draft.type === "polygon") {
		return {
			label: `${draft.polygon.sides}-gon`,
			path: polygonPath(draft.polygon.sides),
		};
	} else if (draft.type === "path") {
		return {
			label: "Path",
			path: new Path2D(draft.path.d),
		};
	}
	throw new Error("invalid shape draft type");
}

const selectedIndex = ref<number | null>(null);

function reset() {
	selectedIndex.value = null;
	value.value = structuredClone(field.default);
}

function addShape() {
	value.value.push(createShapeDraft("circle"));
}
function removeShape(index: number) {
	value.value.splice(index, 1);
	if (selectedIndex.value === null) return;
	if (selectedIndex.value === index) selectedIndex.value = null;
	else if (selectedIndex.value > index) selectedIndex.value--;
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<FieldHeader :label="field.label" :changed @reset="reset" />
		<ul class="pl-0 mb-1 list-none flex flex-row flex-wrap gap-2">
			<li
				v-for="(display, index) in shapeDisplays"
				:key="index"
				class="flex flex-row items-center bg-field border border-field-line rounded-xl [&>button]:bg-transparent
					has-aria-pressed:ring-2"
			>
				<button
					type="button"
					class="py-1.5 px-2.5 flex flex-row items-center gap-2 cursor-pointer rounded-xl
						focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent-600"
					:aria-pressed="selectedIndex === index"
					@click="selectedIndex = selectedIndex === index ? null : index"
				>
					<ShapeIcon :path="display.path" class="size-4!" />
					<span class="font-medium text-sm">{{ display.label }}</span>
				</button>
				<button
					type="button"
					:aria-label="`Remove ${display.label}`"
					:disabled="value.length === 1"
					@click="removeShape(index)"
					class="p-1 mr-1 grid place-items-center rounded-lg cursor-pointer
						disabled:opacity-50 disabled:cursor-not-allowed not-disabled:hover:bg-raised
						focus-visible:outline-2 focus-visible:outline-accent-600"
				>
					<XIcon :size="14" />
				</button>
			</li>
			<li>
				<button
					type="button"
					@click="addShape"
					class="py-1.5 px-2.5 flex flex-row items-center gap-1 bg-transparent hover:bg-raised border border-raised rounded-xl cursor-pointer
						focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
				>
					<PlusIcon :size="14" />
					<span class="font-medium text-sm">Add shape</span>
				</button>
			</li>
		</ul>
		<fieldset
			v-if="selectedIndex !== null"
			class="p-4 min-w-0 bg-field rounded-xl"
		>
			<legend class="sr-only">
				Edit {{ shapeDisplays[selectedIndex].label }}
			</legend>
			<ShapeEditor :draft="value[selectedIndex]">
				<PanelText>
					Want to see the shape up close first? Design it in the
					<a href="/playgrounds/shapes/">Shapes playground</a>!
				</PanelText>
			</ShapeEditor>
		</fieldset>
	</div>
</template>
