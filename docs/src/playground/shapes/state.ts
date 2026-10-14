import { prefersReductionMotion } from "../shared/preference";
import type { PreviewColor } from "./colors";

export interface PreviewSettings {
	color: PreviewColor;
	size: number;
	lighting: boolean;
	background: "page" | "light" | "dark";
	paused: boolean;
}

export const createPreview = (): PreviewSettings => ({
	color: "mixed",
	size: 16,
	lighting: true,
	background: "page",
	paused: prefersReductionMotion(),
});
