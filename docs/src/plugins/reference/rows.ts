import type { Element, ElementContent, RootContent } from "hast";
import type { HastVisitorContext } from "satteri";

import { el, headingText, jsonClone, type Section } from "./tree";

export class ReadError extends Error {}

export interface Row {
	id?: string;
	name?: string;
	optional?: boolean;
	modifiers?: string[];
	type?: ElementContent[];
	default?: ElementContent[];
	description: RootContent[];
}

export type RowWithName = Row & Required<Pick<Row, "name">>;

export function ensure(condition: boolean, reason: string): void {
	if (!condition) throw new ReadError(reason);
}

export function expect<T>(
	value: T | undefined | null | false,
	reason: string,
): T {
	if (value === undefined || value === null || value === false)
		throw new ReadError(reason);
	return value;
}

export function attempt<T>(read: () => T): { value: T } | { reason: string } {
	try {
		return { value: read() };
	} catch (error) {
		if (error instanceof ReadError) return { reason: error.message };
		throw error;
	}
}

export function renderRows(rows: Row[]): Element {
	return el(
		"dl",
		"ref-params",
		rows.map((row) => {
			const head: ElementContent[] = [];
			if (row.name) {
				head.push(
					el("code", "ref-param-name", [
						{ type: "text", value: row.name },
					]),
				);
			}
			if (row.optional) {
				head.push(
					el("span", "ref-param-optional", [
						{ type: "text", value: "optional" },
					]),
				);
			}
			if (row.type) {
				head.push(el("span", "ref-param-type", jsonClone(row.type)));
			}

			const body: ElementContent[] = [el("dt", "ref-param-head", head)];
			if (row.description.length > 0) {
				body.push(
					el(
						"dd",
						"ref-param-description",
						jsonClone(row.description) as ElementContent[],
					),
				);
			}

			return el("div", "ref-param", body);
		}),
	);
}

export function replaceSection(
	section: Section,
	read: () => Row[],
	ctx: HastVisitorContext,
) {
	const result = attempt(read);
	if ("reason" in result) {
		console.warn(
			ctx,
			`"${headingText(section.heading, ctx)}" left as is: ${result.reason}`,
		);
		return;
	}
	for (const node of section.body) ctx.removeNode(node);
	ctx.insertAfter(section.heading, renderRows(result.value));
}
