import { expect } from 'chai';
import { describe, it } from 'mocha';

import Vector from '../dist/components/vector';

import { epsilon } from '../dist/systems/math';
import { magnitude, sqrMagnitude, add, subtract, scale, normalize } from '../dist/systems/math.vector';

describe('Vector', function() {

    describe('#constructor', function() {
        const tests = [
            { args: [1, 2], expected: 2 },
            { args: [1, 2, 3], expected: 3 },
            { args: [1, 2, 3, 4, 5], expected: 5 }
        ];

        for (let test of tests) {
            it(`creates correct dimensions: ${test.args.length}`, function() {
                let v = new Vector(test.args);
                expect(v.values.length).to.equal(test.expected);
            })
        }
    });

    describe('#magnitude', function() {
        const tests = [
            { arg: new Vector(0, 0), expectedSqr: 0, expected: 0 },
            { arg: new Vector(3, 0), expectedSqr: 9, expected: 3 },
            { arg: new Vector(0, 1, 1), expectedSqr: 2, expected: Math.sqrt(2) },
            { arg: new Vector(3, 0, 4), expectedSqr: 25, expected: 5 }
        ];

        for (let test of tests) {
            it(`calculates magnitude: ${test.arg.toString()}`, function() {
                expect(magnitude(test.arg)).to.be.closeTo(test.expected, epsilon);
            });
        }
        for (let test of tests) {
            it(`calculates squared magnitude: ${test.arg.toString()}`, function() {
                expect(sqrMagnitude(test.arg)).to.be.closeTo(test.expectedSqr, epsilon);
            });
        }
    });

    describe('#add', function() {
        const tests = [
            { a: new Vector(2), b: new Vector(5), expected: new Vector(7) },
            { a: new Vector(1, 2, 3), b: new Vector(4, 5, 6), expected: new Vector(5, 7, 9) },
            { a: new Vector(0, -1, 2, 5), b: new Vector(-2, 3, 1, 3), expected: new Vector(-2, 2, 3, 8) },
            { a: new Vector(1, 1, 1, 1, 1, 1), b: new Vector(0, 1, 2, 3, 4, 5), expected: new Vector(1, 2, 3, 4, 5, 6) }
        ];

        for (let test of tests) {
            it(`adds vectors: ${test.a.toString()} + ${test.b.toString()}`, function() {
                expect(add(test.a, test.b)).to.deep.equal(test.expected);
            });
        }
    });

    describe('#subtract', function() {
        const tests = [
            { a: new Vector(6), b: new Vector(4), expected: new Vector(2) },
            { a: new Vector(4, 5, 6), b: new Vector(3, 2, 1), expected: new Vector(1, 3, 5) },
            { a: new Vector(3, -2, 1, 2), b: new Vector(5, 3, 2, 1), expected: new Vector(-2, -5, -1, 1) },
            { a: new Vector(5, 4, 3, 2, 1, 0), b: new Vector(2, 2, 2, 2, 2, 2), expected: new Vector(3, 2, 1, 0, -1, -2) }
        ];

        for (let test of tests) {
            it(`subtracts vectors: ${test.a.toString()} - ${test.b.toString()}`, function() {
                expect(subtract(test.a, test.b)).to.deep.equal(test.expected);
            });
        }
    });

    describe('#scale', function() {
        const testsScalar = [
            { a: new Vector(4), b: 3, expected: new Vector(12) },
            { a: new Vector(3, 5), b: 2, expected: new Vector(6, 10) },
            { a: new Vector(1, 2, 3, 4, 5), b: 4, expected: new Vector(4, 8, 12, 16, 20) }
        ];

        for (let test of testsScalar) {
            it(`scales vectors by scalar: ${test.a.toString()} * ${test.b.toString()}`, function() {
                expect(scale(test.a, test.b)).to.deep.equal(test.expected);
            });
        }

        const testsVector = [
            { a: new Vector(2), b: new Vector(3), expected: new Vector(6) },
            { a: new Vector(8, 2), b: new Vector(1, 3), expected: new Vector(8, 6) },
            { a: new Vector(1, 2, 3, 4, 5), b: new Vector(0, 3, 0, 2, 1), expected: new Vector(0, 6, 0, 8, 5) }
        ];

        for (let test of testsVector) {
            it(`scales vectors by vector: ${test.a.toString()} * ${test.b.toString()}`, function() {
                expect(scale(test.a, test.b)).to.deep.equal(test.expected);
            });
        }
    });

    describe('#normalize', function() {
        const tests = [
            { arg: new Vector(2), expected: new Vector(1) },
            { arg: new Vector(0, 3, 0), expected: new Vector(0, 1, 0) },
            { arg: new Vector(0, 0, -1), expected: new Vector(0, 0, -1) }
        ];

        for (let test of tests) {
            it(`normalizes vectors: ${test.arg.toString()}`, function() {
                expect(normalize(test.arg)).to.deep.equal(test.expected);
            });
        }
    });
})