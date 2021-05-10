import { lerp } from "../systems/math";

/**
 * Represents a color consisting of RGB values. The components of it are
 * represented as integers in the range 0 to 255.
 *
 * @example
 * ```ts
 * const a = new Color(12, 59, 219);
 * const b = Color.fromHex("#ffa68d");
 * const result = a.mix(b);
 * ```
 */
export class Color {
    /**
     * Returns the r-component of the color.
     */
    get r(): number {
        return this.values[0];
    }
    /**
     * Modifies the r-component of the color.
     * Note that this also floors the value.
     */
    set r(value: number) {
        this.values[0] = Math.floor(value);
    }

    /**
     * Returns the g-component of the color.
     */
    get g(): number {
        return this.values[1];
    }
    /**
     * Modifies the g-component of the color.
     * Note that this also floors the value.
     */
    set g(value: number) {
        this.values[1] = Math.floor(value);
    }

    /**
     * Returns the b-component of the color.
     * Note that this also floors the value.
     */
    get b(): number {
        return this.values[2];
    }
    /**
     * Modifies the b-component of the color.
     */
    set b(value: number) {
        this.values[2] = Math.floor(value);
    }

    /**
     * Returns the rgb-components of the color, bundled as a copied array.
     */
    get rgb(): [number, number, number] {
        return [this.r, this.g, this.b];
    }
    /**
     * Simultaneously updates the rgb-components of the color, by passing an array.
     */
    set rgb(values: [number, number, number]) {
        this.r = values[0];
        this.g = values[1];
        this.b = values[2];
    }

    private values = new Float32Array(3);

    /**
     * Creates a new color instance from the specified RGB components.
     */
    constructor(r: number, g: number, b: number) {
        this.rgb = [r, g, b];
    }

    /**
     * Returns (1, 1, 1).
     */
    public static readonly white = new Color(255, 255, 255);
    /**
     * Returns (0, 0, 0).
     */
    public static readonly black = new Color(0, 0, 0);

    /**
     * Mixes the two color together with an optional mixing weight.
     * This weight is 0.5 by default, perfectly averaging the color.
     */
    public mix(color: Color, weight = 0.5): Color {
        return new Color(
            lerp(this.r, color.r, weight),
            lerp(this.g, color.g, weight),
            lerp(this.b, color.b, weight)
        );
    }

    /**
     * Returns the hexadecimal representation of the color, prefixed by '#'.
     */
    public toHex(): string {
        const hex = (v: number) => v.toString(16).padStart(2, "0");
        return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    /**
     * Returns a formatted representation of the color.
     */
    public toString(): string {
        return "rgb(" + this.values.join(", ") + ")";
    }

    /**
     * Creates a color from the specified hexadecimal string.
     * This string can optionally be prefixed by '#'.
     */
    public static fromHex(hex: string): Color {
        if (hex.startsWith("#")) {
            hex = hex.substr(1);
        }
        return new Color(
            parseInt(hex.substr(0, 2), 16),
            parseInt(hex.substr(2, 2), 16),
            parseInt(hex.substr(4, 2), 16)
        );
    }

    /**
     * Creates a color from the specified HSL components.
     *
     * @see https://stackoverflow.com/a/9493060/5507624
     */
    public static fromHsl(h: number, s: number, l: number): Color {
        h /= 360;
        s /= 100;
        l /= 100;
        if (s === 0) {
            return new Color(l, l, l);
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

            return new Color(
                to255(hue2rgb(p, q, h + 1 / 3)),
                to255(hue2rgb(p, q, h)),
                to255(hue2rgb(p, q, h - 1 / 3))
            );
        }
    }
}
