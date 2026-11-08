import * as monaco from "monaco-editor";
import { language as javascript } from "monaco-editor/languages/definitions/javascript/javascript";

import { codeColors } from "../../../brand/code-theme.mjs";

export const THEME_NAME = "party";

// Monaco only takes plain hex colors, not CSS variables, so these mirror the tokens in styles/theme.css.
const gray = {
	400: "#A3A3AD",
	500: "#6B6B73",
	700: "#34343A",
	800: "#26262B",
};
const coral = "#FF5A5F";
const violet = "#7B61FF";
const danger = "#FF7A7E";
const caution = "#FFB400";
const transparent = "#00000000";

/**
 * Monaco's JavaScript tokenizer has fewer categories than the TextMate grammar behind the code blocks, so it's
 * extended to tell apart function calls and constants, which the code block theme colors differently from plain
 * identifiers and keywords.
 */
const partyJsLang: monaco.languages.IMonarchLanguage = {
	...javascript,
	constants: ["true", "false", "null", "undefined"],
	languageVariables: ["this", "super"],
	tokenizer: {
		...javascript.tokenizer,
		common: [
			[
				/#?[a-z_$][\w$]*(?=\s*\()/,
				{ cases: { "@keywords": "keyword", "@default": "function" } },
			],
			[
				/#?[a-z_$][\w$]*/,
				{
					cases: {
						"@constants": "constant.language",
						"@languageVariables": "variable.language",
						"@keywords": "keyword",
						"@default": "identifier",
					},
				},
			],
			// The original identifier rule, replaced by the two above.
			...javascript.tokenizer.common.slice(1),
		],
	},
};

/** Token rules take hex colors without the leading `#`. */
const token = (name: string, color: string): monaco.editor.ITokenThemeRule => ({
	token: name,
	foreground: color.slice(1),
});

monaco.languages.setMonarchTokensProvider("javascript", partyJsLang);

monaco.editor.defineTheme(THEME_NAME, {
	base: "vs-dark",
	inherit: true,
	rules: [
		token("", codeColors.fg),
		token("identifier", codeColors.fg),
		token("delimiter", codeColors.fg),
		token("variable.language", codeColors.fg),
		token("comment", codeColors.comment),
		token("keyword", codeColors.keyword),
		token("function", codeColors.fn),
		token("string", codeColors.string),
		token("string.escape", codeColors.string),
		token("regexp", codeColors.string),
		token("number", codeColors.value),
		token("number.hex", codeColors.value),
		token("constant", codeColors.value),
		token("type", codeColors.value),
	],
	colors: {
		"editor.background": transparent,
		"editor.foreground": codeColors.fg,
		"editorCursor.foreground": coral,
		"editor.selectionBackground": `${violet}55`,
		"editor.inactiveSelectionBackground": `${violet}30`,
		"editor.selectionHighlightBackground": `${violet}26`,
		"editor.wordHighlightBackground": `${violet}26`,
		"editor.wordHighlightStrongBackground": `${violet}33`,
		"editor.findMatchBackground": `${caution}55`,
		"editor.findMatchHighlightBackground": `${caution}26`,
		"editor.lineHighlightBackground": "#FFFFFF08",
		"editor.lineHighlightBorder": transparent,
		"editorLineNumber.foreground": gray[500],
		"editorLineNumber.activeForeground": gray[400],
		"editorIndentGuide.background1": gray[800],
		"editorIndentGuide.activeBackground1": gray[700],
		"editorWhitespace.foreground": gray[700],
		// neutralize bracket pair colors
		...Object.fromEntries(
			[1, 2, 3, 4, 5, 6].map((i) => [
				`editorBracketHighlight.foreground${i}`,
				codeColors.fg,
			]),
		),
		"editorBracketHighlight.unexpectedBracket.foreground": danger,
		"editorBracketMatch.background": `${violet}30`,
		"editorBracketMatch.border": transparent,
		"editorGutter.background": transparent,
		"editorError.foreground": danger,
		"editorWarning.foreground": caution,

		"scrollbar.shadow": transparent,
		"scrollbarSlider.background": "#FFFFFF1A",
		"scrollbarSlider.hoverBackground": "#FFFFFF26",
		"scrollbarSlider.activeBackground": "#FFFFFF33",
		"editorOverviewRuler.border": transparent,

		"editorWidget.background": gray[800],
		"editorWidget.foreground": codeColors.fg,
		"editorWidget.border": gray[700],
		"editorSuggestWidget.background": gray[800],
		"editorSuggestWidget.border": gray[700],
		"editorSuggestWidget.foreground": codeColors.fg,
		"editorSuggestWidget.selectedBackground": gray[700],
		"editorSuggestWidget.highlightForeground": codeColors.fn,
		"editorSuggestWidget.focusHighlightForeground": codeColors.fn,
		"editorHoverWidget.background": gray[800],
		"editorHoverWidget.border": gray[700],
		"list.hoverBackground": gray[700],
		"list.activeSelectionBackground": gray[700],
		"list.activeSelectionForeground": codeColors.fg,
		"list.inactiveSelectionBackground": gray[700],
		"list.highlightForeground": codeColors.fn,
		"list.focusOutline": transparent,

		"menu.background": gray[800],
		"menu.foreground": codeColors.fg,
		"menu.border": gray[700],
		"menu.selectionBackground": gray[700],
		"menu.selectionForeground": codeColors.fg,
		"menu.separatorBackground": gray[700],

		"quickInput.background": gray[800],
		"quickInput.foreground": codeColors.fg,
		"quickInputList.focusBackground": gray[700],
		"quickInputList.focusForeground": codeColors.fg,
		"input.background": "#111113",
		"input.foreground": codeColors.fg,
		"input.border": gray[700],
		"pickerGroup.foreground": codeColors.keyword,
		"pickerGroup.border": gray[700],
		"keybindingLabel.foreground": gray[400],
		"widget.border": gray[700],
		focusBorder: transparent,
	},
});

function codeFontSize(): number {
	const size = getComputedStyle(document.documentElement).getPropertyValue(
		"--pj-code-size",
	);
	return Number.parseFloat(size) || 13;
}

export function editorOptions(): monaco.editor.IStandaloneEditorConstructionOptions {
	return {
		theme: THEME_NAME,
		fontFamily: '"Geist Mono Variable", monospace',
		fontSize: codeFontSize(),
		lineHeight: 1.75,
		tabSize: 4,
		padding: { top: 10, bottom: 10 },
		minimap: { enabled: false },
		scrollBeyondLastLine: false,
		renderLineHighlightOnlyWhenFocus: true,
		overviewRulerLanes: 0,
		hideCursorInOverviewRuler: true,
		scrollbar: {
			useShadows: false,
			verticalScrollbarSize: 10,
			horizontalScrollbarSize: 10,
		},
		fixedOverflowWidgets: true,
		automaticLayout: true,
	};
}

export function syncCodeFont(
	editor: monaco.editor.IStandaloneCodeEditor,
): () => void {
	document.fonts
		.load(`${codeFontSize()}px "Geist Mono Variable"`)
		.then(() => monaco.editor.remeasureFonts());

	const media = window.matchMedia("(min-width: 800px)");
	const update = () => editor.updateOptions({ fontSize: codeFontSize() });
	media.addEventListener("change", update);
	return () => media.removeEventListener("change", update);
}
