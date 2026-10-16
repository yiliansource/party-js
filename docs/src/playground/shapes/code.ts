import { shapeLiteral } from "../shared/shape/code";
import type { ShapeDraft } from "../shared/shape/draft";
import { keyword, plain, type Token } from "../shared/tokens";

export function shapeCode(draft: ShapeDraft): Token[] {
	return [
		keyword("const"),
		plain(" shape = "),
		...shapeLiteral(draft),
		plain(";"),
	];
}
