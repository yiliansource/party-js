import type { Element, RootContent } from "hast";
import type { HastVisitorContext } from "satteri";

import type { Section } from "./section";
import type { HeritageKind } from "./sections/heritage";
import { mergeProperties } from "./sections/merge";
import { splitByHeading, textOf } from "./tree";

export interface PageState {
	heritage: Map<HeritageKind, Element>;
}
export interface HandlerContext {
	level: number;
	ctx: HastVisitorContext;
	walk: (nodes: readonly RootContent[], level: number) => void;
	page: PageState;
}

export type SectionHandler = (section: Section, hc: HandlerContext) => void;

export function createWalker(
	handlers: Record<string, SectionHandler>,
	ctx: HastVisitorContext,
	page: PageState,
) {
	const walk = (nodes: readonly RootContent[], level: number): void => {
		if (level > 6) return;

		const sections = splitByHeading(nodes, level).sections;
		const handled = mergeProperties(sections, level, ctx);
		for (const section of sections) {
			if (handled.has(section)) continue;

			const handler = handlers[textOf(section.heading, ctx)];
			if (handler) handler(section, { level, ctx, walk, page });
			else walk(section.body, level + 1);
		}
	};
	return walk;
}
