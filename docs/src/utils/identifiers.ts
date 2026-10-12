const WORD_START = /(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/;

export function splitIdentifier(name: string): string[] {
	return name.split(WORD_START);
}
