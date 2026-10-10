/**
 * The error party.js throws when it's given invalid input, for example a color string it cannot parse.
 *
 * Its error message is prefixed with `[party-js]`.
 *
 * @summary The error party.js throws for invalid input.
 *
 * @example
 * ```ts
 * try {
 *     confetti(button, { colors: ["not-a-color"] });
 * } catch (error) {
 *     if (error instanceof PartyJSError) showHint(error.message);
 *     else throw error;
 * }
 * ```
 *
 * @group Utilities
 */
export class PartyJSError extends Error {
	constructor(message: string) {
		super(`[party-js] ${message}`);
		this.name = "PartyJSError";
	}
}
