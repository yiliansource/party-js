import { describe, expect, test } from "bun:test";

import { createShapeCache } from "@/shapes/cache";

describe("createShapeCache", () => {
	test("accurate caches a Path2D by key", () => {
		const resolve = createShapeCache();
		let counter = 0;
		const build = () => {
			counter++;
			return new Path2D();
		};

		resolve("0", build);
		expect(counter).toBe(1);
		resolve("0", build);
		expect(counter).toBe(1);
		resolve("1", build);
		expect(counter).toBe(2);
	});
});
