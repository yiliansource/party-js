import { describe, expect, test } from "bun:test";

import type { Color } from "@/color/color";
import { toPolar } from "@/color/oklch";
import { parse } from "@/color/parse";

// reference values were computed independently with culori (oklab)

const RED: Color = {
	l: 0.6279553639214311,
	a: 0.22486306842627443,
	b: 0.12584627733058495,
	alpha: 1,
};
const LIME: Color = {
	l: 0.8664396175234368,
	a: -0.2338875809365577,
	b: 0.1794984451609376,
	alpha: 1,
};
const BLUE: Color = {
	l: 0.45201371817442365,
	a: -0.032456975170797764,
	b: -0.31152816567757763,
	alpha: 1,
};
const CYAN: Color = {
	l: 0.9053992360133608,
	a: -0.1494439435082286,
	b: -0.039398192151822164,
	alpha: 1,
};

const WHITE: Color = { l: 1, a: 0, b: 0, alpha: 1 };
const BLACK: Color = { l: 0, a: 0, b: 0, alpha: 1 };

// #808080, i.e. 128/255 per channel
const GRAY_128: Color = { l: 0.5998708056221468, a: 0, b: 0, alpha: 1 };
// rgb(50% 50% 50%), i.e. exactly 0.5 per channel
const GRAY_HALF: Color = { l: 0.5981807305268477, a: 0, b: 0, alpha: 1 };

const STEEL: Color = {
	// #336699
	l: 0.49931445584520834,
	a: -0.03304348760594705,
	b: -0.09296659206477714,
	alpha: 1,
};

const ORANGE: Color = {
	// #ff8800
	l: 0.7442024724636972,
	a: 0.10010437810129963,
	b: 0.15100320669179945,
	alpha: 1,
};

function expectParsesTo(input: string, expected: Color, digits = 6) {
	expect(parse(input)).toEqual({
		l: expect.closeTo(expected.l, digits),
		a: expect.closeTo(expected.a, digits),
		b: expect.closeTo(expected.b, digits),
		alpha: expect.closeTo(expected.alpha, digits),
	});
}

describe("parse (hex)", () => {
	test("parses 6-digit hex", () => {
		expectParsesTo("#ff0000", RED);
		expectParsesTo("#0000ff", BLUE);
		expectParsesTo("#336699", STEEL);
		expectParsesTo("#ff8800", ORANGE);
	});

	test("parses black, white and gray", () => {
		expectParsesTo("#ffffff", WHITE);
		expectParsesTo("#000000", BLACK);
		expectParsesTo("#808080", GRAY_128);
	});

	test("parses 3-digit shorthand by doubling each digit", () => {
		expectParsesTo("#f00", RED);
		expectParsesTo("#369", STEEL);
		expectParsesTo("#f80", ORANGE);
	});

	test("parses 8-digit hex with alpha", () => {
		expectParsesTo("#ff0000ff", RED);
		expectParsesTo("#ff000080", { ...RED, alpha: 128 / 255 });
		expectParsesTo("#ff000000", { ...RED, alpha: 0 });
	});

	test("parses 4-digit shorthand with alpha", () => {
		expectParsesTo("#f008", { ...RED, alpha: 0x88 / 255 });
		expectParsesTo("#369f", STEEL);
	});

	test("is case-insensitive", () => {
		expectParsesTo("#FF0000", RED);
		expectParsesTo("#Ff8800", ORANGE);
		expectParsesTo("#F00", RED);
	});

	test.each([
		"#",
		"#f",
		"#ff",
		"#ff000",
		"#ff00000",
		"#ff0000000",
		"#gg0000",
		"#ff 000",
		"ff0000",
		"##ff0000",
	])("rejects malformed hex %p", (input) => {
		expect(parse(input)).toBeUndefined();
	});
});

describe("parse (rgb)", () => {
	test("parses legacy comma syntax", () => {
		expectParsesTo("rgb(255, 0, 0)", RED);
		expectParsesTo("rgb(51,102,153)", STEEL);
	});

	test("parses modern space syntax", () => {
		expectParsesTo("rgb(255 0 0)", RED);
		expectParsesTo("rgb(255 136 0)", ORANGE);
	});

	test("rgba is an alias of rgb", () => {
		expectParsesTo("rgba(255, 0, 0)", RED);
		expectParsesTo("rgba(255 0 0)", RED);
		expectParsesTo("rgb(255, 0, 0, 0.5)", { ...RED, alpha: 0.5 });
	});

	test("parses alpha in legacy syntax", () => {
		expectParsesTo("rgba(255, 0, 0, 0.5)", { ...RED, alpha: 0.5 });
		expectParsesTo("rgba(255, 0, 0, 50%)", { ...RED, alpha: 0.5 });
		expectParsesTo("rgba(255, 0, 0, .25)", { ...RED, alpha: 0.25 });
	});

	test("parses alpha after a slash in modern syntax", () => {
		expectParsesTo("rgb(255 0 0 / 0.5)", { ...RED, alpha: 0.5 });
		expectParsesTo("rgb(255 0 0 / 25%)", { ...RED, alpha: 0.25 });
		expectParsesTo("rgb(255 0 0/0.5)", { ...RED, alpha: 0.5 });
	});

	test("parses percentage channels, 100% being 255", () => {
		expectParsesTo("rgb(100%, 0%, 0%)", RED);
		expectParsesTo("rgb(50% 50% 50%)", GRAY_HALF);
	});

	test("parses fractional channels", () => {
		expectParsesTo("rgb(127.5 127.5 127.5)", GRAY_HALF);
	});

	test("parses numbers in scientific notation", () => {
		expectParsesTo("rgb(2.55e2 0 0)", RED);
		expectParsesTo("rgb(255 0 0 / 5e-1)", { ...RED, alpha: 0.5 });
	});

	test("clamps channels to [0, 255]", () => {
		expectParsesTo("rgb(300 -10 0)", RED);
		expectParsesTo("rgb(200% 0% 0%)", RED);
	});

	test("clamps alpha to [0, 1]", () => {
		expectParsesTo("rgb(255 0 0 / 1.5)", RED);
		expectParsesTo("rgb(255 0 0 / -0.5)", { ...RED, alpha: 0 });
		expectParsesTo("rgb(255 0 0 / 150%)", RED);
	});

	test("treats 'none' as 0 in modern syntax", () => {
		expectParsesTo("rgb(255 none none)", RED);
		expectParsesTo("rgb(255 0 0 / none)", { ...RED, alpha: 0 });
	});

	test.each([
		"rgb()",
		"rgb(255, 0)",
		"rgb(255 0)",
		"rgb(255, 0, 0, 0, 0)",
		"rgb(255 0 0 0)",
		"rgb(255 0, 0)",
		"rgb(255, 0, 0 / 0.5)",
		"rgb(255 0 0 / 0.5 / 0.5)",
		"rgb(255, none, 0)",
		"rgb(red, 0, 0)",
		"rgb(255 0 0",
		"rgb 255 0 0",
		"rgb(255px 0 0)",
		"rgb(255deg 0 0)",
		"rgbb(255 0 0)",
	])("rejects malformed rgb %p", (input) => {
		expect(parse(input)).toBeUndefined();
	});
});

describe("parse (hsl)", () => {
	test("parses legacy comma syntax", () => {
		expectParsesTo("hsl(0, 100%, 50%)", RED);
		expectParsesTo("hsl(120, 100%, 50%)", LIME);
	});

	test("parses modern space syntax", () => {
		expectParsesTo("hsl(240 100% 50%)", BLUE);
		expectParsesTo("hsl(180 100% 50%)", CYAN);
	});

	test("hsla is an alias of hsl", () => {
		expectParsesTo("hsla(0, 100%, 50%)", RED);
		expectParsesTo("hsla(0 100% 50%)", RED);
	});

	test("parses alpha in both syntaxes", () => {
		expectParsesTo("hsla(0, 100%, 50%, 0.5)", { ...RED, alpha: 0.5 });
		expectParsesTo("hsl(0 100% 50% / 25%)", { ...RED, alpha: 0.25 });
	});

	test("parses an arbitrary non-primary color", () => {
		expectParsesTo("hsl(30 80% 40%)", {
			l: 0.5920179431964495,
			a: 0.07132545799959344,
			b: 0.11423855374899983,
			alpha: 1,
		});
	});

	test("zero saturation produces a neutral gray", () => {
		expectParsesTo("hsl(0 0% 50%)", GRAY_HALF);
		expectParsesTo("hsl(270 0% 100%)", WHITE);
		expectParsesTo("hsl(90 100% 0%)", BLACK);
	});

	test("accepts angle units on the hue", () => {
		expectParsesTo("hsl(180deg 100% 50%)", CYAN);
		expectParsesTo("hsl(0.5turn 100% 50%)", CYAN);
		expectParsesTo("hsl(200grad 100% 50%)", CYAN);
		expectParsesTo(`hsl(${Math.PI}rad 100% 50%)`, CYAN);
	});

	test("wraps the hue around 360 degrees", () => {
		expectParsesTo("hsl(360 100% 50%)", RED);
		expectParsesTo("hsl(-120 100% 50%)", BLUE);
		expectParsesTo("hsl(480 100% 50%)", LIME);
	});

	test("accepts plain numbers for saturation and lightness in modern syntax", () => {
		expectParsesTo("hsl(0 100 50)", RED);
	});

	test("clamps saturation and lightness to [0%, 100%]", () => {
		expectParsesTo("hsl(0 150% 50%)", RED);
		expectParsesTo("hsl(0 100% 150%)", WHITE);
		expectParsesTo("hsl(0 -50% 50%)", GRAY_HALF);
	});

	test("treats 'none' as 0 in modern syntax", () => {
		expectParsesTo("hsl(none 100% 50%)", RED);
		expectParsesTo("hsl(0 none 50%)", GRAY_HALF);
	});

	test.each([
		"hsl()",
		"hsl(0, 100%)",
		"hsl(0 100% 50% 1)",
		"hsl(0 100%, 50%)",
		"hsl(0, 100%, 50% / 0.5)",
		"hsl(0, none, 50%)",
		"hsl(red 100% 50%)",
		"hsl(0px 100% 50%)",
		"hsl(0 100% 50%",
	])("rejects malformed hsl %p", (input) => {
		expect(parse(input)).toBeUndefined();
	});
});

describe("parse (oklab)", () => {
	test("passes components through unchanged", () => {
		expectParsesTo(
			"oklab(0.6279553639214311 0.22486306842627443 0.12584627733058495)",
			RED,
			12,
		);
		expectParsesTo(
			"oklab(0.5 -0.1 0.2)",
			{ l: 0.5, a: -0.1, b: 0.2, alpha: 1 },
			12,
		);
	});

	test("parses alpha after a slash", () => {
		expectParsesTo("oklab(0.5 0.1 -0.1 / 0.5)", {
			l: 0.5,
			a: 0.1,
			b: -0.1,
			alpha: 0.5,
		});
		expectParsesTo("oklab(0.5 0.1 -0.1 / 40%)", {
			l: 0.5,
			a: 0.1,
			b: -0.1,
			alpha: 0.4,
		});
	});

	test("maps percentages: 100% is 1 for L and 0.4 for a and b", () => {
		expectParsesTo("oklab(50% 50% -50%)", {
			l: 0.5,
			a: 0.2,
			b: -0.2,
			alpha: 1,
		});
		expectParsesTo("oklab(100% -100% 100%)", {
			l: 1,
			a: -0.4,
			b: 0.4,
			alpha: 1,
		});
	});

	test("clamps L to [0, 1] but leaves a and b unbounded", () => {
		expectParsesTo("oklab(1.5 0.5 -0.5)", {
			l: 1,
			a: 0.5,
			b: -0.5,
			alpha: 1,
		});
		expectParsesTo("oklab(-0.1 0 0)", BLACK);
	});

	test("treats 'none' as 0", () => {
		expectParsesTo("oklab(none 0.1 none)", {
			l: 0,
			a: 0.1,
			b: 0,
			alpha: 1,
		});
	});

	test.each([
		"oklab()",
		"oklab(0.5 0.1)",
		"oklab(0.5 0.1 0.1 0.1)",
		"oklab(0.5, 0.1, 0.1)",
		"oklab(0.5 0.1 0.1 /)",
		"oklab(0.5deg 0.1 0.1)",
		"oklaba(0.5 0.1 0.1)",
	])("rejects malformed oklab %p", (input) => {
		expect(parse(input)).toBeUndefined();
	});
});

describe("parse (oklch)", () => {
	test("converts polar coordinates to oklab", () => {
		expectParsesTo("oklch(0.7 0.1 0)", { l: 0.7, a: 0.1, b: 0, alpha: 1 });
		expectParsesTo("oklch(0.7 0.1 90)", { l: 0.7, a: 0, b: 0.1, alpha: 1 });
		expectParsesTo("oklch(0.7 0.1 180)", {
			l: 0.7,
			a: -0.1,
			b: 0,
			alpha: 1,
		});
		expectParsesTo("oklch(0.6 0.15 210)", {
			l: 0.6,
			a: -0.12990381056766578,
			b: -0.07500000000000001,
			alpha: 1,
		});
	});

	test("round-trips through toPolar", () => {
		const parsed = parse("oklch(0.6 0.15 210)");
		expect(parsed).toBeDefined();
		expect(toPolar(parsed as Color)).toEqual({
			l: expect.closeTo(0.6, 9),
			c: expect.closeTo(0.15, 9),
			h: expect.closeTo(210, 9),
		});
	});

	test("accepts angle units on the hue", () => {
		const expected = { l: 0.7, a: 0, b: 0.1, alpha: 1 };
		expectParsesTo("oklch(0.7 0.1 90deg)", expected);
		expectParsesTo("oklch(0.7 0.1 0.25turn)", expected);
		expectParsesTo("oklch(0.7 0.1 100grad)", expected);
		expectParsesTo(`oklch(0.7 0.1 ${Math.PI / 2}rad)`, expected);
	});

	test("parses alpha after a slash", () => {
		expectParsesTo("oklch(0.7 0.1 0 / 0.5)", {
			l: 0.7,
			a: 0.1,
			b: 0,
			alpha: 0.5,
		});
		expectParsesTo("oklch(0.7 0.1 0 / 50%)", {
			l: 0.7,
			a: 0.1,
			b: 0,
			alpha: 0.5,
		});
	});

	test("maps percentages: 100% is 1 for L and 0.4 for C", () => {
		expectParsesTo("oklch(50% 50% 90)", { l: 0.5, a: 0, b: 0.2, alpha: 1 });
	});

	test("clamps L to [0, 1] and C to non-negative values", () => {
		expectParsesTo("oklch(1.5 0.1 0)", { l: 1, a: 0.1, b: 0, alpha: 1 });
		expectParsesTo("oklch(0.5 -0.1 90)", { l: 0.5, a: 0, b: 0, alpha: 1 });
	});

	test("treats 'none' as 0", () => {
		expectParsesTo("oklch(0.7 0.1 none)", {
			l: 0.7,
			a: 0.1,
			b: 0,
			alpha: 1,
		});
		expectParsesTo("oklch(0.7 none 90)", { l: 0.7, a: 0, b: 0, alpha: 1 });
	});

	test("agrees with the equivalent hex color", () => {
		const { l, c, h } = toPolar(RED);
		expectParsesTo(`oklch(${l} ${c} ${h})`, RED, 9);
	});

	test.each([
		"oklch()",
		"oklch(0.7 0.1)",
		"oklch(0.7 0.1 90 0)",
		"oklch(0.7, 0.1, 90)",
		"oklch(0.7 0.1 90px)",
		"oklch(0.7 0.1deg 90)",
	])("rejects malformed oklch %p", (input) => {
		expect(parse(input)).toBeUndefined();
	});
});

describe("parse (general)", () => {
	test("defaults alpha to 1", () => {
		expect(parse("#ff0000")?.alpha).toBe(1);
		expect(parse("rgb(255 0 0)")?.alpha).toBe(1);
		expect(parse("hsl(0 100% 50%)")?.alpha).toBe(1);
		expect(parse("oklab(0.5 0 0)")?.alpha).toBe(1);
		expect(parse("oklch(0.5 0 0)")?.alpha).toBe(1);
	});

	test("ignores surrounding whitespace", () => {
		expectParsesTo("  #ff0000  ", RED);
		expectParsesTo("\trgb(255 0 0)\n", RED);
	});

	test("tolerates extra whitespace inside functions", () => {
		expectParsesTo("rgb(  255 ,  0 ,0 )", RED);
		expectParsesTo("rgb( 255   0   0  /  0.5 )", { ...RED, alpha: 0.5 });
		expectParsesTo("oklch( 0.7  0.1  90 )", {
			l: 0.7,
			a: 0,
			b: 0.1,
			alpha: 1,
		});
	});

	test("function names are case-insensitive", () => {
		expectParsesTo("RGB(255, 0, 0)", RED);
		expectParsesTo("Hsl(0 100% 50%)", RED);
		expectParsesTo("OKLCH(0.7 0.1 90DEG)", {
			l: 0.7,
			a: 0,
			b: 0.1,
			alpha: 1,
		});
	});

	test("equivalent inputs across formats agree", () => {
		for (const input of [
			"#ff0000",
			"#f00",
			"rgb(255, 0, 0)",
			"rgb(100% 0% 0%)",
			"hsl(0, 100%, 50%)",
			"hsl(1turn 100% 50%)",
		]) {
			expectParsesTo(input, RED);
		}
	});

	test("returns a fresh object on every call", () => {
		const first = parse("#ff0000");
		const second = parse("#ff0000");
		expect(first).toBeDefined();
		expect(first).not.toBe(second);
	});

	test.each([
		"",
		"   ",
		"not-a-color",
		"#ff0000 extra",
		"rgb(255 0 0) extra",
		"lab(50% 0 0)",
		"lch(50% 0 0)",
		"hwb(0 0% 0%)",
		"color(srgb 1 0 0)",
		"rgb(255 0 0))",
	])("returns undefined for unsupported input %p", (input) => {
		expect(parse(input)).toBeUndefined();
	});
});
