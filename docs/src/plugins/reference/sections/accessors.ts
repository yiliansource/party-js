import type { Element } from "hast";
import type { HastVisitorContext } from "satteri";

import { ensure, expect, type RowWithName, replaceSection } from "../rows";
import { isElement, type Section, splitByHeading } from "../tree";
import type { SectionHandler } from "../walk";

function readAccessor(
	{ heading, body }: Section,
	level: number,
	ctx: HastVisitorContext,
): RowWithName {
	const signatures = splitByHeading(body, level + 1).sections;
	const findSignature = (title: string) =>
		signatures.find((s) => ctx.textContent(s.heading).trim() === title);
	const get = expect(
		findSignature("Get Signature"),
		"accessor did not contain a getter",
	);
	const set = findSignature("Set Signature");

	const { intro, sections } = splitByHeading(get.body, level + 2);
	const returns = sections.find(
		(s) => ctx.textContent(s.heading).trim() === "Returns",
	);
	const maybeType = returns?.body[0];
	ensure(!!maybeType && isElement(maybeType, "p"), "malformed type");
	const type = maybeType as Element;

	const description = intro.filter(
		(node) => !(node.type === "element" && node.tagName === "pre"),
	);
	const setDescription = set
		? splitByHeading(set.body, level + 2).intro.filter(
				(n) => !(n.type === "element" && n.tagName === "pre"),
			)
		: [];

	return {
		name: ctx.textContent(heading).trim(),
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

export const accessors: SectionHandler = (section, { level, ctx }) => {
	replaceSection(
		section,
		() => readAccessorsSection(section, level, ctx),
		ctx,
	);
};
