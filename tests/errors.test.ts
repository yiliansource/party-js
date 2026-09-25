import { describe, expect, test } from "bun:test";

import { PartyJSError } from "../src/errors";

describe("PartyJSError", () => {
	test("prefixes the error message", () => {
		expect(new PartyJSError("something went wrong").message).toBe(
			"[party-js] something went wrong",
		);
	});

	test("is instance of Error", () => {
		expect(new PartyJSError("x")).toBeInstanceOf(Error);
	});

	test("reports its own name", () => {
		expect(new PartyJSError("x").name).toBe("PartyJSError");
	});
});
