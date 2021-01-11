const expect = require('chai').expect;

const { deg2rad } = require('../dist/util/math');
const Vector = require('../dist/util/vector').default;

describe('Vector', function() {
    describe('#construction', function() {
        it('creates vectors from arguments', function() {
            let v = new Vector(1, 2, 3);
            expect(v.x).to.equal(1);
            expect(v.y).to.equal(2);
            expect(v.z).to.equal(3);
        });
        it('fills missing arguments as zeros', function() {
            let v = new Vector(3);
            expect(v.x).to.equal(3);
            expect(v.y).to.equal(0);
            expect(v.z).to.equal(0);
        });
    });
    describe('#magnitude', function() {
        it('calculates magnitude', function() {
            expect(new Vector(3, 0, 0).magnitude()).to.equal(3);
            expect(new Vector(1, 1, 0).magnitude()).to.equal(Math.sqrt(2));
        });
        it('calculates squared magnitudes', function() {
            expect(new Vector(2, 2, 0).sqrMagnitude()).to.equal(8);
            expect(new Vector(1, 1, 1).sqrMagnitude()).to.equal(3);
        });
        it('calculates zero-magnitudes', function() {
            expect(Vector.zero.magnitude()).to.equal(0);
        });
    });
    describe('#add', function() {
        it('adds vectors together', function() {
            let v = new Vector(3, 4, 5).add(new Vector(2, 3, 4));
            expect(v).to.deep.equal(new Vector(5, 7, 9));
        });
        it('balances out vectors', function() {
            let v = new Vector(2, 3, 4).add(new Vector(-2, -3, -4));
            expect(v).to.deep.equal(new Vector(0, 0, 0));
        });
    });
    describe('#subtract', function() {
        it('subtracts vectors from eachother', function() {
            let v = new Vector(3, 4, 5).subtract(new Vector(2, 4, 6));
            expect(v).to.deep.equal(new Vector(1, 0, -1));
        });
        it('balances out vectors', function() {
            let v = new Vector(2, 3, 4);
            v = v.subtract(v);
            expect(v).to.deep.equal(new Vector(0, 0, 0));
        });
    });
    describe('#scale', function() {
        it('scales vector by vector', function() {
            let v = new Vector(2, 3, 4).scale(new Vector(3, 4, 5));
            expect(v).to.deep.equal(new Vector(6, 12, 20));
        });
        it('scales vector by number', function() {
            let v = new Vector(3, 4, 5).scale(3);
            expect(v).to.deep.equal(new Vector(9, 12, 15));
        });
        it('keeps vector the same', function() {
            let v = new Vector(1, 2, 3).scale(Vector.one);
            expect(v).to.deep.equal(new Vector(1, 2, 3));
        });
    });
    describe('#normalize', function() {
        it('normalizes vectors', function() {
            let v = new Vector(3, 0, 0).normalized();
            expect(v).to.deep.equal(new Vector(1, 0, 0));
            expect(v.magnitude()).to.be.closeTo(1, 0.01);

            v = new Vector(1, 1, 1).normalized();
            expect(v.x).to.equal(v.y);
            expect(v.magnitude()).to.be.closeTo(1, 0.01);
        });
        it('keeps zero-vectors the same', function() {
            expect(Vector.zero.normalized().magnitude(), 0);
        });
    });
    describe('#angle', function() {
        it('calculates angles', function() {
            expect(new Vector(3, 0, 0).angle(new Vector(0, 2, 0))).closeTo(90 * deg2rad, 0.01);
            expect(new Vector(2, 0, 0).angle(new Vector(-1, 0))).closeTo(180 * deg2rad, 0.01);
        });
        it('returns 0 for identical directions', function() {
            let v = new Vector(1, 2, 3);
            expect(v.angle(v)).to.closeTo(0, 0.01);
        });
    });
    describe('#cross', function() {
        it('calculates the cross product', function() {
            expect(new Vector(2, 3, 4).cross(new Vector(5, 6, 7))).to.deep.equal(new Vector(-3, 6, -3));
            expect(new Vector(1, 2, 3).cross(new Vector(1, 5, 7))).to.deep.equal(new Vector(-1, -4, 3));
        });
        it('returns null vector for input null vectors', function() {
            expect(new Vector(0, 0, 0).cross(new Vector(0, 0, 0))).to.deep.equal(new Vector(0, 0, 0));
        });
    });
    describe('#dot', function() {
        it('calculates the dot product', function() {
            expect(new Vector(1, 2, 3).dot(new Vector(1, 5, 7))).closeTo(32, 0.01);
            expect(new Vector(-1, -2, 3).dot(new Vector(4, 0, -8))).closeTo(-28, 0.01);
        });
        it('return exact values for normalized vectors', function() {
            expect(new Vector(3, 0, 0).normalized().dot(new Vector(0, 4, 0).normalized())).closeTo(0, 0.01);
        });
    });
})