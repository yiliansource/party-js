import type { HastVisitorContext } from "satteri";

import { attempt } from "../read";
import { renderRows } from "../rows";
import type { Section } from "../section";
import { el, text, textOf } from "../tree";
import { readAccessorsSection } from "./accessors";
import { readPropertiesSection } from "./properties";

/**
 * Merges the "Accessors" and "Properties" sections and renders them into a single "Properties" section.
 */
export function mergeProperties(
	sections: Section[],
	level: number,
	ctx: HastVisitorContext,
): Set<Section> {
	const find = (title: string) =>
		sections.find((s) => textOf(s.heading, ctx) === title);

	const properties = find("Properties");
	const accessors = find("Accessors");
	if (!accessors) return new Set(); // no "Accessors" section was present - the "Properties" section will be handled on its own

	const result = attempt(() => [
		...(properties ? readPropertiesSection(properties, ctx) : []),
		...readAccessorsSection(accessors, level, ctx),
	]);
	if ("reason" in result) return new Set(); // something went wrong while reading one of the sections - do nothing

	// after merging, the table might not be in alphabetical order
	const rows = result.value.sort((a, b) => a.name.localeCompare(b.name));

	// remove all of the old property and accessor nodes
	for (const node of [...(properties?.body ?? []), ...accessors.body])
		ctx.removeNode(node);

	const renderedRows = renderRows(rows);
	if (properties) {
		// if a "Properties" section existed, we render the rows after its heading and remove the heading of the "Accessors" section
		ctx.insertAfter(properties.heading, renderedRows);
		ctx.removeNode(accessors.heading);
	} else {
		// ... if it does not exist, we replace the "Accessors" section and rename it to "Properties"
		ctx.replaceNode(accessors.heading, [
			el(`h${level}`, undefined, [text("Properties")]),
			renderedRows,
		]);
	}

	// return which sections we touched
	return new Set(properties ? [properties, accessors] : [accessors]);
}
