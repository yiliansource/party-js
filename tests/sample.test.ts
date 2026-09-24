import { describe, expect, test } from "bun:test";
import { version } from "../src";

describe("sample", () => {
	test("has version", () => {
		expect(version).toBe("3.0.0");
	});
});
