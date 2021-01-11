const expect = require('chai').expect;

const Matrix = require('../dist/util/matrix').default;

describe('Matrix', function() {
    describe('#construction', function() {
        it('creates matrices from arguments', function() {
            expect(() => new Matrix([0])).to.not.throw();
            expect(() => new Matrix([1, 2, 3], [4, 5, 6])).to.not.throw();
        });
        it('allows correct indexing', function() {
            let m = new Matrix([1, 2, 3], [4, 5, 6]);
            expect(m.index(1, 2)).to.equal(6);
            expect(m.index(0, 0)).to.equal(1);
        });
        it('defines correct dimensions', function() {
            let m = new Matrix([1, 2, 3], [4, 5, 6]);
            expect(m.m).to.equal(2);
            expect(m.n).to.equal(3);
        });
    });
    describe('#addition', function() {
        it('sums matrices together', function() {
            expect(new Matrix([1, 3, 1], [1, 0, 0]).add(new Matrix([0, 0, 5], [7, 5, 0]))).to.deep.equal(new Matrix([1, 3, 6], [8, 5, 0]));
        });
        it('does not allow matrices of different sizes', function() {
            expect(() => new Matrix([1]).add(new Matrix([2, 2], [2, 2]))).to.throw();
        });
    });
    describe('#scale', function() {
        it('scales matrices by scalar', function() {
            expect(new Matrix([1, 2, 3], [4, 5, 6]).scale(2)).to.deep.equal(new Matrix([2, 4, 6], [8, 10, 12]));
        });
        it('does not modify with scalar one', function() {
            const m = new Matrix([1, 2, 3], [4, 5, 6]);
            expect(m.scale(1)).to.deep.equal(m);
        });
    });
    describe('#multiplication', function() {
        it('multiplies matrices together', function() {
            expect(new Matrix([1, 2, 3], [4, 5, 6]).mul(new Matrix([7, 8], [9, 10], [11, 12]))).to.deep.equal(new Matrix([58, 64], [139, 154]));
            expect(new Matrix([3, 4, 2]).mul(new Matrix([13, 9, 7, 15], [8, 7, 4, 6], [6, 4, 0, 3]))).to.deep.equal(new Matrix([83, 63, 37, 75]));
        });
        it('does not allow invalid multiplications', function() {
            expect(() => new Matrix([1, 2], [3, 4]).mul(new Matrix([1]))).to.throw();
        });
    });
})