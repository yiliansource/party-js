import { attempt } from "../read";
import { readRefs, renderRelation } from "../relations";
import { textOf } from "../tree";
import { warn } from "../util";
import type { SectionHandler } from "../walk";

const KINDS = {
	Extends: "extends",
	Implements: "implements",
	"Extended by": "extended by",
} as const;
export type HeritageKind = (typeof KINDS)[keyof typeof KINDS];

export const heritage: SectionHandler = (section, { ctx, page }) => {
	const kind = KINDS[textOf(section.heading, ctx) as keyof typeof KINDS];
	const result = attempt(() =>
		renderRelation(
			kind,
			readRefs(section.body, ctx, { splitDots: kind === "extends" }),
		),
	);
	if ("reason" in result)
		return warn(ctx, `"${kind}" left as is: ${result.reason}`);

	for (const node of section.body) ctx.removeNode(node);
	ctx.removeNode(section.heading);
	page.heritage.set(kind, result.value);
};
