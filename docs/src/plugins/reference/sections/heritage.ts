import type { Root } from "hast";
import type { HastVisitorContext } from "satteri";

import { readRefs, renderRelation } from "../relations";
import { extractSection } from "../section";
import { el } from "../tree";
import type { PageState, SectionHandler } from "../walk";

const KINDS = {
	Extends: "extends",
	Implements: "implements",
	"Extended by": "extended by",
} as const;
export type HeritageKind = (typeof KINDS)[keyof typeof KINDS];

const ORDER: HeritageKind[] = ["extends", "implements", "extended by"];

export function flushHeritage(
	page: PageState,
	root: Root,
	ctx: HastVisitorContext,
): void {
	const lines = ORDER.flatMap((kind) => page.heritage.get(kind) ?? []);
	if (lines.length > 0)
		ctx.prependChild(root, el("div", "ref-heritage", lines));
}

export const heritage = (kind: HeritageKind): SectionHandler => {
	return (section, { ctx, page }) => {
		const result = extractSection(
			section,
			() =>
				renderRelation(
					kind,
					readRefs(section.body, ctx, {
						splitDots: kind === "extends",
					}),
				),
			ctx,
		);

		if (result) page.heritage.set(kind, result);
	};
};
