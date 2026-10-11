import { defineHastPlugin } from "satteri";

import { accessors } from "./sections/accessors";
import { constructors } from "./sections/constructors";
import { flushHeader, header } from "./sections/header";
import { members } from "./sections/members";
import { note } from "./sections/notes";
import { parameters } from "./sections/parameters";
import { properties } from "./sections/properties";
import { returns } from "./sections/returns";
import { throws } from "./sections/throws";
import { createWalker, type PageState, type SectionHandler } from "./walk";

const handlers: Record<string, SectionHandler> = {
	Parameters: parameters,
	"Type Parameters": parameters,
	Constructors: constructors,
	Properties: properties,
	Accessors: accessors,
	Returns: returns,
	Throws: throws,
	Methods: members,
	Extends: header("extends"),
	Implements: header("implements"),
	"Extended by": header("extended by"),
	Overrides: note("overrides"),
	See: (section, hc) =>
		(hc.level === 2 ? header("see") : note("see"))(section, hc),
	"Inherited from": note("inherited from"),
	"Implementation of": note("implements"),
};

const plugin = defineHastPlugin({
	name: "party-reference",
	before(root, ctx) {
		const page: PageState = { header: new Map() };
		createWalker(handlers, ctx, page)(root.children, 2);
		flushHeader(page, root, ctx);
	},
	element: {
		filter: ["hr"],
		visit: (node, ctx) => ctx.removeNode(node),
	},
});

export const reference = ({ fileURL }: { fileURL?: URL }) =>
	fileURL?.pathname.includes("/content/docs/api/") ? plugin : undefined;
