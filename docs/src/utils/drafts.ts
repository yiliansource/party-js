import type { CollectionEntry } from "astro:content";

export const isPublished = ({ data }: CollectionEntry<"docs">): boolean =>
	import.meta.env.MODE !== "production" || !data.draft;
