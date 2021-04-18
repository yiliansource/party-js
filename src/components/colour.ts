import { lerp } from "../systems/math";

/**
 * Represents a colour consisting of RGB values.
 * The components of the colour are represented as
 * integers in the range 0 to 255.
 *
 * @example
 * ```ts
 * const a = new Colour(12, 59, 219);
 * const b = Colour.fromHex("#ffa68d");
 * const result = a.mix(b);
 * ```
 */
export class Colour {
    /**
     * Returns the r-component of the colour.
     */
    get r(): number {
        return this.values[0];
    }
    /**
     * Modifies the r-component of the colour.
     * Note that this also floors the value.
     */
    set r(value: number) {
        this.values[0] = Math.floor(value);
    }

    /**
     * Returns the g-component of the colour.
     */
    get g(): number {
        return this.values[1];
    }
    /**
     * Modifies the g-component of the colour.
     * Note that this also floors the value.
     */
    set g(value: number) {
        this.values[1] = Math.floor(value);
    }

    /**
     * Returns the b-component of the colour.
     * Note that this also floors the value.
     */
    get b(): number {
        return this.values[2];
    }
    /**
     * Modifies the b-component of the colour.
     */
    set b(value: number) {
        this.values[2] = Math.floor(value);
    }

    /**
     * Returns the rgb-components of the colour, bundled as a copied array.
     */
    get rgb(): [number, number, number] {
        return [this.r, this.g, this.b];
    }
    /**
     * Simultaneously updates the rgb-components of the colour, by passing an array.
     */
    set rgb(values: [number, number, number]) {
        this.r = values[0];
        this.g = values[1];
        this.b = values[2];
    }

    private values = new Float32Array(3);

    /**
     * Creates a new colour instance from the specified RGB components.
     */
    constructor(r: number, g: number, b: number) {
        this.rgb = [r, g, b];
    }

    /**
     * Returns (1, 1, 1).
     */
    public static readonly white = new Colour(255, 255, 255);
    /**
     * Returns (0, 0, 0).
     */
    public static readonly black = new Colour(0, 0, 0);

    /**
     * Mixes the two colours together with an optional mixing weight.
     * This weight is 0.5 by default, perfectly averaging the colours.
     */
    public mix(colour: Colour, weight = 0.5): Colour {
        return new Colour(
            lerp(this.r, colour.r, weight),
            lerp(this.g, colour.g, weight),
            lerp(this.b, colour.b, weight)
        );
    }

    /**
     * Returns the hexadecimal representation of the colour, prefixed by '#'.
     */
    public toHex(): string {
        const hex = (v: number) => v.toString(16).padStart(2, "0");
        return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    /**
     * Returns a formatted representation of the colour.
     */
    public toString(): string {
        return "rgb(" + this.values.join(", ") + ")";
    }

    /**
     * Creates a colour from the specified hexadecimal string.
     * This string can optionally be prefixed by '#'.
     */
    public static fromHex(hex: string): Colour {
        if (hex.startsWith("#")) {
            hex = hex.substr(1);
        }
        return new Colour(
            parseInt(hex.substr(0, 2), 16),
            parseInt(hex.substr(2, 2), 16),
            parseInt(hex.substr(4, 2), 16)
        );
    }

    /**
     * Creates a colour from the specified HSL components.
     *
     * @see https://stackoverflow.com/a/9493060/5507624
     */
    public static fromHsl(h: number, s: number, l: number): Colour {
        h /= 360;
        s /= 100;
        l /= 100;
        if (s === 0) {
            return new Colour(l, l, l);
        } else {
            const hue2rgb = (p: number, q: number, t: number): number => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const to255 = (v: number): number => Math.min(255, 256 * v);

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            return new Colour(
                to255(hue2rgb(p, q, h + 1 / 3)),
                to255(hue2rgb(p, q, h)),
                to255(hue2rgb(p, q, h - 1 / 3))
            );
        }
    }
}
