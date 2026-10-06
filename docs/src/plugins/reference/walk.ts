import type { RootContent } from "hast";
import type { HastVisitorContext } from "satteri";

import { mergeProperties } from "./sections/merge";
import { type Section, splitByHeading } from "./tree";

export interface HandlerContext {
	level: number;
	ctx: HastVisitorContext;
	walk: (nodes: readonly RootContent[], level: number) => void;
}
export type SectionHandler = (section: Section, hc: HandlerContext) => void;

export function createWalker(
	handlers: Record<string, SectionHandler>,
	ctx: HastVisitorContext,
) {
	const walk = (nodes: readonly RootContent[], level: number): void => {
		if (level > 6) return;

		const sections = splitByHeading(nodes, level).sections;
		const handled = mergeProperties(sections, level, ctx);
		for (const section of sections) {
			if (handled.has(section)) continue;

			const headingText = ctx.textContent(section.heading).trim();
			const handler = handlers[headingText];
			if (handler) handler(section, { level, ctx, walk });
			else walk(section.body, level + 1);
		}
	};
	return walk;
}
