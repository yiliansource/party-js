<script setup lang="ts"></script>

<template>
	<div class="relative bg-surface rounded-2xl h-90">
		<slot></slot>

		<div class="absolute inset-4 pointer-events-none *:pointer-events-auto">
			<span
				class="absolute left-0 top-1 text-xs font-mono font-medium text-subtle uppercase tracking-wider"
				>Preview</span
			>
			<div
				class="absolute top-0 right-0 flex flex-row items-center justify-between"
			>
				<slot name="actions"></slot>
			</div>
			<div class="absolute bottom-0 right-0 flex flex-row items-center">
				<slot name="footer"></slot>
			</div>
		</div>
	</div>
</template>
