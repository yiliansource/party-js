export class ReadError extends Error {}

export function ensure(condition: boolean, reason: string): void {
	if (!condition) throw new ReadError(reason);
}

export function expect<T>(
	value: T | undefined | null | false,
	reason: string,
): T {
	if (value === undefined || value === null || value === false)
		throw new ReadError(reason);
	return value;
}

export type AttemptResult<T> = { value: T } | { reason: string };

export function attempt<T>(read: () => T): AttemptResult<T> {
	try {
		return { value: read() };
	} catch (error) {
		if (error instanceof ReadError) return { reason: error.message };
		throw error;
	}
}
