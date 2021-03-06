import { Colour } from "./colour";
import { Spline } from "./spline";

/**
 * Represents a gradient that can be used to interpolate between multiple colours.
 */
export class Gradient extends Spline<Colour> {
    /**
     * Interpolates between two colours on the gradient.
     */
    protected interpolate(a: Colour, b: Colour, t: number): Colour {
        return a.mix(b, t);
    }

    /**
     * Returns a solid gradient from the given colour.
     */
    public static solid(colour: Colour): Gradient {
        return new Gradient({ value: colour, time: 0.5 });
    }

    /**
     * Returns a gradient with evenly spaced keys from the given colours.
     */
    public static simple(...colours: Colour[]): Gradient {
        const step = 1 / (colours.length - 1);
        return new Gradient(
            ...colours.map((colour, index) => ({
                value: colour,
                time: index * step,
            }))
        );
    }
}
