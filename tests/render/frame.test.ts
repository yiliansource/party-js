import { describe, expect, test } from "bun:test";

import type { Particle } from "@/particle/particle";
import { drawParticles } from "@/render/frame";

import { makeTestParticle } from "../helpers";
import { createTestContext } from "./helpers";

describe("drawParticles", () => {
	test("calls a custom shape's draw function with the context and the particle being drawn", () => {
		const { ctx } = createTestContext(100, 100);
		const calls: [CanvasRenderingContext2D, Particle][] = [];
		const draw = (c: CanvasRenderingContext2D, p: Particle) => {
			calls.push([c, p]);
		};
		const first = makeTestParticle({ shape: { type: "custom", draw } });
		const second = makeTestParticle({ shape: { type: "custom", draw } });

		drawParticles(ctx, [first, second], { x: 0, y: 0 });

		expect(calls).toHaveLength(2);
		expect(calls[0][0]).toBe(ctx);
		expect(calls[0][1]).toBe(first);
		expect(calls[1][1]).toBe(second);
	});

	test("a custom shape can use the particle, e.g. to fade with its opacity", () => {
		const { ctx, pixelAt } = createTestContext(100, 100);
		const particle = makeTestParticle({
			size: 20,
			color: { l: 1, a: 0, b: 0, alpha: 0.5 },
			shape: {
				type: "custom",
				// like drawImage, fillRect with a fixed color ignores the fillStyle's opacity, so it's applied by hand
				draw: (c, p) => {
					c.globalAlpha = p.color.alpha;
					c.fillStyle = "#ff0000";
					c.fillRect(-0.5, -0.5, 1, 1);
				},
			},
		});

		drawParticles(ctx, [particle], { x: 50, y: 50 }, undefined, null);

		expect(pixelAt(50, 50)[3]).toBeCloseTo(128, -1);
	});
});
