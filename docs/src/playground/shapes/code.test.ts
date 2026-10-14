/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import { shapeLiteral } from "../shared/shape/code";
import { createShapeDraft } from "../shared/shape/draft";
import { toText } from "../shared/tokens";
import { shapeCode } from "./code";

describe("shapeCode", () => {
	test("declares the shape as a constant", () => {
		const draft = {
			...createShapeDraft(),
			type: "star" as const,
			star: { points: 6 },
		};
		const code = toText(shapeCode(draft));

		expect(code).toBe(`const shape = ${toText(shapeLiteral(draft))};`);
		expect(() => new Function(code)).not.toThrow();
	});
});
