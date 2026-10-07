import type { Element, ElementContent, Nodes, RootContent, Text } from "hast";
import type { HastVisitorContext } from "satteri";

import type { Section } from "./section";

export const isElement = <T extends string>(
	node: Nodes | undefined,
	tagName: T,
): node is Element & { tagName: T } =>
	node?.type === "element" && node.tagName === tagName;

export const isHeading = (node: RootContent, level: number): node is Element =>
	isElement(node, `h${level}`);

export const isIgnorable = (node: RootContent): boolean =>
	(node.type === "text" && node.value.trim() === "") ||
	(node.type === "element" && node.tagName === "hr");

export const textOf = (node: RootContent, ctx: HastVisitorContext): string =>
	ctx.textContent(node).trim();

export const el = (
	tagName: string,
	className: string | undefined,
	children: ElementContent[],
): Element => ({
	type: "element",
	tagName,
	properties: {
		...(className !== undefined ? { className: [className] } : {}),
	},
	children,
});

export const text = (value: string): Text => ({
	type: "text",
	value,
});

export function splitByHeading(
	nodes: readonly RootContent[],
	level: number,
): {
	intro: RootContent[];
	sections: Section[];
} {
	const intro: RootContent[] = [];
	const sections: Section[] = [];
	for (const node of nodes) {
		if (isIgnorable(node)) continue;
		if (isHeading(node, level)) sections.push({ heading: node, body: [] });
		else if (sections.length > 0) sections.at(-1)?.body.push(node);
		else intro.push(node);
	}
	return { intro, sections };
}

export function trimLeadingPipe(nodes: ElementContent[]): ElementContent[] {
	const [first, ...rest] = nodes;
	if (first?.type !== "text") return nodes;
	const value = first.value.replace(/^\s*\|\s*/, "");
	return value ? [text(value), ...rest] : rest;
}
