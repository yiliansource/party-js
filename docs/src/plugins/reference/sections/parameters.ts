import type { HastVisitorContext } from "satteri";

import { ensure, expect, type Row, replaceSection } from "../rows";
import { headingText, isElement, type Section, splitByHeading } from "../tree";
import type { SectionHandler } from "../walk";

function readParameter(
	{ heading, body }: Section,
	ctx: HastVisitorContext,
): Row {
	const [first, ...description] = body;
	const rawName = headingText(heading, ctx);
	const optional = rawName.endsWith("?");
	const name = optional ? rawName.slice(0, -1) : rawName;
	const type = expect(
		isElement(first, "p") && first,
		`parameter "${rawName}" has no type paragraph`,
	);

	return {
		name,
		optional,
		type:
			ctx.textContent(type) !== name
				? type.children.slice(0, 1)
				: undefined,
		description,
	};
}

export function readParametersSection(
	section: Section,
	level: number,
	ctx: HastVisitorContext,
): Row[] {
	const { intro, sections } = splitByHeading(section.body, level + 1);

	ensure(intro.length === 0, "content before the first parameter");
	ensure(sections.length > 0, "no parameters");

	return sections.map((item) => readParameter(item, ctx));
}

export const parameters: SectionHandler = (section, { level, ctx }) => {
	replaceSection(
		section,
		() => readParametersSection(section, level, ctx),
		ctx,
	);
};
