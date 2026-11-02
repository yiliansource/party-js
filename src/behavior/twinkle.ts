import type { Color } from "../color/color";
import { invalidOption } from "../errors";
import type { Behavior } from "./behavior";

/**
 * Options for {@link twinkle | twinkle()}.
 *
 * @summary How often and how strongly particles twinkle.
 *
 * @group Behaviors
 */
export interface TwinkleOptions {
	/**
	 * How many glints a particle catches per second, on average. A particle that lives for one second with the default
	 * of 1.5 glints once or twice, at random moments.
	 *
	 * @defaultValue 1.5
	 */
	glints?: number;
	/**
	 * How long a single glint lasts, from start to end, in seconds. Longer glints look softer.
	 *
	 * @defaultValue 0.22
	 */
	length?: number;
	/**
	 * How much a particle grows at the peak of a glint, relative to its size. `0.25` makes it 25% larger.
	 *
	 * @defaultValue 0.25
	 */
	size?: number;
	/**
	 * How far a particle's color moves towards white at the peak of a glint, from 0 (not at all) to 1 (fully white).
	 *
	 * @defaultValue 0.6
	 */
	brightness?: number;
}

interface TwinkleState {
	times: number[];
	baseSize: number;
	baseColor: Color;
	size: number;
	color: Color;
}

/**
 * Creates a behavior that makes particles twinkle occasionally.
 *
 * Each particle glints a few times during its life, at random moments: for a short while, it grows a little and
 * flashes towards white, then settles back. Between glints, it looks as it would without this behavior.
 *
 * The glint is applied on top of the particle's size and color, so it works together with behaviors that change
 * them. List it after {@link scale | scale()}, which sets the size from scratch on every step and would otherwise
 * overwrite the glint.
 *
 * @param options - How often and how strongly particles glint. See {@link TwinkleOptions}.
 *
 * @throws {@link PartyJSError} If an option is out of range.
 *
 * @summary Makes particles glint now and then, like glitter.
 *
 * @example
 * ```ts
 * const behaviors = [scale(0.05, 0.25), twinkle({ glints: 2, brightness: 0.8 })];
 * ```
 *
 * @group Behaviors
 */
export function twinkle(options: TwinkleOptions = {}): Behavior {
	const {
		glints = 1.5,
		length = 0.22,
		size = 0.25,
		brightness = 0.6,
	} = options;

	if (!(glints >= 0 && Number.isFinite(glints)))
		throw invalidOption(
			"twinkle glints",
			"a finite number of at least 0",
			glints,
		);
	if (!(length > 0 && Number.isFinite(length)))
		throw invalidOption(
			"twinkle length",
			"a positive, finite number",
			length,
		);
	if (!(size >= 0 && Number.isFinite(size)))
		throw invalidOption(
			"twinkle size",
			"a finite number of at least 0",
			size,
		);
	if (!(brightness >= 0 && brightness <= 1))
		throw invalidOption(
			"twinkle brightness",
			"between 0 and 1",
			brightness,
		);

	const STATE = Symbol("twinkle");
	// the glint is a bell curve, and nearly all of it lies within two standard deviations to either side
	const sigma = length / 4;

	return {
		init(particle, ctx) {
			const count = Math.floor(glints * particle.lifetime + ctx.rng());
			const times: number[] = [];
			for (let i = 0; i < count; i++)
				times.push(ctx.rng() * particle.lifetime);

			const state: TwinkleState = {
				times,
				baseSize: particle.size,
				baseColor: particle.color,
				size: particle.size,
				color: particle.color,
			};
			particle.data.set(STATE, state);
		},
		update(particle) {
			const state = particle.data.get(STATE) as TwinkleState;

			// whatever another behavior has set since the last step becomes the new base, so the glint isn't
			// applied twice when nothing resets the value, and isn't lost when something does
			if (particle.size !== state.size) state.baseSize = particle.size;
			const c = particle.color;
			const last = state.color;
			if (c.l !== last.l || c.a !== last.a || c.b !== last.b)
				state.baseColor = c;

			let glint = 0;
			for (const time of state.times) {
				const z = (particle.age - time) / sigma;
				glint = Math.max(glint, Math.exp((-z * z) / 2));
			}

			const base = state.baseColor;
			const white = brightness * glint;
			const chroma = 1 - 0.7 * white;

			state.size = particle.size = state.baseSize * (1 + size * glint);
			state.color = particle.color = {
				l: base.l + (1 - base.l) * white,
				a: base.a * chroma,
				b: base.b * chroma,
				alpha: c.alpha,
			};
		},
	};
}
