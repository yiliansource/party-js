import { color } from "party-js";
import { format } from "party-js/internal/color/format";

export const MIXED_COLORS = ["#ff5a5f", "#ffb400", "#00a699", "#7b61ff"];

export function toHexColor(input: string): string {
	const [r, g, b] = (format(color(input)).match(/\d+/g) ?? []).map(Number);
	return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
