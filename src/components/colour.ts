import { lerp } from "../systems/math";

export default class Colour {
    get r(): number {
        return this.values[0];
    }
    set r(value: number) {
        this.values[0] = value;
    }

    get g(): number {
        return this.values[1];
    }
    set g(value: number) {
        this.values[1] = value;
    }

    get b(): number {
        return this.values[2];
    }
    set b(value: number) {
        this.values[2] = value;
    }

    set rgb(values: [number, number, number]) {
        this.values[0] = values[0];
        this.values[1] = values[1];
        this.values[2] = values[2];
    }

    constructor(r: number, g: number, b: number) {
        this.rgb = [r, g, b];
    }

    private values = new Float32Array(3);

    public static readonly white = new Colour(1, 1, 1);
    public static readonly black = new Colour(0, 0, 0);

    public mix(colour: Colour, weight = 0.5): Colour {
        return new Colour(
            lerp(this.r, colour.r, weight),
            lerp(this.g, colour.g, weight),
            lerp(this.b, colour.b, weight)
        );
    }

    public toHex(): string {
        const hex = (v: number) =>
            Math.round(v * 255)
                .toString(16)
                .padStart(2, "0");
        return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    public toString(): string {
        return "rgb(" + this.values.join(", ") + ")";
    }

    public static fromHex(hex: string): Colour {
        if (hex.startsWith("#")) {
            hex = hex.substr(1);
        }
        return new Colour(
            parseInt(hex.substr(0, 2), 16) / 255,
            parseInt(hex.substr(2, 2), 16) / 255,
            parseInt(hex.substr(4, 2), 16) / 255
        );
    }

    public static fromHsl(h: number, s: number, l: number): Colour {
        h /= 360;
        s /= 100;
        l /= 100;
        if (s === 0) {
            return new Colour(l, l, l);
        } else {
            const converter = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            return new Colour(
                converter(p, q, h + 1 / 3),
                converter(p, q, h),
                converter(p, q, h - 1 / 3)
            );
        }
    }
}
