import { MIXED_COLORS } from "../shared/defaults.ts";
import type { SwatchOption } from "../shared/ui/SwatchPicker.vue";

const pie = (colors: readonly string[]) =>
	`conic-gradient(${colors.map((c, i) => `${c} 0 ${((i + 1) / colors.length) * 100}%`).join(", ")})`;

export const PREVIEW_COLORS = [
	{
		value: "mixed",
		label: "Mixed",
		swatch: pie(MIXED_COLORS),
		colors: MIXED_COLORS,
	},
	{
		value: "coral",
		label: "Coral",
		swatch: "#ff5a5f",
		colors: ["#ff5a5f"],
	},
	{
		value: "yellow",
		label: "Yellow",
		swatch: "#ffb400",
		colors: ["#ffb400"],
	},
	{
		value: "teal",
		label: "Teal",
		swatch: "#00a699",
		colors: ["#00a699"],
	},
	{
		value: "purple",
		label: "Purple",
		swatch: "#7b61ff",
		colors: ["#7b61ff"],
	},
] as const satisfies readonly (SwatchOption & { colors: readonly string[] })[];

export type PreviewColor = (typeof PREVIEW_COLORS)[number]["value"];
