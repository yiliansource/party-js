<script setup lang="ts">
import { computed, reactive } from "vue";

import { createShapeDraft, toParticleShape } from "../shared/shape/draft";
import ShapeEditor from "../shared/shape/ShapeEditor.vue";
import BarField from "../shared/ui/BarField.vue";
import CodeBlock from "../shared/ui/CodeBlock.vue";
import Panel from "../shared/ui/Panel.vue";
import PanelText from "../shared/ui/PanelText.vue";
import SwatchPicker from "../shared/ui/SwatchPicker.vue";
import SwitchField from "../shared/ui/SwitchField.vue";
import { shapeCode } from "./code";
import { PREVIEW_COLORS } from "./colors";
import ActualSizeStrip from "./components/ActualSizeStrip.vue";
import ShapePreviewStage from "./components/ShapePreviewStage.vue";
import { createPreview } from "./state";

const draft = reactive(createShapeDraft("star"));
const preview = reactive(createPreview());

const shape = computed(() => toParticleShape(draft));
const colors = computed(
	() => PREVIEW_COLORS.find((c) => c.value === preview.color)?.colors ?? [],
);
const tokens = computed(() => shapeCode(draft));
</script>

<template>
	<div
		class="grid grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] gap-y-4 gap-x-6 touch-manipulation"
	>
		<div class="flex flex-col gap-4">
			<Panel title="Shape">
				<ShapeEditor :draft="draft">
					<PanelText>
						Need something these can't draw? A
						<code>custom</code>
						shape allows you to draw shapes using your own canvas
						code. See
						<a href="/guides/custom-shapes/">Custom shapes</a>.
					</PanelText>
				</ShapeEditor>
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
					unit="px"
				/>
				<SwitchField v-model="preview.lighting" label="Lighting" />
			</Panel>
		</div>
		<div class="contents md:flex md:flex-col md:gap-4">
			<ShapePreviewStage
				v-model:background="preview.background"
				v-model:paused="preview.paused"
				:shape
				:colors
				:size="preview.size"
				:lighting="preview.lighting"
				class="order-first md:order-0"
			/>
			<div class="flex flex-col gap-4 xl:flex-row">
				<ActualSizeStrip
					:background="preview.background"
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
