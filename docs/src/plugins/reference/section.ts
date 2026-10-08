import type { Element, RootContent } from "hast";
import type { HastVisitorContext } from "satteri";

import { type AttemptResult, attempt } from "./read";
import { textOf } from "./tree";
import { warn } from "./util";

export interface Section {
	heading: Element;
	body: RootContent[];
}

type Build = () => Element | null;

function run(
	section: Section,
	build: Build,
	ctx: HastVisitorContext,
): AttemptResult<Element | null> {
	const result = attempt(build);
	if ("reason" in result)
		warn(
			ctx,
			`"${textOf(section.heading, ctx)}" left as is: ${result.reason}`,
		);

	return result;
}

/**
 * Keeps the section heading but replaces its body. A `null` result removes the entire section.
 */
export function replaceBody(
	section: Section,
	build: Build,
	ctx: HastVisitorContext,
): void {
	const result = run(section, build, ctx);
	if ("reason" in result) return;

	for (const node of section.body) ctx.removeNode(node);
	if (result.value) ctx.insertAfter(section.heading, result.value);
	else ctx.removeNode(section.heading);
}

/**
 * Replaces the section and its body. A `null` result removes the entire section.
 */
export function replaceSection(
	section: Section,
	build: Build,
	ctx: HastVisitorContext,
): void {
	const result = run(section, build, ctx);
	if ("reason" in result) return;

	for (const node of section.body) ctx.removeNode(node);
	if (result.value) ctx.replaceNode(section.heading, result.value);
	else ctx.removeNode(section.heading);
}

/**
 * Removes the section and returns the built element.
 */
export function extractSection(
	section: Section,
	build: Build,
	ctx: HastVisitorContext,
): Element | null | undefined {
	const result = run(section, build, ctx);
	if ("reason" in result) return undefined;

	for (const node of section.body) ctx.removeNode(node);
	ctx.removeNode(section.heading);
	return result.value;
}
