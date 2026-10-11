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
	See: "see",
} as const;
export type HeaderRelationKind = (typeof KINDS)[keyof typeof KINDS];

const ORDER: HeaderRelationKind[] = [
	"extends",
	"implements",
	"extended by",
	"see",
];

export function flushHeader(
	page: PageState,
	root: Root,
	ctx: HastVisitorContext,
): void {
	const lines = ORDER.flatMap((kind) => page.header.get(kind) ?? []);
	if (lines.length > 0)
		ctx.prependChild(root, el("div", "ref-header", lines));
}

export const header = (kind: HeaderRelationKind): SectionHandler => {
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

		if (result) page.header.set(kind, result);
	};
};
