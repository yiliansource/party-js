const { expect } = require("chai");
const { describe, it } = require("mocha");

const { expectArrayCloseTo } = require("./util");
const { Vector } = require("../dist/components/vector");
const { epsilon } = require("../dist/systems/math");

describe("Vector", function () {
    describe("#constructor", function () {
        const tests = [
            { args: [1, 2], expected: [1, 2, 0] },
            { args: [1, 2, 3], expected: [1, 2, 3] },
            { args: [1, 3, 5, 7, 9], expected: [1, 3, 5] },
        ];

        for (const test of tests) {
            it(`fills missing components with zero: ${test.args.length}`, function () {
                let v = new Vector(...test.args);
                expect(v.xyz).to.eql(test.expected);
            });
        }
    });

    describe("#magnitude", function () {
        const tests = [
            { arg: new Vector(0, 0), expectedSqr: 0, expected: 0 },
            { arg: new Vector(3, 0), expectedSqr: 9, expected: 3 },
            {
                arg: new Vector(0, 1, 1),
                expectedSqr: 2,
                expected: Math.sqrt(2),
            },
            { arg: new Vector(3, 0, 4), expectedSqr: 25, expected: 5 },
        ];

        for (const test of tests) {
            it(`calculates magnitude: ${test.arg.toString()}`, function () {
                expect(test.arg.magnitude()).to.be.closeTo(
                    test.expected,
                    epsilon
                );
            });
        }
        for (const test of tests) {
            it(`calculates squared magnitude: ${test.arg.toString()}`, function () {
                expect(test.arg.sqrMagnitude()).to.be.closeTo(
                    test.expectedSqr,
                    epsilon
                );
            });
        }
    });

    describe("#add", function () {
        const tests = [
            { a: new Vector(2), b: new Vector(5), expected: new Vector(7) },
            {
                a: new Vector(1, 2, 3),
                b: new Vector(4, 5, 6),
                expected: new Vector(5, 7, 9),
            },
            {
                a: new Vector(0, -1, 2, 5),
                b: new Vector(-2, 3, 1, 3),
                expected: new Vector(-2, 2, 3, 8),
            },
            {
                a: new Vector(1, 1, 1, 1, 1, 1),
                b: new Vector(0, 1, 2, 3, 4, 5),
                expected: new Vector(1, 2, 3, 4, 5, 6),
            },
        ];

        for (const test of tests) {
            it(`adds vectors: ${test.a.toString()} + ${test.b.toString()}`, function () {
                expect(test.a.add(test.b)).to.deep.equal(test.expected);
            });
        }
    });

    describe("#subtract", function () {
        const tests = [
            { a: new Vector(6), b: new Vector(4), expected: new Vector(2) },
            {
                a: new Vector(4, 5, 6),
                b: new Vector(3, 2, 1),
                expected: new Vector(1, 3, 5),
            },
            {
                a: new Vector(3, -2, 1, 2),
                b: new Vector(5, 3, 2, 1),
                expected: new Vector(-2, -5, -1, 1),
            },
            {
                a: new Vector(5, 4, 3, 2, 1, 0),
                b: new Vector(2, 2, 2, 2, 2, 2),
                expected: new Vector(3, 2, 1, 0, -1, -2),
            },
        ];

        for (const test of tests) {
            it(`subtracts vectors: ${test.a.toString()} - ${test.b.toString()}`, function () {
                expect(test.a.subtract(test.b)).to.deep.equal(test.expected);
            });
        }
    });

    describe("#scale", function () {
        const testsScalar = [
            { a: new Vector(4), b: 3, expected: new Vector(12) },
            { a: new Vector(3, 5), b: 2, expected: new Vector(6, 10) },
            {
                a: new Vector(1, 2, 3, 4, 5),
                b: 4,
                expected: new Vector(4, 8, 12, 16, 20),
            },
        ];

        for (const test of testsScalar) {
            it(`scales vectors by scalar: ${test.a.toString()} * ${test.b.toString()}`, function () {
                expect(test.a.scale(test.b)).to.deep.equal(test.expected);
            });
        }

        const testsVector = [
            { a: new Vector(2), b: new Vector(3), expected: new Vector(6) },
            {
                a: new Vector(8, 2),
                b: new Vector(1, 3),
                expected: new Vector(8, 6),
            },
            {
                a: new Vector(1, 2, 3, 4, 5),
                b: new Vector(0, 3, 0, 2, 1),
                expected: new Vector(0, 6, 0, 8, 5),
            },
        ];

        for (const test of testsVector) {
            it(`scales vectors by vector: ${test.a.toString()} * ${test.b.toString()}`, function () {
                expect(test.a.scale(test.b)).to.deep.equal(test.expected);
            });
        }
    });

    describe("#normalized", function () {
        const tests = [
            { arg: new Vector(2), expected: new Vector(1) },
            { arg: new Vector(0, 3, 0), expected: new Vector(0, 1, 0) },
            { arg: new Vector(0, 0, -1), expected: new Vector(0, 0, -1) },
        ];

        for (const test of tests) {
            it(`normalizes vectors: ${test.arg.toString()}`, function () {
                expect(test.arg.normalized()).to.deep.equal(test.expected);
            });
        }
    });

    describe("#angle", function () {
        const tests = [
            { a: Vector.right, b: Vector.right, expected: 0 },
            { a: Vector.right, b: Vector.up, expected: Math.PI / 2 },
            { a: new Vector(1), b: new Vector(-1), expected: Math.PI },
            {
                a: new Vector(1, 1),
                b: new Vector(-1, 1),
                expected: Math.PI / 2,
            },
            {
                a: new Vector(-1, -1),
                b: new Vector(-1, 0),
                expected: Math.PI / 4,
            },
        ];

        for (const test of tests) {
            it(`calculates angles between vectors: ${test.a.toString()} & ${test.b.toString()}`, function () {
                expect(test.a.angle(test.b)).to.be.closeTo(
                    test.expected,
                    epsilon
                );
            });
        }
    });

    describe("#cross", function () {
        const tests = [
            { a: Vector.right, b: Vector.up, expected: Vector.forward },
            { a: Vector.forward, b: Vector.forward, expected: Vector.zero },
            { a: Vector.up, b: Vector.up.scale(-1), expected: Vector.zero },
            {
                a: new Vector(1, 2),
                b: new Vector(3, 4),
                expected: new Vector(0, 0, -2),
            },
            {
                a: new Vector(0, 1, 2),
                b: new Vector(5, 4, 3),
                expected: new Vector(-5, 10, -5),
            },
        ];

        for (const test of tests) {
            it(`calculates cross product: ${test.a.toString()} x ${test.b.toString()}`, function () {
                expectArrayCloseTo(
                    test.a.cross(test.b).xyz,
                    test.expected.xyz,
                    epsilon
                );
            });
        }
    });

    describe("#dot", function () {
        const tests = [
            { a: Vector.right, b: Vector.up, expected: 0 },
            { a: Vector.forward, b: Vector.forward, expected: 1 },
            { a: Vector.up, b: Vector.up.scale(-1), expected: -1 },
            { a: new Vector(1, 2), b: new Vector(3, 4), expected: 11 },
            { a: new Vector(0, 1, 2), b: new Vector(5, 4, 3), expected: 10 },
        ];

        for (const test of tests) {
            it(`calculates dot product: ${test.a.toString()} . ${test.b.toString()}`, function () {
                expect(test.a.dot(test.b)).to.be.closeTo(
                    test.expected,
                    epsilon
                );
            });
        }
    });

    describe("#from2dAngle", function () {
        const tests = [
            { arg: 0, expected: Vector.right },
            { arg: 90, expected: Vector.up },
            { arg: -90, expected: Vector.up.scale(-1) },
            { arg: 45, expected: new Vector(1, 1).normalized() },
        ];

        for (const test of tests) {
            it(`creates vector from 2d angle: ${test.arg.toString()}`, function () {
                expectArrayCloseTo(
                    Vector.from2dAngle(test.arg).xyz,
                    test.expected.xyz,
                    epsilon
                );
            });
        }
    });
});
