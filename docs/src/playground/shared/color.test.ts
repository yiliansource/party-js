/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import { toHexColor } from "./color";

describe("toHexColor", () => {
	test.each<[string, string]>([
		["oklch(0.7 0.15 70)", "#d98b09"],
		["oklch(0.95 0.15 70)", "#ffdc75"],
		["#FFF", "#ffffff"],
		["rgb(0 166 153)", "#00a699"],
		["hsl(250 100% 70%)", "#8066ff"],
	])("%s -> %s", (input, expected) => {
		expect(toHexColor(input)).toBe(expected);
	});
});
