import type { Element } from "hast";
import type { HastVisitorContext } from "satteri";

import { ensure, type Row, replaceSection } from "../rows";
import { isElement, type Section } from "../tree";
import type { SectionHandler } from "../walk";

function readReturn(
	{ body }: Section,
	_level: number,
	_ctx: HastVisitorContext,
): Row {
	const [maybeType, ...description] = body;
	ensure(!!maybeType && isElement(maybeType, "p"), "malformed type");
	const type = maybeType as Element;

	return {
		type: type.children,
		description,
	};
}

export const returns: SectionHandler = (section, { level, ctx }) => {
	replaceSection(section, () => [readReturn(section, level, ctx)], ctx);
};
