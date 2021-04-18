import { expect } from "chai";
import { describe, it } from "mocha";

import { NumericSpline } from "../src/components/numericSpline";
import { epsilon } from "../src/systems/math";

interface SplineKey<T> {
    time: number;
    value: T;
}

describe("Spline", function () {
    /**
     * Note: The following unit tests cover the standard implementation
     * of the abstract spline using the NumericSpline class. This is because
     * the numeric implementation is simpler to test than the Gradient, but
     * will yield the same degree of coverage.
     */

    describe("#constructor", function () {
        it("throws an error if no keys are passed", function () {
            expect(() => new NumericSpline()).to.throw();
        });
    });

    // TODO: Might need better test coverage
    describe("#evaluate", function () {
        const tests: {
            keys: SplineKey<number>[];
            expected: SplineKey<number>[];
        }[] = [
            {
                keys: [
                    { time: 0, value: 0 },
                    { time: 1, value: 1 },
                ],
                expected: [
                    { time: -1, value: 0 },
                    { time: 0, value: 0 },
                    { time: 0.5, value: 0.5 },
                    { time: 1, value: 1 },
                    { time: 2, value: 1 },
                ],
            },
        ];

        for (const test of tests) {
            const spline = new NumericSpline(...test.keys);
            for (const tuple of test.expected) {
                it(`evaluates numeric splines: ${tuple.time}`, function () {
                    expect(spline.evaluate(tuple.time)).to.be.closeTo(
                        tuple.value,
                        epsilon
                    );
                });
            }
        }
    });
});
