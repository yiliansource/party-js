import { describe, expect, test } from "bun:test";

import { format as formatColor } from "@/color/format";
import { buildDrawCommand } from "@/render/drawCommand";
import { circlePath } from "@/shapes/circle";
import { polygonPath } from "@/shapes/polygon";
import { squarePath } from "@/shapes/square";
import { starPath } from "@/shapes/star";

import { makeTestParticle } from "../helpers";

const identityTransform = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

describe("buildDrawCommand", () => {
	test("passes the transform through unchanged", () => {
		const particle = makeTestParticle({ shape: { type: "circle" } });

		const cmd = buildDrawCommand(particle, identityTransform);

		expect(cmd.transform).toBe(identityTransform);
	});

	test("resolves each built-in shape to its own cached Path2D, with parameters forwarded correctly", () => {
		const cases = [
			{
				shape: { type: "circle" as const },
				expected: () => circlePath(),
			},
			{
				shape: {
					type: "square" as const,
					aspectRatio: 0.5,
					cornerRadius: 0.1,
				},
				expected: () => squarePath(0.5, 0.1),
			},
			{
				shape: { type: "star" as const, points: 7 },
				expected: () => starPath(7),
			},
			{
				shape: { type: "polygon" as const, sides: 6 },
				expected: () => polygonPath(6),
			},
		];

		for (const { shape, expected } of cases) {
			const particle = makeTestParticle({ shape });
			const cmd = buildDrawCommand(particle, identityTransform);

			expect(cmd.kind).toBe("path");
			if (cmd.kind === "path") {
				expect(cmd.path).toBe(expected());
			}
		}
	});

	test("a path shape's Path2D is passed through unchanged", () => {
		const path = circlePath();
		const particle = makeTestParticle({ shape: { type: "path", path } });

		const cmd = buildDrawCommand(particle, identityTransform);

		expect(cmd.kind).toBe("path");
		if (cmd.kind === "path") {
			expect(cmd.path).toBe(path);
		}
	});

	test("a custom shape produces a custom command carrying its draw function", () => {
		const draw = (_ctx: CanvasRenderingContext2D) => {};
		const particle = makeTestParticle({ shape: { type: "custom", draw } });

		const cmd = buildDrawCommand(particle, identityTransform);

		expect(cmd.kind).toBe("custom");
		if (cmd.kind === "custom") {
			expect(cmd.draw).toBe(draw);
		}
	});

	test("fillStyle is derived from the particle's color via toCssColor", () => {
		const particle = makeTestParticle({
			shape: { type: "circle" },
			color: { l: 0.5, a: 0.1, b: -0.1, alpha: 0.7 },
		});

		const cmd = buildDrawCommand(particle, identityTransform);

		expect(cmd.kind).toBe("path");
		if (cmd.kind === "path") {
			expect(cmd.fillStyle).toBe(formatColor(particle.color));
		}
	});
});
