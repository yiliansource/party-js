import type { HastVisitorContext } from "satteri";

import { expect } from "../read";
import { type Row, renderRows } from "../rows";
import { replaceBody, type Section } from "../section";
import { isElement, textOf } from "../tree";
import type { SectionHandler } from "../walk";

function readReturn({ body }: Section, ctx: HastVisitorContext): Row | null {
	const [maybeType, ...description] = body;
	const type = expect(
		isElement(maybeType, "p") && maybeType,
		"return type has no paragraph",
	);
	if (description.length === 0 && textOf(type, ctx) === "void") return null;

	return {
		type: type.children,
		description,
	};
}

export const returns: SectionHandler = (section, { ctx }) => {
	replaceBody(
		section,
		() => {
			const row = readReturn(section, ctx);
			return row && renderRows([row]);
		},
		ctx,
	);
};
