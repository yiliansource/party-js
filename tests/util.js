const { expect } = require("chai");

/**
 * Utility method to run chai's `expect(...).to.be.closeTo(...)` on every
 * element in an array.
 *
 * @param {number[]} a The array that should be checked.
 * @param {number[]} b The array to check against.
 * @param {number} delta The maximum allowed delta.
 */
module.exports.expectArrayCloseTo = function (a, b, delta) {
    expect(a.length).to.equal(b.length);
    for (let i = 0; i < a.length; i++) {
        expect(a[i]).to.be.closeTo(b[i], delta);
    }
};
