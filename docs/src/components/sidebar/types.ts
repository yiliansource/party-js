import type { StarlightRouteData } from "@astrojs/starlight/route-data";

export type SidebarEntry = StarlightRouteData["sidebar"][number];
export type SidebarGroup = Extract<SidebarEntry, { type: "group" }>;
export type SidebarLink = Extract<SidebarEntry, { type: "link" }>;

export const hasCurrent = (entry: SidebarEntry): boolean =>
	entry.type === "link" ? entry.isCurrent : entry.entries.some(hasCurrent);

/** The number of pages in a group, including nested groups. */
export const countLinks = (entry: SidebarEntry): number =>
	entry.type === "link"
		? 1
		: entry.entries.reduce((sum, child) => sum + countLinks(child), 0);

/** Reference pages for functions are titled `name()`. */
export const isFunctionEntry = (entry: SidebarEntry): boolean =>
	entry.type === "link" && entry.label.endsWith("()");
