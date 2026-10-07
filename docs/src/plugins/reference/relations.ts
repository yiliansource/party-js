import type { Element, ElementContent, RootContent } from "hast";
import type { HastVisitorContext } from "satteri";

import { expect, ReadError } from "./read";
import { el, isElement, text, textOf } from "./tree";
import { jsonClone } from "./util";

const ref = (nodes: ElementContent[]): Element =>
	el("span", "ref-relation-target", jsonClone(nodes));

/**
 * Helper function to correctly read the `Extends` section, which joins multiple parents with ".".
 */
function splitAtDots(nodes: readonly ElementContent[]): Element[] {
	const groups: ElementContent[][] = [[]];
	let depth = 0;
	for (const node of nodes) {
		if (node.type !== "text") {
			groups[groups.length - 1].push(node);
			continue;
		}
		for (const part of node.value.split(/([<>.])/)) {
			if (part === "." && depth === 0) {
				groups.push([]);
				continue;
			}
			if (part === "<") depth++;
			if (part === ">") depth--;
			if (part) groups[groups.length - 1].push(text(part));
		}
	}
	return groups.filter((group) => group.length > 0).map(ref);
}

/**
 * Reads the referenced types of a relation section body:
 * - a list (`Extends`, `Implements`, `Extended by`) has one type per item
 * - a paragraph (`Overrides`, `Inherited from`, `Implementation of` for own types)
 * - a code block (the same, for external types: `Error.constructor;`)
 */
export function readRefs(
	body: readonly RootContent[],
	ctx: HastVisitorContext,
	{ splitDots = false } = {},
): Element[] {
	const [node, ...rest] = body;
	expect(
		rest.length === 0,
		"expected a single list, paragraph or code block",
	);

	if (isElement(node, "ul")) {
		const items = node.children.filter((child) => isElement(child, "li"));
		expect(items.length > 0, "empty list");
		return items.flatMap((item) =>
			splitDots ? splitAtDots(item.children) : [ref(item.children)],
		);
	}
	if (isElement(node, "p")) return [ref(node.children)];
	if (isElement(node, "pre")) {
		const code = textOf(node, ctx).trim().replace(/;$/, "");
		return [ref([el("code", undefined, [text(code)])])];
	}

	throw new ReadError(
		`unexpected ${node?.type === "element" ? `<${node.tagName}>` : (node?.type ?? "empty body")}`,
	);
}

export function renderRelation(
	label: string,
	refs: readonly Element[],
): Element {
	const list = refs.flatMap((r, i) =>
		i === 0 ? [r] : [el("span", "ref-relation-comma", [text(", ")]), r],
	);
	return el("p", "ref-relation", [
		el("span", "ref-relation-label", [text(label)]),
		text(" "),
		...list,
	]);
}
