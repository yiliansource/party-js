import { defineHastPlugin } from "satteri";

import { accessors } from "./sections/accessors";
import { constructors } from "./sections/constructors";
import { flushHeritage, heritage } from "./sections/heritage";
import { members } from "./sections/members";
import { note } from "./sections/notes";
import { parameters } from "./sections/parameters";
import { properties } from "./sections/properties";
import { returns } from "./sections/returns";
import { createWalker, type PageState, type SectionHandler } from "./walk";

const handlers: Record<string, SectionHandler> = {
	Parameters: parameters,
	"Type Parameters": parameters,
	Constructors: constructors,
	Properties: properties,
	Accessors: accessors,
	Returns: returns,
	Methods: members,
	Extends: heritage("extends"),
	Implements: heritage("implements"),
	"Extended by": heritage("extended by"),
	Overrides: note("overrides"),
	"Inherited from": note("inherited from"),
	"Implementation of": note("implements"),
};

const plugin = defineHastPlugin({
	name: "party-reference",
	before(root, ctx) {
		const page: PageState = { heritage: new Map() };
		createWalker(handlers, ctx, page)(root.children, 2);
		flushHeritage(page, root, ctx);
	},
	element: {
		filter: ["hr"],
		visit: (node, ctx) => ctx.removeNode(node),
	},
});

export const reference = ({ fileURL }: { fileURL?: URL }) =>
	fileURL?.pathname.includes("/content/docs/api/") ? plugin : undefined;
