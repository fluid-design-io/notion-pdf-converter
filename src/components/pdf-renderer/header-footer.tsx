import type { PdfSettings } from "@/lib/pdf-settings";

import { Text, View } from "@react-pdf/renderer";

export type HeaderFooterContent = PdfSettings["headerLeftContent"];

export type HeaderFooterSide = {
	enabled: boolean;
	content: HeaderFooterContent;
	customText: string;
};

function getHeaderSides(settings: PdfSettings) {
	return {
		left: {
			enabled: settings.headerLeftEnabled,
			content: settings.headerLeftContent,
			customText: settings.headerLeftCustomText,
		} satisfies HeaderFooterSide,
		right: {
			enabled: settings.headerRightEnabled,
			content: settings.headerRightContent,
			customText: settings.headerRightCustomText,
		} satisfies HeaderFooterSide,
	};
}

function getFooterSides(settings: PdfSettings) {
	return {
		left: {
			enabled: settings.footerLeftEnabled,
			content: settings.footerLeftContent,
			customText: settings.footerLeftCustomText,
		} satisfies HeaderFooterSide,
		right: {
			enabled: settings.footerRightEnabled,
			content: settings.footerRightContent,
			customText: settings.footerRightCustomText,
		} satisfies HeaderFooterSide,
	};
}

function isSideVisible({
	enabled,
	content,
	customText,
}: HeaderFooterSide): boolean {
	if (!enabled) return false;
	if (content === "none") return false;
	if (content === "custom" && !customText.trim()) return false;
	return true;
}

export function getHeaderFooterVisibility(settings: PdfSettings): {
	hasHeader: boolean;
	hasFooter: boolean;
} {
	const header = getHeaderSides(settings);
	const footer = getFooterSides(settings);
	return {
		hasHeader: isSideVisible(header.left) || isSideVisible(header.right),
		hasFooter: isSideVisible(footer.left) || isSideVisible(footer.right),
	};
}

type HeaderFooterStyles = {
	container: Record<string, unknown>;
	text: Record<string, unknown>;
	margins: { top: number; right: number; bottom: number; left: number };
};

type PageHeaderAndFooterProps = {
	title: string;
	settings: PdfSettings;
	styles: HeaderFooterStyles;
};

function resolveText(
	title: string,
	side: HeaderFooterSide,
	pageNumber: number,
): string {
	if (!side.enabled || side.content === "none") return "";

	switch (side.content) {
		case "title":
			return title;
		case "pageNumber":
			return `${pageNumber}`;
		case "custom":
			return side.customText;
		default:
			return "";
	}
}

function SingleBar({
	left,
	right,
	title,
	styles,
	position,
}: {
	left: HeaderFooterSide;
	right: HeaderFooterSide;
	title: string;
	styles: HeaderFooterStyles;
	position: { top?: number } | { bottom?: number };
}) {
	return (
		<View
			fixed
			style={{
				...styles.container,
				...position,
			}}
			render={({ pageNumber }) => (
				<>
					<Text style={{ ...styles.text, textAlign: "left" }}>
						{resolveText(title, left, pageNumber)}
					</Text>
					<Text style={{ ...styles.text, textAlign: "right" }}>
						{resolveText(title, right, pageNumber)}
					</Text>
				</>
			)}
		/>
	);
}

/**
 * Renders both header and footer when enabled. All header/footer logic and
 * settings-derived state live here; parent passes settings, title, and styles.
 */
export function PageHeaderAndFooter({
	title,
	settings,
	styles,
}: PageHeaderAndFooterProps) {
	const header = getHeaderSides(settings);
	const footer = getFooterSides(settings);
	const { hasHeader, hasFooter } = getHeaderFooterVisibility(settings);

	return (
		<>
			{hasHeader && (
				<SingleBar
					left={header.left}
					right={header.right}
					title={title}
					styles={styles}
					position={{ top: styles.margins.top }}
				/>
			)}
			{hasFooter && (
				<SingleBar
					left={footer.left}
					right={footer.right}
					title={title}
					styles={styles}
					position={{ bottom: styles.margins.bottom }}
				/>
			)}
		</>
	);
}
