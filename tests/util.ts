import { expect } from "chai";

/**
 * Utility method to run chai's `expect(...).to.be.closeTo(...)` on every
 * element in an array.
 *
 * @param a The array that should be checked.
 * @param b The array to check against.
 * @param delta The maximum allowed delta.
 */
export function expectArrayCloseTo(
    a: number[],
    b: number[],
    delta: number
): void {
    expect(a.length).to.equal(b.length);
    for (let i = 0; i < a.length; i++) {
        expect(a[i]).to.be.closeTo(b[i], delta);
    }
}
