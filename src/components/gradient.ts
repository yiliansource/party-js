import { Color } from "./";
import { Spline } from "./spline";

/**
 * Represents a gradient that can be used to interpolate between multiple color.
 */
export class Gradient extends Spline<Color> {
    /**
     * Interpolates between two color on the gradient.
     */
    protected interpolate(a: Color, b: Color, t: number): Color {
        return a.mix(b, t);
    }

    /**
     * Returns a solid gradient from the given color.
     */
    public static solid(color: Color): Gradient {
        return new Gradient({ value: color, time: 0.5 });
    }

    /**
     * Returns a gradient with evenly spaced keys from the given colors.
     */
    public static simple(...colors: Color[]): Gradient {
        const step = 1 / (colors.length - 1);
        return new Gradient(
            ...colors.map((color, index) => ({
                value: color,
                time: index * step,
            }))
        );
    }
}
