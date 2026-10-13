<script setup lang="ts">
import { computed, reactive } from "vue";

import BarField from "../ui/BarField.vue";
import CodeBlock from "../ui/CodeBlock.vue";
import Panel from "../ui/Panel.vue";
import PanelText from "../ui/PanelText.vue";
import SwatchPicker from "../ui/SwatchPicker.vue";
import SwitchField from "../ui/SwitchField.vue";
import ActualSizeStrip from "./ActualSizeStrip.vue";
import { shapeCode } from "./code";
import { PREVIEW_COLORS } from "./colors";
import ShapePreviewStage from "./ShapePreviewStage.vue";
import ShapeSettings from "./ShapeSettings.vue";
import ShapeTypePicker from "./ShapeTypePicker.vue";
import { createDraft, createPreview, toShape } from "./state";

const draft = reactive(createDraft());
const preview = reactive(createPreview());

const shape = computed(() => toShape(draft));
const colors = computed(
	() => PREVIEW_COLORS.find((c) => c.value === preview.color)?.colors ?? [],
);
const tokens = computed(() => shapeCode(draft));
</script>

<template>
	<div class="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-y-4 gap-x-6">
		<div class="flex flex-col gap-4">
			<Panel title="Shape">
				<ShapeTypePicker v-model="draft.type" />
				<ShapeSettings v-model="draft" />
				<PanelText>
					Need something these can't draw? A <code>custom</code> shape
					allows you to draw shapes using your own canvas code. See
					<a href="/guides/custom-shapes/">Custom shapes</a>.
				</PanelText>
			</Panel>
			<Panel title="Preview">
				<PanelText>
					These values are only for preview, they won't be part of the
					copied code.
				</PanelText>
				<SwatchPicker
					v-model="preview.color"
					label="Color"
					:options="PREVIEW_COLORS"
				/>
				<BarField
					v-model="preview.size"
					label="Particle size"
					:min="6"
					:max="40"
					:step="1"
					:format="(v) => `${v}px`"
				/>
				<SwitchField v-model="preview.lighting" label="Lighting" />
			</Panel>
		</div>
		<div class="flex flex-col gap-4">
			<ShapePreviewStage
				v-model:paused="preview.paused"
				:shape
				:colors
				:size="preview.size"
				:lighting="preview.lighting"
			/>
			<div class="flex flex-col gap-4 xl:flex-row">
				<ActualSizeStrip
					:shape
					:colors
					:size="preview.size"
					:lighting="preview.lighting"
				/>
				<CodeBlock
					file="shape.js"
					comment="e.g. confetti(el, { shapes: [shape] })"
					:tokens="tokens"
				/>
			</div>
		</div>
	</div>
</template>
