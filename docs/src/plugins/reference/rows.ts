import type { Element, ElementContent, RootContent } from "hast";

import { el, text, trimLeadingPipe } from "./tree";
import { jsonClone } from "./util";

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

function renderRow(row: Row): Element {
	const head: ElementContent[] = [];
	if (row.name) {
		head.push(el("code", "ref-param-name", [text(row.name)]));
	}
	for (const modifier of row.modifiers ?? []) {
		head.push(el("span", "ref-param-modifier", [text(modifier)]));
	}
	if (row.optional) {
		head.push(el("span", "ref-param-optional", [text("optional")]));
	}
	if (row.type) {
		head.push(
			el("span", "ref-param-type", trimLeadingPipe(jsonClone(row.type))),
		);
	}
	if (row.default) {
		head.push(
			el("span", "ref-param-default", [
				el("span", "ref-param-default-label", [text("default")]),
				el("span", "ref-param-default-value", jsonClone(row.default)),
			]),
		);
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
}

export function renderRows(rows: Row[]): Element {
	return el("dl", "ref-params", rows.map(renderRow));
}
