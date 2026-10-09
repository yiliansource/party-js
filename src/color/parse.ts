import { clamp, clamp01 } from "../math/scalar";
import type { Color } from "./color";

const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/;
const FUNCTION = /^(rgba?|hsla?|oklab|oklch)\((.*)\)$/;
const TOKEN =
	/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(%|deg|rad|grad|turn)?$/;

const ANGLE_UNITS: Record<string, number> = {
	"": 1,
	deg: 1,
	rad: 180 / Math.PI,
	grad: 0.9,
	turn: 360,
};

// see https://drafts.csswg.org/css-color-4/conversions.js for the lin_sRGB implementation
const sRGB2lin = (c: number) =>
	c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

/**
 * Resolves a plain number or percentage token.
 * `percent` is the value that 100% should map to.
 * Any other unit yields NaN.
 */
function number(token: string, percent: number): number {
	if (token === "none") return 0;

	const match = TOKEN.exec(token);
	if (!match) return Number.NaN;

	const value = Number(match[1]);
	if (!match[2]) return value;

	return match[2] === "%" ? (value / 100) * percent : Number.NaN;
}

/**
 * Resolves an angle token to degrees. Percentages yield NaN.
 */
function angle(token: string): number {
	if (token === "none") return 0;

	const match = TOKEN.exec(token);
	const factor = match && ANGLE_UNITS[match[2] ?? ""];
	return factor ? +match[1] * factor : Number.NaN;
}

/**
 * Converts gamma-encoded sRGB channels in [0, 1] to Oklab.
 *
 * Full-precision constants are taken from culori (MIT).
 *
 * @see https://bottosson.github.io/posts/oklab/#converting-from-linear-srgb-to-oklab
 * @see https://github.com/Evercoder/culori
 */
function srgbToOklab(r: number, g: number, b: number, alpha: number): Color {
	const lr = sRGB2lin(r);
	const lg = sRGB2lin(g);
	const lb = sRGB2lin(b);

	const l = Math.cbrt(
		0.412221469470763 * lr +
			0.5363325372617348 * lg +
			0.0514459932675022 * lb,
	);
	const m = Math.cbrt(
		0.2119034958178252 * lr +
			0.6806995506452344 * lg +
			0.1073969535369406 * lb,
	);
	const s = Math.cbrt(
		0.0883024591900564 * lr +
			0.2817188391361215 * lg +
			0.6299787016738222 * lb,
	);

	return {
		l:
			0.210454268309314 * l +
			0.7936177747023054 * m -
			0.0040720430116193 * s,
		a:
			1.9779985324311684 * l -
			2.4285922420485799 * m +
			0.450593709617411 * s,
		b:
			0.0259040424655478 * l +
			0.7827717124575296 * m -
			0.8086757549230774 * s,
		alpha,
	};
}

/**
 * Converts HSL (hue in degrees, saturation and lightness in [0, 1]) to gamma-encoded sRGB channels in [0, 1].
 *
 * @see https://drafts.csswg.org/css-color-4/hslToRgb.js
 */
function hslToSrgb(h: number, s: number, l: number): [number, number, number] {
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (((n + h / 30) % 12) + 12) % 12;
		return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
	};
	return [f(0), f(8), f(4)];
}

/**
 * Splits the arguments of a color function into its three channel tokens and an optional alpha token.
 * Returns undefined if the arguments are malformed.
 */
function splitArgs(args: string, allowLegacy: boolean): string[] | undefined {
	if (args.includes(",")) {
		if (!allowLegacy) return;

		const parts = args.split(",").map((p) => p.trim());
		if (parts.length < 3 || parts.length > 4) return;
		if (parts.some((p) => !p || /\s|\//.test(p) || p === "none")) return;

		return parts;
	}

	const [channels, alpha, ...rest] = args.split("/");
	if (rest.length) return;

	const parts = channels.trim().split(/\s+/);
	if (parts.length !== 3) return;

	if (alpha !== undefined) {
		const a = alpha.trim();
		if (!a || /\s/.test(a)) return;

		parts.push(a);
	}

	return parts;
}

function parseHex(hex: string): Color {
	const digits = (
		hex.length < 5 ? hex.replace(/./g, (d) => d + d) : hex
	).padEnd(8, "f");

	const channel = (i: number) =>
		Number.parseInt(digits.slice(i * 2, i * 2 + 2), 16) / 255;

	return srgbToOklab(channel(0), channel(1), channel(2), channel(3));
}

function parseFunction(name: string, args: string): Color | undefined {
	const isLegacyCapable = name[0] !== "o"; // is not oklab or oklch
	const tokens = splitArgs(args, isLegacyCapable);
	if (!tokens) return;

	const [t0, t1, t2, t3] = tokens;
	const alpha = t3 === undefined ? 1 : clamp01(number(t3, 1));
	let color: Color;

	if (name.startsWith("rgb")) {
		const channel = (t: string) => clamp(number(t, 255), 0, 255) / 255;
		color = srgbToOklab(channel(t0), channel(t1), channel(t2), alpha);
	} else if (name.startsWith("hsl")) {
		const percent = (t: string) => clamp(number(t, 100), 0, 100) / 100;
		const [r, g, b] = hslToSrgb(angle(t0), percent(t1), percent(t2));
		color = srgbToOklab(r, g, b, alpha);
	} else {
		const l = clamp01(number(t0, 1));
		if (name === "oklab") {
			color = { l, a: number(t1, 0.4), b: number(t2, 0.4), alpha };
		} else {
			const c = Math.max(0, number(t1, 0.4));
			const h = (angle(t2) * Math.PI) / 180;
			color = { l, a: c * Math.cos(h), b: c * Math.sin(h), alpha };
		}
	}

	// any malformed token resolves to NaN, which propagates through every
	// conversion above, so checking the output is enough
	const { l, a, b } = color;
	if (Number.isNaN(l + a + b + alpha)) return;

	return color;
}

/**
 * Parses a CSS color string into an Oklab color.
 *
 * Supports hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), `rgb()`/`rgba()`,
 * `hsl()`/`hsla()`, `oklab()` and `oklch()` following CSS Color 4 syntax.
 * Named colors are not supported.
 *
 * Returns `undefined` if the input could not be parsed.
 *
 * @see https://www.w3.org/TR/css-color-4/
 */
export function parse(input: string): Color | undefined {
	const str = input.trim().toLowerCase();

	const hex = HEX.exec(str);
	if (hex) return parseHex(hex[1]);

	const fn = FUNCTION.exec(str);
	if (fn) return parseFunction(fn[1], fn[2]);
}
