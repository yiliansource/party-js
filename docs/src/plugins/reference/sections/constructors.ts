import type { Element } from "hast";
import type { HastVisitorContext } from "satteri";

import { el, isElement, splitByHeading, text, textOf } from "../tree";
import { jsonClone } from "../util";
import type { SectionHandler } from "../walk";

// a constructor always returns its class and always "overrides" the parent constructor, so these say nothing
const REDUNDANT = new Set(["Returns", "Overrides"]);

function stripReturnType(pre: Element, ctx: HastVisitorContext): void {
	const source = textOf(pre, ctx);
	const stripped = source.replace(/\):[^;]*;$/, ");");
	if (stripped === source) return;

	const copy = jsonClone(pre);
	const [code] = copy.children;
	if (!isElement(code, "code")) return;
	code.children = [text(stripped)];
	ctx.replaceNode(pre, copy);
}

export const constructors: SectionHandler = (section, { level, ctx, walk }) => {
	const signatures = splitByHeading(section.body, level + 1).sections;

	// one constructor doesn't need its own heading, so "Constructors > Constructor" becomes "Constructor".
	if (signatures.length === 1) {
		ctx.replaceNode(
			section.heading,
			el(`h${level}`, undefined, [text("Constructor")]),
		);
		ctx.removeNode(signatures[0].heading);
	}

	for (const { body } of signatures) {
		const { intro, sections } = splitByHeading(body, level + 2);

		const signature = intro.find((node) => isElement(node, "pre"));
		if (signature) stripReturnType(signature, ctx);

		const kept = sections.filter(
			(s) => !REDUNDANT.has(textOf(s.heading, ctx)),
		);
		for (const s of sections) {
			if (kept.includes(s)) continue;
			for (const node of [s.heading, ...s.body]) ctx.removeNode(node);
		}

		walk(
			kept.flatMap((s) => [s.heading, ...s.body]),
			level + 2,
		);
	}
};
