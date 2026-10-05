import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

import { site } from "./config/site";

export const onRequest = defineRouteMiddleware(({ locals, site: siteUrl }) => {
	const route = locals.starlightRoute;

	if (route.id !== "404") {
		const image = new URL(`/og/${route.id || "index"}.png`, siteUrl);
		route.head.push(
			{
				tag: "meta",
				attrs: { property: "og:image", content: image.href },
			},
			{
				tag: "meta",
				attrs: { property: "og:image:width", content: "1200" },
			},
			{
				tag: "meta",
				attrs: { property: "og:image:height", content: "630" },
			},
			{
				tag: "meta",
				attrs: {
					property: "og:image:alt",
					content: `${route.entry.data.title} — ${site.name}`,
				},
			},
		);
	}

	if (route.id === "") {
		route.hasSidebar = true;

		const title = route.head.find((tag) => tag.tag === "title");
		if (title) title.content = `${site.name} — ${site.tagline}`;
	}
});
