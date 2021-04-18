/**
 * Replaces the supplied defaults with the properties specified in the overrides.
 * This returns a new object.
 */
export function overrideDefaults<T>(defaults: T, overrides?: Partial<T>): T {
    return Object.assign({}, defaults, overrides);
}
