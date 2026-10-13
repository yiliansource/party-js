export const codeColors = {
	fg: "#E8E8EC",
	comment: "#8A8A94",
	keyword: "#B6A6FF",
	fn: "#FF8A8E",
	string: "#FFC94D",
	value: "#6FD8C9",
};

export const codeTheme = {
	name: "party",
	type: "dark",
	colors: {
		"editor.background": "#111113",
		"editor.foreground": codeColors.fg,
	},
	tokenColors: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: codeColors.comment },
		},
		{
			scope: [
				"keyword",
				"storage",
				"keyword.operator.new",
				"keyword.operator.expression",
			],
			settings: { foreground: codeColors.keyword },
		},
		{
			scope: [
				"keyword.operator",
				"storage.type.function.arrow",
				"keyword.operator.ternary",
			],
			settings: { foreground: codeColors.fg },
		},
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: codeColors.fn },
		},
		{
			scope: ["string", "punctuation.definition.string"],
			settings: { foreground: codeColors.string },
		},
		{
			scope: [
				"constant.numeric",
				"constant.language",
				"entity.name.type",
				"support.type",
				"entity.other.inherited-class",
			],
			settings: { foreground: codeColors.value },
		},
	],
};
