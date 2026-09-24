import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: {
			index: "src/index.ts",
			physics: "src/physics.ts",
		},
		format: ["esm"],
		dts: true,
		sourcemap: false,
		outDir: "dist",
		clean: true,
		external: ["react", "vue"],
	},
	{
		entry: {
			"party.min": "src/index.ts",
		},
		format: ["iife"],
		globalName: "party",
		outDir: "bundle",
		minify: true,
		clean: true,
		outExtension: () => ({ js: ".js" }),
	},
]);
