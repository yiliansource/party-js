import type { Element, ElementContent, RootContent } from "hast";
import type { HastVisitorContext } from "satteri";

export interface Section {
	heading: Element;
	body: RootContent[];
}

export const isElement = (node: RootContent, tag: string): node is Element =>
	node.type === "element" && node.tagName === tag;

export const isHeading = (node: RootContent, level: number): node is Element =>
	isElement(node, `h${level}`);

export const isIgnorable = (node: RootContent): boolean =>
	(node.type === "text" && node.value.trim() === "") ||
	(node.type === "element" && node.tagName === "hr");

export const headingText = (
	node: RootContent,
	ctx: HastVisitorContext,
): string => ctx.textContent(node).trim();

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

export function jsonClone<T>(node: T): T {
	return JSON.parse(JSON.stringify(node));
}

export function el(
	tagName: string,
	className: string | undefined,
	children: ElementContent[],
): Element {
	return {
		type: "element",
		tagName,
		properties: {
			className: className !== undefined ? [className] : undefined,
		},
		children,
	};
}
