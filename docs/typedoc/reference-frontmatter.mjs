import { ReflectionKind } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";
import { parse, stringify } from "yaml";

const UNTAGGED_FOLDERS = [
	"Functions/",
	"Interfaces/",
	"Type_Aliases",
	"Variables/",
];

/** @param {import('typedoc').Application} app */
export function load(app) {
	app.renderer.on(
		MarkdownPageEvent.END,
		(page) => {
			const model = page.model;
			const match = page.contents?.match(/^---\n([\s\S]*?)\n---\n/);
			if (!match || !("kindOf" in model)) return;

			if (UNTAGGED_FOLDERS.some((f) => page.url.startsWith(f))) {
				app.logger.warn(`${model.name}: missing @group tag`);
			}

			const extraFrontmatter = model.kindOf(ReflectionKind.Project)
				? { draft: true }
				: referenceFrontmatter(model, app);

			const frontmatter = {
				...parse(match[1]),
				...extraFrontmatter,
			};
			const body = page.contents
				.slice(match[0].length)
				.replace(/^Defined in: .*\n\n?/gm, "");
			page.contents = `---\n${stringify(frontmatter)}---\n${body}`;
		},
		-100,
	);
}

/**
 * @param {import('typedoc').DeclarationReflection} model
 * @param {import('typedoc').Application} app
 */
function referenceFrontmatter(model, app) {
	const isFunction = model.kindOf(ReflectionKind.Function);
	const comment = model.comment ?? model.signatures?.[0]?.comment;
	const summary = comment?.getTag("@summary");
	const source = model.sources?.[0];

	if (summary?.content.some((part) => part.kind !== "text")) {
		app.logger.warn(`${model.name}: @summary should be plain text`);
	}
	if (!summary && isFunction) {
		app.logger.warn(`${model.name}: missing @summary on function`);
	}

	return {
		...(isFunction && { title: `${model.name}()` }),
		...(summary && {
			description: summary.content
				.map((p) => p.text)
				.join("")
				.trim(),
		}),
		sidebar: { order: isFunction ? 1 : 2 },
		reference: {
			name: model.name,
			kind: ReflectionKind[model.kind],
			source: source && {
				file: source.fileName,
				line: source.line,
				url: source.url,
			},
		},
	};
}
