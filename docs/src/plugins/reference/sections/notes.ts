import { readRefs, renderRelation } from "../relations";
import { replaceSection } from "../section";
import type { SectionHandler } from "../walk";

const LABELS = {
	Overrides: "overrides",
	"Inherited from": "inherited from",
	"Implementation of": "implements",
} as const;
export type NoteLabel = (typeof LABELS)[keyof typeof LABELS];

export const note = (label: NoteLabel): SectionHandler => {
	return (section, { ctx }) => {
		replaceSection(
			section,
			() => renderRelation(label, readRefs(section.body, ctx)),
			ctx,
		);
	};
};
