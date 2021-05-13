import { expect } from "chai";
import { describe, it } from "mocha";

import * as math from "../src/systems/math";

describe("Math", function () {
    describe("#lerp", function () {
        const tests: {
            a: number;
            b: number;
            t: number;
            expected: number;
        }[] = [
            // Basic
            { a: 1, b: 3, t: 0.5, expected: 2 },
            { a: 0, b: 5, t: 0.2, expected: 1 },
            { a: 2, b: 7, t: 1, expected: 7 },
            // Inverse
            { a: 8, b: 4, t: 0.5, expected: 6 },
            { a: 5, b: 4, t: 1, expected: 4 },
            // Unclamped
            { a: 3, b: 7, t: 2, expected: 11 },
            { a: 2, b: 3, t: 3, expected: 5 },
            // Negative
            { a: -8, b: -4, t: 0.5, expected: -6 },
            { a: -2, b: -4, t: 0.25, expected: -2.5 },
        ];

        for (const test of tests) {
            it(`lerps values: ${test.a} to ${test.b} by ${test.t}`, function () {
                expect(math.lerp(test.a, test.b, test.t)).to.be.closeTo(
                    test.expected,
                    math.epsilon
                );
            });

            it(`inversely lerps values: ${test.a} to ${test.b} with ${test.expected}`, function () {
                expect(
                    math.invlerp(test.a, test.b, test.expected)
                ).to.be.closeTo(test.t, math.epsilon);
            });
        }
    });

    describe("#clamp", function () {
        const tests: {
            value: number;
            min: number;
            max: number;
            expected: number;
        }[] = [
            // Inside
            { value: 3, min: 0, max: 5, expected: 3 },
            { value: 2, min: -5, max: 10, expected: 2 },
            // Upper
            { value: 8, min: 1, max: 3, expected: 3 },
            { value: 5, min: -1, max: 2, expected: 2 },
            // Lower
            { value: 3, min: 5, max: 10, expected: 5 },
            { value: 1, min: 2, max: 3, expected: 2 },
        ];

        for (const test of tests) {
            it(`clamps values: ${test.min} <= ${test.value} <= ${test.max}`, function () {
                const clamped = math.clamp(test.value, test.min, test.max);
                expect(clamped).to.be.closeTo(test.expected, math.epsilon);
            });
        }
    });

    describe("#approximately", function () {
        const tests: {
            a: number;
            b: number;
            expected: boolean;
        }[] = [
            // Truthy
            { a: 3, b: 3, expected: true },
            { a: 0.000000000002, b: 0.00000000001, expected: true },
            { a: 3.14159265, b: 3.141592655, expected: true },
            // Falsey
            { a: 0, b: 1, expected: false },
            { a: 10, b: 20, expected: false },
            { a: -10, b: 10, expected: false },
        ];

        for (const test of tests) {
            it(`approximately compares values: ${test.a} ${
                test.expected ? "==" : "!="
            } ${test.b}`, function () {
                expect(math.approximately(test.a, test.b)).to.equal(
                    test.expected
                );
            });
        }
    });
});
