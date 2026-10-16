export function withUnit(text: string, unit?: string): string {
	if (!unit) return text;
	return unit === "°" ? `${text}°` : `${text} ${unit}`;
}
