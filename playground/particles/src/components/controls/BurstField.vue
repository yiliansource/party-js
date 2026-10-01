<script setup lang="ts">
import { TrashIcon } from "@lucide/vue";

import FieldStack from "@ui/controls/field/base/FieldStack.vue";
import NumberInput from "@ui/controls/input/NumberInput.vue";

import type { EmissionBurst } from "@/emitter";

const model = defineModel<EmissionBurst[]>({ required: true });
</script>

<template>
	<FieldStack label="Bursts">
		<div class="flex flex-col gap-1" v-if="model.length > 0">
			<div
				class="flex flex-row gap-1 text-content-secondary uppercase text-xs font-medium"
			>
				<p class="flex-1">Time</p>
				<p class="flex-1">Count</p>
				<div class="basis-7 grow-0"></div>
			</div>
			<div
				class="flex flex-row gap-1"
				v-for="(burst, index) in model"
				:key="index"
			>
				<NumberInput
					class="flex-1 min-w-0"
					:min="0"
					v-model="burst.time"
				/>
				<NumberInput
					class="flex-1 min-w-0"
					:min="0"
					v-model="burst.count"
				/>
				<button
					class="ml-1 p-1 cursor-pointer text-content-secondary"
					type="button"
					@click="() => model.splice(index, 1)"
				>
					<TrashIcon class="size-4" />
				</button>
			</div>
		</div>
		<div>
			<button
				class="px-4 py-2 border-2 border-card-muted border-dashed rounded-lg w-full uppercase text-content-secondary font-medium text-xs cursor-pointer"
				type="button"
				@click="() => model.push({ time: 0, count: 20})"
			>
				Add Burst
			</button>
		</div>
	</FieldStack>
</template>
