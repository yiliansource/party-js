import { defineHastPlugin } from "satteri";

import { accessors } from "./sections/accessors";
import { members } from "./sections/members";
import { parameters } from "./sections/parameters";
import { properties } from "./sections/properties";
import { returns } from "./sections/returns";
import { createWalker, type SectionHandler } from "./walk";

const handlers: Record<string, SectionHandler> = {
	Parameters: parameters,
	"Type Parameters": parameters,
	Properties: properties,
	Accessors: accessors,
	Returns: returns,
	Methods: members,
};

const plugin = defineHastPlugin({
	name: "party-reference",
	before(root, ctx) {
		createWalker(handlers, ctx)(root.children, 2);
	},
	element: { filter: ["hr"], visit: (node, ctx) => ctx.removeNode(node) },
});

export const reference = ({ fileURL }: { fileURL?: URL }) =>
	fileURL?.pathname.includes("/content/docs/api/") ? plugin : undefined;
