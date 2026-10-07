import { defineHastPlugin } from "satteri";

import { accessors } from "./sections/accessors";
import { constructors } from "./sections/constructors";
import { type HeritageKind, heritage } from "./sections/heritage";
import { members } from "./sections/members";
import { note } from "./sections/notes";
import { parameters } from "./sections/parameters";
import { properties } from "./sections/properties";
import { returns } from "./sections/returns";
import { el } from "./tree";
import { createWalker, type PageState, type SectionHandler } from "./walk";

const handlers: Record<string, SectionHandler> = {
	Parameters: parameters,
	"Type Parameters": parameters,
	Constructors: constructors,
	Properties: properties,
	Accessors: accessors,
	Returns: returns,
	Methods: members,
	Extends: heritage,
	Implements: heritage,
	"Extended by": heritage,
	Overrides: note,
	"Inherited from": note,
	"Implementation of": note,
};

const plugin = defineHastPlugin({
	name: "party-reference",
	before(root, ctx) {
		const page: PageState = { heritage: new Map() };
		createWalker(handlers, ctx, page)(root.children, 2);

		const order: HeritageKind[] = ["extends", "implements", "extended by"];
		const lines = order.flatMap((kind) => page.heritage.get(kind) ?? []);
		if (lines.length > 0)
			ctx.prependChild(root, el("div", "ref-heritage", lines));
	},
	element: {
		filter: ["hr"],
		visit: (node, ctx) => ctx.removeNode(node),
	},
});

export const reference = ({ fileURL }: { fileURL?: URL }) =>
	fileURL?.pathname.includes("/content/docs/api/") ? plugin : undefined;
