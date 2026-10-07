import { readRefs, renderRelation } from "../relations";
import { replaceSection } from "../section";
import { textOf } from "../tree";
import type { SectionHandler } from "../walk";

const LABELS: Record<string, string> = {
	Overrides: "overrides",
	"Inherited from": "inherited from",
	"Implementation of": "implements",
};

export const note: SectionHandler = (section, { ctx }) => {
	const label = LABELS[textOf(section.heading, ctx)];
	replaceSection(
		section,
		() => {
			// every constructor "overrides" its parent's constructor, so the note says nothing.
			const target = section.body
				.map((node) => textOf(node, ctx))
				.join("")
				.trim()
				.replace(/;$/, "");
			if (label === "overrides" && target.endsWith(".constructor"))
				return null;
			return renderRelation(label, readRefs(section.body, ctx));
		},
		ctx,
	);
};
