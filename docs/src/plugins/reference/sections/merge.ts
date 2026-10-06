import type { HastVisitorContext } from "satteri";

import { attempt, renderRows } from "../rows";
import { el, type Section } from "../tree";
import { readAccessorsSection } from "./accessors";
import { readPropertiesSection } from "./properties";

export function mergeProperties(
	sections: Section[],
	level: number,
	ctx: HastVisitorContext,
): Set<Section> {
	const find = (title: string) =>
		sections.find((s) => ctx.textContent(s.heading).trim() === title);

	const properties = find("Properties");
	const accessors = find("Accessors");
	if (!accessors) return new Set();

	const result = attempt(() => [
		...(properties ? readPropertiesSection(properties, ctx) : []),
		...readAccessorsSection(accessors, level, ctx),
	]);
	if ("reason" in result) return new Set();

	const rows = result.value.sort((a, b) => a.name.localeCompare(b.name));

	for (const node of [...(properties?.body ?? []), ...accessors.body])
		ctx.removeNode(node);
	if (properties) {
		ctx.insertAfter(properties.heading, renderRows(rows));
		ctx.removeNode(accessors.heading);
	} else {
		ctx.replaceNode(accessors.heading, [
			el(`h${level}`, undefined, [{ type: "text", value: "Properties" }]),
			renderRows(rows),
		]);
	}
	return new Set(properties ? [properties, accessors] : [accessors]);
}
