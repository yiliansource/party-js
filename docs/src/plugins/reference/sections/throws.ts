import { ensure, expect } from "../read";
import { type Row, renderRows } from "../rows";
import { replaceBody, type Section } from "../section";
import { el, isElement, text } from "../tree";
import type { SectionHandler } from "../walk";

function readThrows({ body }: Section): Row[] {
	return body.map((node) => {
		const p = expect(
			isElement(node, "p") && node,
			"throws entry is not a paragraph",
		);
		const [type, ...rest] = p.children;
		ensure(
			isElement(type, "a") || isElement(type, "code"),
			"throws entry doesn't start with a type",
		);

		const first = rest[0];
		if (first?.type === "text") rest[0] = text(first.value.trimStart());

		return { type: [type], description: [el("p", undefined, rest)] };
	});
}

export const throws: SectionHandler = (section, { ctx }) => {
	replaceBody(section, () => renderRows(readThrows(section)), ctx);
};
