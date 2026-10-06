import type { Element, ElementContent } from "hast";
import type { HastVisitorContext } from "satteri";

import { ensure, expect, type RowWithName, replaceSection } from "../rows";
import { el, isElement, jsonClone, type Section } from "../tree";
import type { SectionHandler } from "../walk";

const COLUMN = {
	name: "Property",
	modifier: "Modifier",
	type: "Type",
	default: "Default value",
	description: "Description",
} as const;

const HIDDEN_MODIFIERS = new Set(["public"]);

const childElements = (node: Element, tagName: string) =>
	node.children.filter((child): child is Element =>
		isElement(child, tagName),
	);

export function readPropertyTable(
	table: Element,
	ctx: HastVisitorContext,
): RowWithName[] {
	const thead = childElements(table, "thead")[0];
	const headerRow = expect(
		thead && childElements(thead, "tr")[0],
		"table contains no header row",
	);
	const tbody = expect(
		childElements(table, "tbody")[0],
		"table contains no body",
	);

	const headers = childElements(headerRow, "th").map((th) =>
		ctx.textContent(th).trim(),
	);

	ensure(headers.includes(COLUMN.name), "table contains no name column");
	ensure(headers.includes(COLUMN.type), "table contains no type column");

	const rows = childElements(tbody, "tr").map((tr) => {
		const cells = childElements(tr, "td");
		const cell = (header: string) => {
			const index = headers.indexOf(header);
			return index === -1 ? undefined : cells[index];
		};
		return readProperty(cell, ctx);
	});

	ensure(rows.length > 0, "table rows were malformed");

	return rows as RowWithName[];
}

function readProperty(
	cell: (header: string) => Element | undefined,
	ctx: HastVisitorContext,
): RowWithName {
	const nameCell = expect(cell(COLUMN.name), "name cell was empty");
	const typeCell = expect(cell(COLUMN.type), "type cell was empty");

	const nameCode = expect(
		nameCell.children.find((child) => isElement(child, "code")),
		"name code was empty",
	);
	const rawName = ctx.textContent(nameCode).trim();
	const optional = rawName.endsWith("?");
	const anchor = nameCell.children.find(
		(child) => child.type === "raw" && child.value.includes(' id="'),
	);
	const id =
		anchor?.type === "raw"
			? /id="([^"]+)"/.exec(anchor.value)?.[1]
			: undefined;

	const modifierCell = cell(COLUMN.modifier);
	const modifiers = modifierCell
		? ctx
				.textContent(modifierCell)
				.split(/\s+/)
				.filter((m) => m !== "" && !HIDDEN_MODIFIERS.has(m))
		: [];

	const defaultCell = cell(COLUMN.default);
	const defaultText = defaultCell ? ctx.textContent(defaultCell).trim() : "";
	const descriptionCell = cell(COLUMN.description);
	const descriptionText = descriptionCell
		? ctx.textContent(descriptionCell).trim()
		: "";

	return {
		id,
		name: optional ? rawName.slice(0, -1) : rawName,
		optional,
		modifiers,
		type: jsonClone(typeCell.children) as ElementContent[],
		default:
			defaultCell && !["", "-", "undefined"].includes(defaultText)
				? (jsonClone(defaultCell.children) as ElementContent[])
				: undefined,
		description:
			descriptionCell && !["", "-"].includes(descriptionText)
				? [
						el(
							"p",
							undefined,
							jsonClone(
								descriptionCell.children,
							) as ElementContent[],
						),
					]
				: [],
	};
}

export function readPropertiesSection(
	section: Section,
	ctx: HastVisitorContext,
): RowWithName[] {
	const [table, ...rest] = section.body;

	ensure(
		rest.length === 0 && isElement(table, "table"),
		"properties sections was not emitted as a table",
	);

	return readPropertyTable(table as Element, ctx);
}

export const properties: SectionHandler = (section, { ctx }) => {
	replaceSection(section, () => readPropertiesSection(section, ctx), ctx);
};
