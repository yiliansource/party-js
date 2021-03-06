const { expect } = require("chai");
const { describe, it } = require("mocha");

const { expectArrayCloseTo } = require("./util");
const { epsilon } = require("../dist/systems/math");
const { Gradient } = require("../dist/components/gradient");
const { Colour } = require("../dist/components/colour");

describe("Gradient", function () {
    describe("#constructor", function () {
        it("throws an error if no keys are passed", function () {
            expect(() => new Gradient()).to.throw();
        });
    });

    // TODO: Might need better test coverage
    describe("#evaluate", function () {
        const tests = [
            {
                keys: [
                    {
                        time: 0,
                        colour: Colour.black,
                    },
                    {
                        time: 1,
                        colour: Colour.white,
                    },
                ],
                expected: [
                    {
                        time: 0,
                        colour: Colour.black,
                    },
                    {
                        time: 0.5,
                        colour: Colour.black.mix(Colour.white),
                    },
                    {
                        time: 1,
                        colour: Colour.white,
                    },
                ],
            },
        ];

        for (const test of tests) {
            it(`evaluates basic gradients`, function () {
                const gradient = new Gradient(...test.keys);
                for (const tuple of test.expected) {
                    expectArrayCloseTo(
                        gradient.evaluate(tuple.time).rgb,
                        tuple.colour.rgb,
                        epsilon
                    );
                }
            });
        }
    });
});
