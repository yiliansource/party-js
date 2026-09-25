export class PartyJSError extends Error {
	constructor(message: string) {
		super(`[party-js] ${message}`);
		this.name = "PartyJSError";
	}
}
