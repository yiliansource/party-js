import { splitByHeading } from "../tree";
import type { SectionHandler } from "../walk";

export const members: SectionHandler = (section, { level, ctx, walk }) => {
	for (const member of splitByHeading(section.body, level + 1).sections) {
		ctx.setProperty(member.heading, "className", ["ref-member-name"]);
		walk(member.body, level + 2);
	}
};
