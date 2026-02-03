import { FONTS } from "@/lib/fonts";
import type { PdfSettings } from "@/lib/pdf-settings";

import type { PageProps } from "@react-pdf/renderer";
import { Document, Font, Page } from "@react-pdf/renderer";
import {
	getHeaderFooterVisibility,
	PageHeaderAndFooter,
} from "./header-footer";
import { NotionRenderer } from "./notion-renderer";
import { PageTitle } from "./page-title";
import { getRendererStyles } from "./styles";
import type { NotionBlock } from "./types";

type PdfDocumentProps = {
	title: string;
	blocks: NotionBlock[];
	settings: PdfSettings;
};

// Register monospace font (400 and 700 only for code blocks)
Font.register({
	family: "Monospace",
	fonts: FONTS.find((f) => f.family === "Monospace")!
		.fonts.map((font) => {
			// only register 400 and 700
			if (font.fontWeight === 400 || font.fontWeight === 700) {
				return {
					src: font.src,
					fontWeight: font.fontWeight,
				};
			}
			return undefined;
		})
		.filter((font) => font !== undefined),
});

export function PdfDocument({ title, blocks, settings }: PdfDocumentProps) {
	const activeFont = FONTS.find((font) => font.family === settings.font);
	if (activeFont) {
		Font.register({
			family: activeFont.family,
			fonts: [...activeFont.fonts],
		});
	}

	const { hasHeader, hasFooter } = getHeaderFooterVisibility(settings);
	const styles = getRendererStyles(settings, { hasHeader, hasFooter });

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
				style={styles.page}
				wrap
			>
				<PageHeaderAndFooter
					title={title}
					settings={settings}
					styles={{
						container: styles.headerFooterContainer,
						text: styles.headerFooterText,
						margins: styles.margins,
					}}
				/>
				<PageTitle title={title} styles={styles.pageTitle} />
				<NotionRenderer blocks={blocks} settings={settings} styles={styles} />
			</Page>
		</Document>
	);
}
