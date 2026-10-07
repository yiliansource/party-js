import type { HastVisitorContext } from "satteri";

import { ensure, expect } from "../read";
import { type Row, renderRows } from "../rows";
import { replaceBody, type Section } from "../section";
import { isElement, splitByHeading, textOf } from "../tree";
import type { SectionHandler } from "../walk";

function readParameter(
	{ heading, body }: Section,
	ctx: HastVisitorContext,
): Row {
	const [first, ...description] = body;
	const rawName = textOf(heading, ctx);
	const optional = rawName.endsWith("?");
	const name = optional ? rawName.slice(0, -1) : rawName;
	const type = expect(
		isElement(first, "p") && first,
		`parameter "${rawName}" has no type paragraph`,
	);
	const typeEqualIndex = type.children.findIndex(
		(c) => c.type === "text" && c.value === " = ",
	);

	return {
		name,
		optional,
		type:
			textOf(type, ctx) === name
				? undefined
				: typeEqualIndex >= 0
					? type.children.slice(0, typeEqualIndex)
					: type.children,
		default:
			typeEqualIndex >= 0
				? type.children.slice(typeEqualIndex + 1)
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

/**
 * Replaces a "Parameters" section with a rendered table of parameters.
 */
export const parameters: SectionHandler = (section, { level, ctx }) => {
	replaceBody(
		section,
		() => renderRows(readParametersSection(section, level, ctx)),
		ctx,
	);
};
