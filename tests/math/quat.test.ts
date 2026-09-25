import { describe, expect, test } from "bun:test";

import * as quat from "../../src/math/quat";
import * as vec3 from "../../src/math/vec3";
import { quatCloseTo, vec3CloseTo } from "./helper";

describe("quat", () => {
	test("identity rotates a vector to itself", () => {
		vec3CloseTo(quat.rotateVec3(quat.identity, { x: 1, y: 2, z: 3 }), {
			x: 1,
			y: 2,
			z: 3,
		});
	});

	test("fromAxisAngle produces a unit quaternion", () => {
		expect(
			quat.length(quat.fromAxisAngle(vec3.unitZ, Math.PI / 3)),
		).toBeCloseTo(1, 9);
	});

	test("90 degree rotation about Z sends X to Y", () => {
		const q = quat.fromAxisAngle(vec3.unitZ, Math.PI / 2);
		vec3CloseTo(quat.rotateVec3(q, vec3.unitX), vec3.unitY);
	});

	test("180 degree rotation about Y sends X to -X", () => {
		const q = quat.fromAxisAngle(vec3.unitY, Math.PI);
		vec3CloseTo(quat.rotateVec3(q, vec3.unitX), vec3.negate(vec3.unitX));
	});

	test("a full 360 degree rotation returns a vector to itself", () => {
		const q = quat.fromAxisAngle(vec3.unitX, Math.PI * 2);
		vec3CloseTo(quat.rotateVec3(q, vec3.unitY), vec3.unitY);
	});

	test("rotation about an axis leaves that axis unchanged", () => {
		const axis = vec3.normalize({ x: 1, y: 1, z: 1 });
		const q = quat.fromAxisAngle(axis, 1.234);
		vec3CloseTo(quat.rotateVec3(q, axis), axis);
	});

	test("rotation preserves vector length", () => {
		const q = quat.fromAxisAngle(
			vec3.normalize({ x: 0.3, y: 0.7, z: -0.2 }),
			2.1,
		);
		const v = { x: 3, y: -4, z: 5 };
		expect(vec3.length(quat.rotateVec3(q, v))).toBeCloseTo(
			vec3.length(v),
			9,
		);
	});

	test("composing two quaternions matches applying them in sequence", () => {
		const qx = quat.fromAxisAngle(vec3.unitX, Math.PI / 2);
		const qy = quat.fromAxisAngle(vec3.unitY, Math.PI / 2);
		const v = { x: 1, y: 0, z: 0 };

		const sequential = quat.rotateVec3(qy, quat.rotateVec3(qx, v));
		const composed = quat.rotateVec3(quat.multiply(qy, qx), v);
		vec3CloseTo(sequential, composed);
	});

	test("conjugate of a unit quaternion is its inverse", () => {
		const q = quat.fromAxisAngle(vec3.normalize({ x: 1, y: 2, z: 3 }), 0.9);
		quatCloseTo(quat.multiply(q, quat.conjugate(q)), quat.identity);
	});

	test("normalize returns identity for a zero quaternion", () => {
		quatCloseTo(quat.normalize({ x: 0, y: 0, z: 0, w: 0 }), quat.identity);
	});

	test("basis of the identity quaternion is the standard axes", () => {
		const b = quat.basis(quat.identity);
		vec3CloseTo(b.x, vec3.unitX);
		vec3CloseTo(b.y, vec3.unitY);
		vec3CloseTo(b.z, vec3.unitZ);
	});

	test("basis vectors stay orthonormal after rotation", () => {
		const b = quat.basis(
			quat.fromAxisAngle(vec3.normalize({ x: 1, y: -1, z: 2 }), 1.1),
		);
		expect(vec3.dot(b.x, b.y)).toBeCloseTo(0, 9);
		expect(vec3.dot(b.y, b.z)).toBeCloseTo(0, 9);
		expect(vec3.length(b.x)).toBeCloseTo(1, 9);
	});

	test("integrating zero angular velocity leaves orientation unchanged", () => {
		const q = quat.fromAxisAngle(vec3.unitY, 0.5);
		quatCloseTo(quat.integrate(q, vec3.zero, 1 / 120), q);
	});

	test("integrate keeps the quaternion normalized over many steps", () => {
		let q = quat.identity;
		for (let i = 0; i < 500; i++) {
			q = quat.integrate(q, { x: 40, y: 130, z: -75 }, 1 / 120);
		}
		expect(quat.length(q)).toBeCloseTo(1, 6);
	});

	test("integrate over a full second approximates the closed-form rotation", () => {
		// 90 deg/s about z-axis for 1 second -> ~90 deg rotation about z-axis
		let q = quat.identity;
		const steps = 120;
		const dt = 1 / steps;
		for (let i = 0; i < steps; i++) {
			q = quat.integrate(q, { x: 0, y: 0, z: 90 }, dt);
		}
		// numeric integration may accumulate a small error after steps
		quatCloseTo(q, quat.fromAxisAngle(vec3.unitZ, Math.PI / 2), 2);
	});
});
