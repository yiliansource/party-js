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
 *     confetti(button, { colors: gradient([]) });
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

/**
 * Quotes strings, so that, for example, `"5"` and `5` can be told apart.
 */
const show = (value: unknown): string =>
	typeof value === "string" ? JSON.stringify(value) : String(value);

/**
 * Builds the error for an option whose value breaks a rule, in the form "`where` must be `rule`, got `value`".
 */
export function invalidOption(
	where: string,
	rule: string,
	value: unknown,
): PartyJSError {
	return new PartyJSError(`${where} must be ${rule}, got ${show(value)}`);
}

/**
 * Asserts that the code is running in a browser environment.
 */
export function assertBrowser(): void {
	if (typeof document === "undefined") {
		throw new PartyJSError(
			"effects need a browser: start them from an event handler or after your component has mounted, not during server-side rendering",
		);
	}
}
