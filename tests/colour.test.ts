import { expect } from "chai";
import { describe, it } from "mocha";

import { Color } from "../src/components/color";
import { epsilon } from "../src/systems/math";
import { expectArrayCloseTo } from "./util";

type ColorComponents = [number, number, number];

describe("Color", function () {
    describe("#constructor", function () {
        const tests: {
            params: ColorComponents;
        }[] = [
            { params: [255, 255, 255] },
            { params: [0, 0, 0] },
            { params: [127, 46, 24] },
            { params: [165, 201, 231] },
        ];

        for (const test of tests) {
            it(`creates colors from components: ${test.params}`, function () {
                expectArrayCloseTo(
                    new Color(...test.params).rgb,
                    test.params,
                    epsilon
                );
            });
        }
    });

    describe("#mix", function () {
        const halfwayTests: {
            a: ColorComponents;
            b: ColorComponents;
            expected: ColorComponents;
        }[] = [
            {
                a: [0, 0, 0],
                b: [100, 60, 30],
                expected: [50, 30, 15],
            },
            {
                a: [30, 20, 10],
                b: [10, 20, 30],
                expected: [20, 20, 20],
            },
            {
                a: [0, 100, 200],
                b: [50, 150, 250],
                expected: [25, 125, 225],
            },
        ];

        for (const test of halfwayTests) {
            it(`mixes colors together halfway by default: ${test.a} * ${test.b}`, function () {
                const a = new Color(...test.a);
                const b = new Color(...test.b);
                expectArrayCloseTo(a.mix(b).rgb, test.expected, epsilon);
            });
        }

        const weightTests: {
            a: ColorComponents;
            b: ColorComponents;
            weight: number;
            expected: ColorComponents;
        }[] = [
            {
                a: [0, 0, 0],
                b: [100, 100, 100],
                weight: 0.3,
                expected: [30, 30, 30],
            },
            {
                a: [100, 0, 50],
                b: [150, 200, 100],
                weight: 0.2,
                expected: [110, 40, 60],
            },
        ];

        for (const test of weightTests) {
            it(`mixes colors by weight: ${test.a} * ${test.b} (${(
                test.weight * 100
            ).toFixed(2)}%)`, function () {
                const a = new Color(...test.a);
                const b = new Color(...test.b);
                expectArrayCloseTo(
                    a.mix(b, test.weight).rgb,
                    test.expected,
                    epsilon
                );
            });
        }

        const nomixTests: {
            a: ColorComponents;
            b: ColorComponents;
        }[] = [
            {
                a: [24, 96, 125],
                b: [1, 24, 40],
            },
            {
                a: [58, 52, 12],
                b: [251, 210, 194],
            },
        ];

        for (const test of nomixTests) {
            it(`doesn't mix when weight is zero: ${test.a} * ${test.b} (0%)`, function () {
                const a = new Color(...test.a);
                const b = new Color(...test.b);
                expectArrayCloseTo(a.mix(b, 0).rgb, test.a, epsilon);
            });
        }
    });

    describe("#fromHex", function () {
        const tests: {
            hex: string;
            rgb: ColorComponents;
        }[] = [
            { hex: "#B9D300", rgb: [185, 211, 0] },
            { hex: "#3296D8", rgb: [50, 150, 216] },
            { hex: "#A02DC5", rgb: [160, 45, 197] },
            { hex: "#45817D", rgb: [69, 129, 125] },
        ];

        for (const test of tests) {
            it(`converts hex to rgb: ${test.hex}`, function () {
                expectArrayCloseTo(
                    Color.fromHex(test.hex).rgb,
                    test.rgb,
                    epsilon
                );
            });

            it(`converts rgb to hex: ${test.rgb}`, function () {
                expect(new Color(...test.rgb).toHex().toUpperCase()).to.equal(
                    test.hex
                );
            });
        }
    });

    describe("#fromHsl", function () {
        const tests: {
            hsl: ColorComponents;
            rgb: ColorComponents;
        }[] = [
            { hsl: [67, 100, 41], rgb: [185, 211, 0] },
            { hsl: [204, 68, 52], rgb: [50, 150, 216] },
            { hsl: [285, 63, 47], rgb: [160, 45, 197] },
            { hsl: [176, 30, 39], rgb: [69, 129, 125] },
        ];

        for (const test of tests) {
            it(`converts hsl to rgb: ${test.hsl}`, function () {
                expectArrayCloseTo(
                    Color.fromHsl(...test.hsl).rgb,
                    test.rgb,
                    // there are some precision problems here, so we compensate
                    // being more tolerant with the epsilon
                    2
                );
            });
        }
    });
});
