import { bundledLanguages, createHighlighter } from "shiki";

export type HighlightSegment = {
	text: string;
	color?: string;
	fontStyle?: "italic";
	fontWeight?: 700;
	textDecoration?: "underline";
};

export type HighlightLine = HighlightSegment[];

export type HighlightDoc = {
	lines: HighlightLine[];
};

export type CodeHighlightThemes = {
	light: HighlightDoc;
	dark: HighlightDoc;
};

type CachedHighlighter = Awaited<ReturnType<typeof createHighlighter>>;

let highlighterPromise: Promise<CachedHighlighter> | null = null;

const SHIKI_THEMES = {
	light: "github-light",
	dark: "github-dark",
} as const;

const SHIKI_LANGS = [
	"text",
] as const;

const loadedLanguages = new Set<string>(SHIKI_LANGS);
const bundledLanguageNames = new Set<string>(Object.keys(bundledLanguages));

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: [SHIKI_THEMES.light, SHIKI_THEMES.dark],
			langs: [...SHIKI_LANGS],
		});
	}
	return highlighterPromise;
}

async function ensureLanguageLoaded(lang: string) {
	if (loadedLanguages.has(lang)) return;
	if (!bundledLanguageNames.has(lang)) return;

	const highlighter = await getHighlighter();
	await highlighter.loadLanguage(
		lang as Parameters<CachedHighlighter["loadLanguage"]>[0],
	);
	loadedLanguages.add(lang);
}

export function mapNotionCodeLanguage(language: string | null | undefined): string {
	const normalized = language?.trim().toLowerCase();
	if (!normalized) return "text";

	switch (normalized) {
		case "plain text":
			return "text";
		case "shell":
			return "bash";
		case "markup":
			return "html";
		case "vb.net":
		case "visual basic":
			return "vb";
		case "java/c/c++/c#":
			return "text";
		default:
			return normalized;
	}
}

export function normalizeCodeText(text: string): string {
	return text.replace(/\r\n?/g, "\n").replace(/\t/g, "    ");
}

export function getPlainHighlightDoc(text: string): HighlightDoc {
	const lines = normalizeCodeText(text).split("\n");
	return {
		lines: lines.map((line) => [{ text: line }]),
	};
}

function shikiFontStyleToSegmentStyle(fontStyle: number): Omit<
	HighlightSegment,
	"text" | "color"
> {
	return {
		...(fontStyle & 1 ? { fontStyle: "italic" as const } : {}),
		...(fontStyle & 2 ? { fontWeight: 700 as const } : {}),
		...(fontStyle & 4 ? { textDecoration: "underline" as const } : {}),
	};
}

async function codeToHighlightDoc(
	code: string,
	lang: string,
	theme: (typeof SHIKI_THEMES)[keyof typeof SHIKI_THEMES],
): Promise<HighlightDoc> {
	const normalizedCode = normalizeCodeText(code);
	if (normalizedCode.length === 0) {
		return { lines: [[{ text: "" }]] };
	}

	const highlighter = await getHighlighter();
	const tokenized = highlighter.codeToTokens(normalizedCode, {
		lang: lang as Parameters<typeof highlighter.codeToTokens>[1]["lang"],
		theme,
	});

	return {
		lines: tokenized.tokens.map((line) =>
			line.map((token) => ({
				text: token.content,
				...(token.color ? { color: token.color } : {}),
				...shikiFontStyleToSegmentStyle(token.fontStyle ?? 0),
			})),
		),
	};
}

export async function highlightCodeThemes(
	code: string,
	notionLanguage: string | null | undefined,
): Promise<CodeHighlightThemes> {
	const normalizedCode = normalizeCodeText(code);
	const mappedLanguage = mapNotionCodeLanguage(notionLanguage);

	if (mappedLanguage !== "text" && !bundledLanguageNames.has(mappedLanguage)) {
		const fallback = getPlainHighlightDoc(normalizedCode);
		return {
			light: fallback,
			dark: fallback,
		};
	}

	try {
		await ensureLanguageLoaded(mappedLanguage);
		const [light, dark] = await Promise.all([
			codeToHighlightDoc(normalizedCode, mappedLanguage, SHIKI_THEMES.light),
			codeToHighlightDoc(normalizedCode, mappedLanguage, SHIKI_THEMES.dark),
		]);
		return { light, dark };
	} catch {
		const fallback = getPlainHighlightDoc(normalizedCode);
		return {
			light: fallback,
			dark: fallback,
		};
	}
}
