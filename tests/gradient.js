// const expect = require('chai').expect;

// const Gradient = require('../dist/util/gradient').default;
// const Colour = require('../dist/util/colour').default;

// describe('Gradient', function () {
//     describe('#constructor', function() {
//         it('throws an error if no keys are passed', function() {
//             expect(() => new Gradient()).to.throw();
//         });
//     });
//     describe('#evaluate', function() {
//         it('evaluates basic gradients', function() {
//             let a = new Colour(0, 0, 0), b = new Colour(1, 1, 1);
//             const gradient = new Gradient(
//                 { colour: a, time: 0 }, 
//                 { colour: b, time: 1 }
//             );

//             let t = 0.5;
//             expect(gradient.evaluate(t).toHex()).to.equal(a.mix(b, t).toHex());
//         });
//     });
//     describe('#solid', function() {
//         it('creates gradients with the same colour at every position', function() {
//             const colour = new Colour(0.2, 0.4, 0.6);
//             const gradient = Gradient.solid(colour);
//             [0.1, 0.4, 0.7, 0.9].forEach(t => {
//                 expect(gradient.evaluate(t).toHex()).to.equal(colour.toHex());
//             })
//         });
//     });
//     describe('#simple', function() {
//         let a = new Colour(0, 0, 0), b = new Colour(1, 1, 1);
//         const gradient = new Gradient(
//             { colour: a, time: 0.25 }, 
//             { colour: b, time: 0.75 }
//         );

//         it('correctly evaluates before the first key', function() {
//             expect(gradient.evaluate(0).toHex()).to.equal(a.toHex());
//         });
//         it('correctly evaluates after the last key', function() {
//             expect(gradient.evaluate(1).toHex()).to.equal(b.toHex());
//         });
//         it('correctly evaluates between two keys', function() {
//             expect(gradient.evaluate(0.5).toHex()).to.equal(a.mix(b, 0.5).toHex());
//         });
//     });
//     describe('#advanced', function() {
//     });
// });