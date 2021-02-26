// const expect = require('chai').expect;

// const Colour = require('../dist/util/colour').default;

// describe('Colour', function () {
//     describe('#construction', function() {
//         it('creates colours from arguments', function() {
//             let c = new Colour(0.5, 0.2, 0.1);
//             expect(c.r).to.be.closeTo(0.5, 0.01);
//             expect(c.g).to.be.closeTo(0.2, 0.01);
//             expect(c.b).to.be.closeTo(0.1, 0.01);
//         });
//     });
//     describe('#mix', function() {
//         it('mixes colours together halfway by default', function() {
//             expect(new Colour(0, 0.1, 0.2).mix(new Colour(1, 0.9, 0.8))).to.deep.equal(new Colour(0.5, 0.5, 0.5));
//         });
//         it('mixes colours by weight', function() {
//             expect(new Colour(0, 0, 0).mix(new Colour(1, 0.8, 0.6), 0.25)).to.deep.equal(new Colour(0.25, 0.2, 0.15));
//         });
//         it('doesnt mix when weight is zero', function() {
//             expect(new Colour(0.25, 0.3, 0.1).mix(new Colour(0.73, 0.2, 0.5), 0)).to.deep.equal(new Colour(0.25, 0.3, 0.1));
//         });
//     });
//     describe('#hex', function() {
//         it('creates colours from hex strings', function() {
//             expect(Colour.fromHex('#ff00ff')).to.deep.equal(new Colour(1, 0, 1));
//             expect(Colour.fromHex('#f1de4f')).to.deep.equal(new Colour(241 / 255, 222 / 255, 79 / 255));
//         });
//         it('converts colours to hex strings', function() {
//             const hexes = ['#f1de4f', '#3c557a', '#a9dba4'];
//             for (let hex of hexes) {
//                 expect(Colour.fromHex(hex).toHex()).to.equal(hex);
//             }
//         });
//     });
//     describe('#hsl', function() {
//         it('creates colours from hsl values', function() {
//             let c = Colour.fromHsl(115, 43, 75);
//             expect(c.r).to.be.closeTo(169 / 255, 0.01);
//             expect(c.g).to.be.closeTo(219 / 255, 0.01);
//             expect(c.b).to.be.closeTo(164 / 255, 0.01);
//         });
//     });
// });