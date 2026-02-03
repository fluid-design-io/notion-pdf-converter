import { FONTS } from "@/lib/fonts";
import type { PdfSettings } from "@/lib/pdf-settings";

import type { PageProps } from "@react-pdf/renderer";
import { Document, Font, Page, StyleSheet, Text } from "@react-pdf/renderer";
import { NotionRenderer } from "./notion-renderer";
import { COLORS } from "./styles";
import type { NotionBlock } from "./types";

const defaultPageStyle = StyleSheet.create({
	page: { fontSize: 12, color: "#0f172a" },
});
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
	const pageStyle = {
		...defaultPageStyle.page,
		fontSize: settings.fontSize,
		lineHeight: settings.lineHeight,
		paddingTop: settings.marginTop * 28.3465,
		paddingRight: settings.marginRight * 28.3465,
		paddingBottom: settings.marginBottom * 28.3465,
		paddingLeft: settings.marginLeft * 28.3465,
		backgroundColor: colors.pageBackground,
		color: colors.text,
		...(settings.font ? { fontFamily: settings.font } : {}),
	} as const;

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
				<Text
					style={{
						fontSize: settings.fontSize * 2,
						fontWeight: 700,
						marginBottom: 32,
						...(settings.font ? { fontFamily: settings.font } : {}),
					}}
				>
					{title}
				</Text>
				<NotionRenderer blocks={blocks} settings={settings} />
			</Page>
		</Document>
	);
}
