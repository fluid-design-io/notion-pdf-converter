import { describe, expect, it } from "vitest";

import {
	highlightCodeThemes,
	mapNotionCodeLanguage,
} from "./code-highlighting";

describe("mapNotionCodeLanguage", () => {
	it("maps Notion language aliases to Shiki languages", () => {
		expect(mapNotionCodeLanguage("plain text")).toBe("text");
		expect(mapNotionCodeLanguage("shell")).toBe("bash");
		expect(mapNotionCodeLanguage("markup")).toBe("html");
		expect(mapNotionCodeLanguage("vb.net")).toBe("vb");
		expect(mapNotionCodeLanguage("visual basic")).toBe("vb");
		expect(mapNotionCodeLanguage("java/c/c++/c#")).toBe("text");
	});

	it("falls back to text for empty values", () => {
		expect(mapNotionCodeLanguage("")).toBe("text");
		expect(mapNotionCodeLanguage(undefined)).toBe("text");
	});
});

describe("highlightCodeThemes", () => {
	it("falls back to plain text when language is unsupported", async () => {
		const result = await highlightCodeThemes("alpha\nbeta", "not-a-real-language");
		expect(result.light.lines).toEqual([[{ text: "alpha" }], [{ text: "beta" }]]);
		expect(result.dark.lines).toEqual([[{ text: "alpha" }], [{ text: "beta" }]]);
	});

	it("returns a safe line structure for empty code", async () => {
		const result = await highlightCodeThemes("", "plain text");
		expect(result.light.lines.length).toBeGreaterThan(0);
		expect(result.light.lines[0]?.length).toBeGreaterThan(0);
		expect(result.light.lines[0]?.[0]?.text).toBeDefined();
	});
});
