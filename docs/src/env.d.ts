declare namespace App {
	interface Locals {
		isNotFound?: boolean;
		playground?: import("./config/playgrounds").PlaygroundKey;
	}
}

declare module "virtual:party-js-types" {
	const declarations: string;
	export default declarations;
}

declare module "virtual:party-js-bundle" {
	const source: string;
	export default source;
}

declare module "monaco-editor/languages/definitions/javascript/javascript" {
	import type { languages } from "monaco-editor";

	export const language: languages.IMonarchLanguage & {
		tokenizer: Record<string, languages.IMonarchLanguageRule[]>;
	};
	export const conf: languages.LanguageConfiguration;
}
