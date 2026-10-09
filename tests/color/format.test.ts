import { describe, expect, test } from "bun:test";

import type { Color } from "@/color/color";
import { format } from "@/color/format";
import { parse } from "@/color/parse";

// reference values were computed independently with culori (oklab, formatRgb)

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

function roundTripFailures(inputs: string[]): string[] {
	return inputs.filter((input) => {
		const parsed = parse(input);
		return !parsed || format(parsed) !== input;
	});
}

describe("format", () => {
	test("formats primaries", () => {
		expect(format(RED)).toBe("rgb(255, 0, 0)");
		expect(format(LIME)).toBe("rgb(0, 255, 0)");
		expect(format(BLUE)).toBe("rgb(0, 0, 255)");
	});

	test("formats black, white and gray", () => {
		expect(format({ l: 0, a: 0, b: 0, alpha: 1 })).toBe("rgb(0, 0, 0)");
		expect(format({ l: 1, a: 0, b: 0, alpha: 1 })).toBe(
			"rgb(255, 255, 255)",
		);
		expect(format({ l: 0.5998708056221468, a: 0, b: 0, alpha: 1 })).toBe(
			"rgb(128, 128, 128)",
		);
	});

	test("formats non-primary colors", () => {
		expect(
			format({
				l: 0.7442024724636972,
				a: 0.10010437810129963,
				b: 0.15100320669179945,
				alpha: 1,
			}),
		).toBe("rgb(255, 136, 0)");
		expect(
			format({
				l: 0.49931445584520834,
				a: -0.03304348760594705,
				b: -0.09296659206477714,
				alpha: 1,
			}),
		).toBe("rgb(51, 102, 153)");
		expect(format({ l: 0.7, a: 0, b: 0.1, alpha: 1 })).toBe(
			"rgb(183, 156, 81)",
		);
	});

	test("uses rgba with the alpha appended when translucent", () => {
		expect(format({ ...RED, alpha: 0.4 })).toBe("rgba(255, 0, 0, 0.4)");
		expect(format({ ...BLUE, alpha: 0 })).toBe("rgba(0, 0, 255, 0)");
	});

	test("rounds alpha to three decimals", () => {
		expect(format({ ...RED, alpha: 1 / 3 })).toBe("rgba(255, 0, 0, 0.333)");
		expect(format({ ...RED, alpha: 0.6667 })).toBe(
			"rgba(255, 0, 0, 0.667)",
		);
	});

	test("uses rgb when alpha rounds to 1", () => {
		expect(format({ ...RED, alpha: 0.99999 })).toBe("rgb(255, 0, 0)");
	});

	test("clamps alpha to [0, 1]", () => {
		expect(format({ ...RED, alpha: 1.5 })).toBe("rgb(255, 0, 0)");
		expect(format({ ...RED, alpha: -0.5 })).toBe("rgba(255, 0, 0, 0)");
	});

	test("clips out-of-gamut colors per channel", () => {
		expect(format({ l: 0.7, a: 0.4, b: 0, alpha: 1 })).toBe(
			"rgb(255, 0, 148)",
		);
		expect(format({ l: 0.5, a: -0.3, b: 0.3, alpha: 1 })).toBe(
			"rgb(0, 134, 0)",
		);
		expect(format({ l: 0.9, a: 0, b: 0.3, alpha: 1 })).toBe(
			"rgb(255, 203, 0)",
		);
	});

	test("clips lightness beyond black and white", () => {
		expect(format({ l: 1.2, a: 0, b: 0, alpha: 1 })).toBe(
			"rgb(255, 255, 255)",
		);
		expect(format({ l: -0.1, a: 0, b: 0, alpha: 1 })).toBe("rgb(0, 0, 0)");
	});

	test("round-trips every 8-bit gray through parse", () => {
		const inputs: string[] = [];
		for (let v = 0; v <= 255; v++) {
			inputs.push(`rgb(${v}, ${v}, ${v})`);
		}
		expect(roundTripFailures(inputs)).toEqual([]);
	});

	test("round-trips a grid of 8-bit colors through parse", () => {
		const inputs: string[] = [];
		for (let r = 0; r <= 255; r += 17) {
			for (let g = 0; g <= 255; g += 17) {
				for (let b = 0; b <= 255; b += 17) {
					inputs.push(`rgb(${r}, ${g}, ${b})`);
				}
			}
		}
		expect(roundTripFailures(inputs)).toEqual([]);
	});
});
