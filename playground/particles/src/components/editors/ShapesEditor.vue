<script setup lang="ts">
import { computed } from "vue";

import Card from "@ui/Card.vue";
import SliderField from "@ui/controls/field/SliderField.vue";

import { buildCirclePath } from "@/shapes/circle.ts";
import { buildPolygonPath } from "@/shapes/polygon.ts";
import { buildSquarePath } from "@/shapes/square.ts";
import { buildStarPath } from "@/shapes/star.ts";

import { useParticlePlaygroundState } from "../../state.ts";
import ShapeField from "../controls/ShapeField.vue";
import EditorCardTitle from "../EditorCardTitle.vue";

const { config } = useParticlePlaygroundState();

const squarePath = computed(() =>
	buildSquarePath(
		config.shapes.square.aspectRatio,
		config.shapes.square.borderRadius,
	),
);
const circlePath = computed(() => buildCirclePath());
const starPath = computed(() => buildStarPath(config.shapes.star.points));
const polygonPath = computed(() =>
	buildPolygonPath(config.shapes.polygon.sides),
);
</script>

<template>
	<Card>
		<EditorCardTitle>Shapes</EditorCardTitle>
		<SliderField
			class="mb-6"
			v-model="config.size"
			label="Size"
			:min="0"
			:max="100"
		/>
		<div class="flex flex-col gap-3">
			<ShapeField
				v-model="config.shapes.square.enabled"
				:path="squarePath"
			>
				<div class="flex flex-col gap-1">
					<SliderField
						v-model="config.shapes.square.aspectRatio"
						label="Aspect Ratio"
						:min="0.5"
						:max="2"
						:step="0.01"
					/>
					<SliderField
						v-model="config.shapes.square.borderRadius"
						label="Border Radius"
						:min="0"
						:max="1"
						:step="0.01"
					/>
				</div>
			</ShapeField>
			<ShapeField
				v-model="config.shapes.circle.enabled"
				:path="circlePath"
			>
				<p
					class="mt-2 font-medium text-xs text-content-secondary uppercase opacity-50"
				>
					Nothing to configure
				</p>
			</ShapeField>
			<ShapeField v-model="config.shapes.star.enabled" :path="starPath">
				<SliderField
					v-model="config.shapes.star.points"
					label="Points"
					:min="3"
					:max="12"
					:step="1"
				/>
			</ShapeField>
			<ShapeField
				v-model="config.shapes.polygon.enabled"
				:path="polygonPath"
			>
				<SliderField
					v-model="config.shapes.polygon.sides"
					label="Sides"
					:min="3"
					:max="12"
					:step="1"
				/>
			</ShapeField>
		</div>
	</Card>
</template>
