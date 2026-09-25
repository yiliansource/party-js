import { expect } from "bun:test";

import type { Quat } from "../../src/math/quat";
import type { Vec3 } from "../../src/math/vec3";

export function vec3CloseTo(a: Readonly<Vec3>, b: Readonly<Vec3>, digits = 9) {
	expect(a).toEqual({
		x: expect.closeTo(b.x, digits),
		y: expect.closeTo(b.y, digits),
		z: expect.closeTo(b.z, digits),
	});
}

export function quatCloseTo(a: Readonly<Quat>, b: Readonly<Quat>, digits = 9) {
	expect(a).toEqual({
		x: expect.closeTo(b.x, digits),
		y: expect.closeTo(b.y, digits),
		z: expect.closeTo(b.z, digits),
		w: expect.closeTo(b.w, digits),
	});
}
