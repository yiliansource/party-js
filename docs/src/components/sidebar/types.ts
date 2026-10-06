import type { StarlightRouteData } from "@astrojs/starlight/route-data";

export type SidebarEntry = StarlightRouteData["sidebar"][number];
export type SidebarGroup = Extract<SidebarEntry, { type: "group" }>;
export type SidebarLink = Extract<SidebarEntry, { type: "link" }>;

export const hasCurrent = (entry: SidebarEntry): boolean =>
	entry.type === "link" ? entry.isCurrent : entry.entries.some(hasCurrent);
