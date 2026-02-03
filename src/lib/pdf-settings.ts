import type { inferParserType } from "nuqs";
import {
	parseAsBoolean,
	parseAsFloat,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs";

export const themeOptions = ["light", "dark"] as const;
export const pageSizeOptions = ["letter", "a4", "legal"] as const;
export const orientationOptions = ["portrait", "landscape"] as const;

export const pdfSettingsParsers = {
	font: parseAsString.withDefault("Roboto"),
	theme: parseAsStringLiteral(themeOptions).withDefault("light"),
	fontSize: parseAsInteger.withDefault(12),
	lineHeight: parseAsFloat.withDefault(1.5),
	headingScale: parseAsFloat.withDefault(1.5),
	marginTop: parseAsFloat.withDefault(1.5),
	marginRight: parseAsFloat.withDefault(1.5),
	marginBottom: parseAsFloat.withDefault(1.5),
	marginLeft: parseAsFloat.withDefault(1.5),
	pageSize: parseAsStringLiteral(pageSizeOptions).withDefault("letter"),
	orientation: parseAsStringLiteral(orientationOptions).withDefault("portrait"),
	splitByH1: parseAsBoolean.withDefault(false),
	splitByH2: parseAsBoolean.withDefault(false),
	splitByH3: parseAsBoolean.withDefault(false),
	splitByDivider: parseAsBoolean.withDefault(false),
	notionUrl: parseAsString.withDefault(""),
};

export type PdfSettings = inferParserType<typeof pdfSettingsParsers>;

export const defaultPdfSettings: PdfSettings = {
	font: "Roboto",
	theme: "light",
	fontSize: 12,
	lineHeight: 1.5,
	headingScale: 1.5,
	marginTop: 1.5,
	marginRight: 1.5,
	marginBottom: 1.5,
	marginLeft: 1.5,
	pageSize: "letter",
	orientation: "portrait",
	splitByH1: false,
	splitByH2: false,
	splitByH3: false,
	splitByDivider: false,
	notionUrl: "",
};
