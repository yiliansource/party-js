import { fn, keyword, plain, string, type Token } from "../shared/tokens";
import { fieldCode, fieldOption, isDefault } from "./fields";
import type { EffectDefinition, EffectDraft } from "./schema";

/**
 * A fresh draft holding every field's default. Values are copied, so editing the draft never changes a definition.
 */
export function createEffectDraft<O>(
	definition: EffectDefinition<O>,
): EffectDraft {
	return Object.fromEntries(
		definition.fields.map((field) => [
			field.key,
			structuredClone(field.default),
		]),
	);
}

/**
 * The options to fire the effect with. Every field is included, so the playground shows exactly what it lists.
 */
export function effectOptions<O>(
	definition: EffectDefinition<O>,
	draft: EffectDraft,
): O {
	return Object.fromEntries(
		definition.fields.map((field) => [
			field.key,
			fieldOption(field, draft[field.key]),
		]),
	) as O;
}

export function changedFields<O>(
	definition: EffectDefinition<O>,
	draft: EffectDraft,
) {
	return definition.fields.filter(
		(field) => !isDefault(field, draft[field.key]),
	);
}

export function hasChanges<O>(
	definition: EffectDefinition<O>,
	draft: EffectDraft,
): boolean {
	return changedFields(definition, draft).length > 0;
}

/**
 * The code to copy: an import of everything used, and a call with only the options that differ from the defaults.
 */
export function effectCode<O>(
	definition: EffectDefinition<O>,
	draft: EffectDraft,
): Token[] {
	const changed = changedFields(definition, draft).map((field) => ({
		field,
		code: fieldCode(field, draft[field.key]),
	}));

	const imports = [
		definition.call,
		...new Set(changed.flatMap((c) => c.code.imports)),
	];
	const importLine: Token[] = [
		keyword("import"),
		plain(` { ${imports.join(", ")} } `),
		keyword("from"),
		plain(" "),
		string("party-js"),
		plain(";"),
	];

	return changed.length === 0
		? [
				...importLine,
				plain("\n\n"),
				fn(definition.call),
				plain("(element);"),
			]
		: [
				...importLine,
				plain("\n\n"),
				fn(definition.call),
				plain("(element, {\n"),
				...changed.flatMap(({ field, code }) => [
					plain(`\t${field.key}: `),
					...code.tokens,
					plain(",\n"),
				]),
				plain("});"),
			];
}
