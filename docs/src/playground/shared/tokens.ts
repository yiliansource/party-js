import type { codeColors } from "../../brand/code-theme.mjs";

export type TokenKind = keyof typeof codeColors;
export interface Token {
	kind: TokenKind;
	text: string;
}

const token =
	(kind: TokenKind) =>
	(text: string | number): Token => ({ kind, text: String(text) });

export const plain = token("fg");
export const keyword = token("keyword");
export const value = token("value");
export const fn = token("fn");
export const comment = token("comment");
export const string = (s: string) => token("string")(JSON.stringify(s));

export const toText = (tokens: Token[]) => tokens.map((t) => t.text).join("");
