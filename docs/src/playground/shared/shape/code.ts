import { fn, keyword, plain, string, type Token, value } from "../tokens";
import { SHAPE_DEFAULTS, type ShapeDraft } from "./draft";

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
				...numeric(
					"innerRadius",
					draft.star.innerRadius,
					SHAPE_DEFAULTS.star.innerRadius,
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
		case "text":
			return [
				type,
				["text", [string(draft.text.text)]],
				...(draft.text.font === ""
					? []
					: ([["font", [string(draft.text.font)]]] as Entry[])),
			];
		case "image":
			return [type, ["image", [string(draft.image.image.trim())]]];
	}
}

export function shapeLiteral(draft: ShapeDraft): Token[] {
	return [
		plain("{ "),
		...shapeEntries(draft).flatMap(([key, tokens], i) => [
			plain(`${i ? ", " : ""}${key}: `),
			...tokens,
		]),
		plain(" }"),
	];
}
