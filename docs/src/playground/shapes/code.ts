import { fn, keyword, plain, string, type Token, value } from "../code";
import { SHAPE_DEFAULTS, type ShapeDraft } from "./state";

type Entry = [key: string, tokens: Token[]];

const numeric = (key: string, n: number, fallback?: number): Entry[] =>
	n === fallback ? [] : [[key, [value(Number(n.toFixed(2)))]]];

function shapeEntries(draft: ShapeDraft): Entry[] {
	const type: Entry = ["type", [string(draft.type)]];

	switch (draft.type) {
		case "square":
			return [
				type,
				...numeric(
					"aspectRatio",
					draft.square.aspectRatio,
					SHAPE_DEFAULTS.square.aspectRatio,
				),
				...numeric(
					"cornerRadius",
					draft.square.cornerRadius,
					SHAPE_DEFAULTS.square.cornerRadius,
				),
			];
		case "circle":
			return [type];
		case "star":
			return [
				type,
				...numeric(
					"points",
					draft.star.points,
					SHAPE_DEFAULTS.star.points,
				),
			];
		case "polygon":
			return [type, ...numeric("sides", draft.polygon.sides)];
		case "path":
			return [
				type,
				[
					"path",
					[
						keyword("new"),
						plain(" "),
						fn("Path2D"),
						plain("("),
						string(draft.path.d.trim()),
						plain(")"),
					],
				],
			];
	}
}

export function shapeCode(draft: ShapeDraft): Token[] {
	return [
		keyword("const"),
		plain(" shape = { "),
		...shapeEntries(draft).flatMap(([key, tokens], i) => [
			plain(`${i ? ", " : ""}${key}: `),
			...tokens,
		]),
		plain(" };"),
	];
}
