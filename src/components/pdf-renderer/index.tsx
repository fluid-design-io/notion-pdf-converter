import { FONTS } from "@/lib/fonts";
import type { PdfSettings } from "@/lib/pdf-settings";

import type { PageProps } from "@react-pdf/renderer";
import {
	Document,
	Font,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { NotionRenderer } from "./notion-renderer";
import { COLORS } from "./styles";
import type { NotionBlock } from "./types";

const defaultPageStyle = StyleSheet.create({
	page: { fontSize: 12, color: "#0f172a" },
});

const POINTS_PER_CM = 28.3465;

type HeaderFooterContent = PdfSettings["headerLeftContent"];

type HeaderFooterSide = {
	enabled: boolean;
	content: HeaderFooterContent;
	customText: string;
};
type PdfDocumentProps = {
	title: string;
	blocks: NotionBlock[];
	settings: PdfSettings;
};

// Register monospace font (400 and 700 only for code blocks)
Font.register({
	family: "Monospace",
	fonts: [
		{
			src: "https://cdn.jsdelivr.net/fontsource/fonts/monaspace-neon@latest/latin-400-normal.woff",
			fontWeight: 400,
		},
		{
			src: "https://cdn.jsdelivr.net/fontsource/fonts/monaspace-neon@latest/latin-700-normal.woff",
			fontWeight: 700,
		},
	],
});

export function PdfDocument({ title, blocks, settings }: PdfDocumentProps) {
	const activeFont = FONTS.find((font) => font.family === settings.font);
	if (activeFont) {
		Font.register({
			family: activeFont.family,
			fonts: [...activeFont.fonts],
		});
	}
	const colors = COLORS[settings.theme];
	const marginTop = settings.marginTop * POINTS_PER_CM;
	const marginRight = settings.marginRight * POINTS_PER_CM;
	const marginBottom = settings.marginBottom * POINTS_PER_CM;
	const marginLeft = settings.marginLeft * POINTS_PER_CM;
	const headerLeft: HeaderFooterSide = {
		enabled: settings.headerLeftEnabled,
		content: settings.headerLeftContent,
		customText: settings.headerLeftCustomText,
	};
	const headerRight: HeaderFooterSide = {
		enabled: settings.headerRightEnabled,
		content: settings.headerRightContent,
		customText: settings.headerRightCustomText,
	};
	const footerLeft: HeaderFooterSide = {
		enabled: settings.footerLeftEnabled,
		content: settings.footerLeftContent,
		customText: settings.footerLeftCustomText,
	};
	const footerRight: HeaderFooterSide = {
		enabled: settings.footerRightEnabled,
		content: settings.footerRightContent,
		customText: settings.footerRightCustomText,
	};

	const isSideVisible = ({
		enabled,
		content,
		customText,
	}: HeaderFooterSide) => {
		if (!enabled) return false;
		if (content === "none") return false;
		if (content === "custom" && !customText.trim()) return false;
		return true;
	};

	const hasHeader = isSideVisible(headerLeft) || isSideVisible(headerRight);
	const hasFooter = isSideVisible(footerLeft) || isSideVisible(footerRight);
	const headerFooterFontSize = Math.max(settings.fontSize * 0.8, 8);
	const headerFooterHeight = Math.max(headerFooterFontSize * 1.6, 12);

	const pageStyle = {
		...defaultPageStyle.page,
		fontSize: settings.fontSize,
		lineHeight: settings.lineHeight,
		paddingTop: marginTop + (hasHeader ? headerFooterHeight : 0),
		paddingRight: marginRight,
		paddingBottom: marginBottom + (hasFooter ? headerFooterHeight : 0),
		paddingLeft: marginLeft,
		backgroundColor: colors.pageBackground,
		color: colors.text,
		fontFamily: settings.font,
	} as const;

	const headerFooterTextStyle = {
		width: "50%",
		height: "100%",
		fontSize: headerFooterFontSize,
		lineHeight: 1.2,
		color: colors.mutedForeground,
		fontFamily: settings.font,
	} as const;

	const headerFooterContainerStyle = {
		position: "absolute",
		left: marginLeft,
		right: marginRight,
		flexDirection: "row",
		alignItems: "center",
		height: headerFooterHeight,
	} as const;

	const resolveHeaderFooterText = (
		side: HeaderFooterSide,
		pageNumber: number,
	) => {
		if (!side.enabled || side.content === "none") return "";

		switch (side.content) {
			case "title":
				return title;
			case "pageNumber":
				return `${pageNumber}`;
			case "custom":
				return side.customText;
			default:
				return "No content";
		}
	};

	const pageSize = settings.pageSize.toUpperCase() as PageProps["size"];
	return (
		<Document
			title={title}
			subject={settings.notionUrl}
			author={settings.notionUrl}
			creator={settings.notionUrl}
			producer={settings.notionUrl}
			creationDate={new Date()}
			modificationDate={new Date()}
			language="en-US"
		>
			<Page
				size={pageSize}
				orientation={settings.orientation}
				style={pageStyle}
				wrap
			>
				{hasHeader && (
					<View
						fixed
						style={{
							...headerFooterContainerStyle,
							top: marginTop,
						}}
						render={({ pageNumber }) => {
							return (
								<>
									<Text style={{ ...headerFooterTextStyle, textAlign: "left" }}>
										{resolveHeaderFooterText(headerLeft, pageNumber)}
									</Text>

									<Text
										style={{ ...headerFooterTextStyle, textAlign: "right" }}
									>
										{resolveHeaderFooterText(headerRight, pageNumber)}
									</Text>
								</>
							);
						}}
					/>
				)}
				{hasFooter && (
					<View
						fixed
						style={{
							...headerFooterContainerStyle,
							bottom: marginBottom,
						}}
						render={({ pageNumber }) => {
							return (
								<>
									<Text style={{ ...headerFooterTextStyle, textAlign: "left" }}>
										{resolveHeaderFooterText(footerLeft, pageNumber)}
									</Text>

									<Text
										style={{ ...headerFooterTextStyle, textAlign: "right" }}
									>
										{resolveHeaderFooterText(footerRight, pageNumber)}
									</Text>
								</>
							);
						}}
					/>
				)}
				{title && (
					<Text
						style={{
							fontSize: settings.fontSize * 2,
							fontWeight: 700,
							marginBottom: 32,
							fontFamily: settings.font,
						}}
					>
						{title}
					</Text>
				)}
				<NotionRenderer blocks={blocks} settings={settings} />
			</Page>
		</Document>
	);
}
