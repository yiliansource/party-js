import type { HastVisitorContext } from "satteri";

import { expect } from "../read";
import { type RowWithName, renderRows } from "../rows";
import { replaceBody, type Section } from "../section";
import { isElement, splitByHeading, textOf } from "../tree";
import type { SectionHandler } from "../walk";

function readAccessor(
	{ heading, body }: Section,
	level: number,
	ctx: HastVisitorContext,
): RowWithName {
	const name = textOf(heading, ctx);
	const signatures = splitByHeading(body, level + 1).sections;
	const findSignature = (title: string) =>
		signatures.find((s) => textOf(s.heading, ctx) === title);

	const get = expect(
		findSignature("Get Signature"),
		"accessor did not contain a getter",
	);
	const set = findSignature("Set Signature");

	const { intro, sections } = splitByHeading(get.body, level + 2);
	const returns = sections.find((s) => textOf(s.heading, ctx) === "Returns");
	const maybeType = returns?.body[0];
	const type = expect(
		isElement(maybeType, "p") && maybeType,
		`accessor "${name}" has no type paragraph`,
	);

	const description = intro.filter(
		(node) => !(node.type === "element" && node.tagName === "pre"),
	);
	const setDescription = set
		? splitByHeading(set.body, level + 2).intro.filter(
				(n) => !(n.type === "element" && n.tagName === "pre"),
			)
		: [];

	return {
		name,
		optional: false,
		modifiers: set ? [] : ["readonly"],
		type: type.children,
		description: description.length > 0 ? description : setDescription,
	};
}

export function readAccessorsSection(
	section: Section,
	level: number,
	ctx: HastVisitorContext,
): RowWithName[] {
	return splitByHeading(section.body, level + 1).sections.map((item) =>
		readAccessor(item, level + 1, ctx),
	);
}

/**
 * Replaces an "Accessors" section with a rendered table of accessors.
 */
export const accessors: SectionHandler = (section, { level, ctx }) => {
	replaceBody(
		section,
		() => renderRows(readAccessorsSection(section, level, ctx)),
		ctx,
	);
};
