import { invlerp } from "../systems/math";

/**
 * Represents a key on a spline.
 */
export interface SplineKey<T> {
    /**
     * The value of the key.
     */
    value: T;
    /**
     * The position of the key.
     */
    time: number;
}

/**
 * Represents a spline that can be used to continueously evaluate a function
 * between keys. The base implementation is kept generic, so the functionality
 * can easily be implemented for similar constructs, such as gradients.
 */
export abstract class Spline<T> {
    /**
     * The keys in the gradient. Note that these are not sorted.
     */
    protected keys: Array<SplineKey<T>>;

    /**
     * Creates a new spline instance, using the specified keys.
     * Note that you have to pass at least one key.
     */
    constructor(...keys: Array<SplineKey<T>>) {
        if (keys.length === 0) {
            throw new Error("Splines require at least one key.");
        }
        if (Array.isArray(keys[0])) {
            throw new Error(
                "You are trying to pass an array to the spline constructor, which is not supported. " +
                    "Try to spread the array into the constructor instead."
            );
        }
        this.keys = keys;
    }

    /**
     * Evaluates the spline at the given time.
     */
    public evaluate(time: number): T {
        if (this.keys.length === 0) {
            throw new Error("Attempt to evaluate a spline with no keys.");
        }

        if (this.keys.length === 1) {
            // The spline only contains one key, therefore is constant.
            return this.keys[0].value;
        }

        // Sort the keys and figure out the first key above the passed time.
        const ascendingKeys = this.keys.sort((a, b) => a.time - b.time);
        const upperKeyIndex = ascendingKeys.findIndex((g) => g.time > time);

        // If the found index is either 0 or -1, the specified time falls out
        // of the range of the supplied keys. In that case, the value of the
        // nearest applicant key is returned.
        if (upperKeyIndex === 0) {
            return ascendingKeys[0].value;
        }
        if (upperKeyIndex === -1) {
            return ascendingKeys[ascendingKeys.length - 1].value;
        }

        // Otherwise, find the bounding keys, and extrapolate the time between
        // the two. This is then used to interpolate between the two keys,
        // using the provided implementation.
        const lowerKey = ascendingKeys[upperKeyIndex - 1];
        const upperKey = ascendingKeys[upperKeyIndex];
        const containedTime = invlerp(lowerKey.time, upperKey.time, time);

        return this.interpolate(lowerKey.value, upperKey.value, containedTime);
    }

    /**
     * Interpolates using the values of two keys.
     */
    protected abstract interpolate(a: T, b: T, t: number): T;
}
