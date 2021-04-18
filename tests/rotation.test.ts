import { describe, it } from "mocha";

import { Vector } from "../src/components/vector";
import { rotationToNormal } from "../src/util/rotation";
import { expectArrayCloseTo } from "./util";

describe("Rotation", function () {
    describe("#rotationToNormal", function () {
        const tests: {
            rotation: number[];
            expected: number[];
        }[] = [
            {
                rotation: [0, 0, 0],
                expected: [0, 0, 1],
            },
            {
                rotation: [0, 0, 47],
                expected: [0, 0, 1],
            },
            {
                rotation: [90, 0, 0],
                expected: [0, -1, 0],
            },
            {
                rotation: [45, 30, 20],
                expected: [-0.35, -0.61, 0.61],
            },
            {
                rotation: [150, 80, 110],
                expected: [0.85, -0.09, -0.15],
            },
            {
                rotation: [224, 84, 31],
                expected: [0.72, 0.07, -0.08],
            },
        ];

        for (const test of tests) {
            it(`calculates normals from rotations: (${test.rotation.join(
                ", "
            )})`, function () {
                expectArrayCloseTo(
                    rotationToNormal(new Vector(...test.rotation)).xyz,
                    test.expected,
                    0.1
                );
            });
        }
    });
});
