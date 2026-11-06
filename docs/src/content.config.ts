import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";
import { z } from "astro/zod";
import { changelogsLoader } from "starlight-changelogs/loader";

import { defineCollection } from "astro:content";

const referenceSchema = z
	.object({
		name: z.string(),
		kind: z.enum([
			"Function",
			"Class",
			"Interface",
			"TypeAlias",
			"Variable",
			"Enum",
			"Namespace",
		]),
		source: z
			.object({
				file: z.string(),
				line: z.int(),
				url: z.url().optional(),
			})
			.optional(),
	})
	.optional();

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				api: z.array(z.string()).optional(),
				playground: z.array(z.string()).optional(),
				reference: referenceSchema,
			}),
		}),
	}),

	i18n: defineCollection({
		loader: i18nLoader(),
		schema: i18nSchema(),
	}),

	changelogs: defineCollection({
		loader: changelogsLoader([
			{
				provider: "conventional-changelog",
				base: "changelog",
				changelog: "../CHANGELOG.md",
			},
		]),
	}),
};
