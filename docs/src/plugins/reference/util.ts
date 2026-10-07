import type { HastVisitorContext } from "satteri";

export function warn(ctx: HastVisitorContext, text: string): void {
	console.warn(`[${ctx.fileURL}] ${text}`);
}

export function jsonClone<T>(node: T): T {
	return JSON.parse(JSON.stringify(node));
}
