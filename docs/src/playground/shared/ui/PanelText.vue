<script setup lang="ts"></script>

<template>
	<p
		:class="[
			'text-[13px] text-subtle leading-relaxed',
			'[&_a]:text-fg [&_a]:underline-offset-3',
			'[&_code]:text-fg'
		]"
	>
		<slot></slot>
	</p>
</template>
