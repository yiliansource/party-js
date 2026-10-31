<script setup lang="ts">
import { type LucideIcon, TypeIcon } from "@lucide/vue";
import { circlePath } from "party-js/internal/shapes/circle";
import { polygonPath } from "party-js/internal/shapes/polygon";
import { squarePath } from "party-js/internal/shapes/square";
import { starPath } from "party-js/internal/shapes/star";
import { useId } from "vue";

import { HEART_PATH_D } from "../defaults";
import ShapeIcon from "../ui/ShapeIcon.vue";
import type { ShapeType } from "./draft";

interface ShapeOption {
	type: ShapeType;
	label: string;
	icon: Path2D | LucideIcon;
}

const model = defineModel<ShapeType>({ required: true });

const name = useId();

const options: ShapeOption[] = [
	{
		type: "square",
		label: "Square",
		icon: squarePath(1, 0.1),
	},
	{
		type: "circle",
		label: "Circle",
		icon: circlePath(),
	},
	{
		type: "star",
		label: "Star",
		icon: starPath(5),
	},
	{
		type: "polygon",
		label: "Polygon",
		icon: polygonPath(5),
	},
	{
		type: "path",
		label: "Path",
		icon: new Path2D(HEART_PATH_D),
	},
	{
		type: "text",
		label: "Text",
		icon: TypeIcon,
	},
	// {
	// 	type: "image",
	// 	label: "Image",
	// 	icon: ImageIcon,
	// },
];

const isPath = (icon: ShapeOption["icon"]): icon is Path2D =>
	icon instanceof Path2D;
</script>

<template>
	<fieldset class="p-0 grid grid-cols-5 gap-1">
		<legend class="sr-only">Shape type</legend>
		<label
			v-for="option in options"
			:key="option.type"
			:title="option.label"
			class="relative flex-1 pt-3 pb-2 inline-flex flex-col gap-1.5 items-center bg-field rounded-lg cursor-pointer
				shadow-[inset_0_0_0_1px_var(--color-field-line)] text-subtle
				has-checked:text-muted
				has-checked:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-fg)]
				has-focus-visible:outline-2 has-focus-visible:outline-offset-[6px] has-focus-visible:outline-accent-600"
		>
			<input
				v-model="model"
				type="radio"
				:name
				:value="option.type"
				class="sr-only"
			>
			<ShapeIcon :path="option.icon" v-if="isPath(option.icon)" />
			<component :is="option.icon" v-else />
			<span class="text-xs font-semibold">{{ option.label }}</span>
		</label>
	</fieldset>
</template>
