// const expect = require('chai').expect;

// const math = require('../dist/util/math');

// describe('Math', function () {
//     describe('#lerp(a, b, t)', function () {
//         it('correctly lerps values', function() {
//             expect(math.lerp(1, 3, 0.5)).to.equal(2);
//         });
//         it('lerps unclamped values', function() {
//             expect(math.lerp(3, 7, 2)).to.equal(11);
//         });
//         it('lerps negative values', function() {
//             expect(math.lerp(-8, -4, 0.5)).to.equal(-6);
//         });
//     });
//     describe('#clamp(value, min, max)', function() {
//         it('correctly upper clamps values', function() {
//             expect(math.clamp(8, 1, 3)).to.equal(3);
//         });
//         it('correctly lower clamps values', function() {
//             expect(math.clamp(3, 5, 10)).to.equal(5);
//         });
//         it('leaves values untouched', function() {
//             expect(math.clamp(3, 0, 5)).to.equal(3);
//         });
//     });
// });