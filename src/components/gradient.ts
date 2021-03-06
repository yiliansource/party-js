import { invlerp } from "../systems/math";
import { Colour } from "./colour";

/**
 * Represents a key on a gradient.
 */
export interface GradientKey {
    /**
     * The colour of the key.
     */
    colour: Colour;
    /**
     * The position of the key.
     */
    time: number;
}

/**
 * Represents a gradient that can be used to interpolate between multiple colours.
 */
export class Gradient {
    private keys: GradientKey[] = [];

    /**
     * Creates a new gradient from the specified keys.
     */
    constructor(...keys: GradientKey[]) {
        if (keys.length === 0) {
            throw new Error("Gradients require atleast one key.");
        }
        if (Array.isArray(keys[0])) {
            throw new Error(
                "You are trying to pass an array to the gradient constructor, which is not supported. " +
                    "Try to spread the array into the constructor instead."
            );
        }
        this.keys = keys;
    }

    /**
     * Evaluates the gradient at the given time.
     */
    public evaluate(time: number): Colour {
        if (this.keys.length === 0) {
            throw new Error("Attempt to evaluate gradient with no keys.");
        }

        if (this.keys.length === 1) {
            // The gradient only contains one key, is therefore solid.
            return this.keys[0].colour;
        }

        const ascendingKeys = this.keys.sort((a, b) => a.time - b.time);
        const upperKeyIndex = ascendingKeys.findIndex((g) => g.time > time);

        if (upperKeyIndex === -1) {
            // The requested time exceeds the last key, therefore return the last solid key.
            return ascendingKeys[ascendingKeys.length - 1].colour;
        }
        if (upperKeyIndex === 0) {
            // The requested time comes before any key, therefore return the first solid key.
            return ascendingKeys[0].colour;
        }

        // Find the bounding keys and inversely interpolate to figure out the point we need to sample between them.
        const lowerKey = ascendingKeys[upperKeyIndex - 1];
        const upperKey = ascendingKeys[upperKeyIndex];
        const t = invlerp(lowerKey.time, upperKey.time, time);

        return lowerKey.colour.mix(upperKey.colour, t);
    }

    /**
     * Returns a solid gradient from the given colour.
     */
    public static solid(colour: Colour): Gradient {
        return new Gradient({ colour, time: 0.5 });
    }

    /**
     * Returns a gradient with evenly spaced keys from the given colours.
     */
    public static simple(...colours: Colour[]): Gradient {
        const step = 1 / (colours.length - 1);
        return new Gradient(
            ...colours.map((colour, index) => ({
                colour,
                time: index * step,
            }))
        );
    }
}
