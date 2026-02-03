import type { PdfSettings } from "@/lib/pdf-settings";

import { StyleSheet } from "@react-pdf/renderer";

export const createBlockStyles = (settings: PdfSettings) => {
	const baseSize = settings.fontSize;
	const spacing = Math.max(baseSize * 0.6, 6);
	const colors =
		settings.theme === "dark"
			? {
					text: "#f8fafc",
					muted: "#cbd5f5",
					divider: "#334155",
					link: "#38bdf8",
					code: "#1e293b",
					tableHeaderBg: "#1f2937",
				}
			: {
					text: "#0f172a",
					muted: "#475569",
					divider: "#e2e8f0",
					link: "#2563eb",
					code: "#e2e8f0",
					tableHeaderBg: "#f1f5f9",
				};

	return StyleSheet.create({
		paragraph: {
			color: colors.text,
			marginBottom: spacing,
			fontFamily: settings.font,
		},
		heading1: {
			color: colors.text,
			fontSize: baseSize * settings.headingScale,
			fontWeight: 700,
			marginBottom: spacing,
			marginTop: spacing * 1.1,
			fontFamily: settings.font,
		},
		heading2: {
			color: colors.text,
			fontSize: baseSize * settings.headingScale * 0.85,
			fontWeight: 700,
			marginBottom: spacing * 0.9,
			marginTop: spacing,
			fontFamily: settings.font,
		},
		heading3: {
			color: colors.text,
			fontSize: baseSize * settings.headingScale * 0.75,
			fontWeight: 600,
			marginBottom: spacing * 0.8,
			marginTop: spacing * 0.9,
			fontFamily: settings.font,
		},
		listItem: {
			flexDirection: "row",
			marginBottom: spacing * 0.6,
			fontFamily: settings.font,
			paddingLeft: baseSize * 1.6,
			flexWrap: "wrap",
		},
		listBullet: {
			width: baseSize * 1.2,
			textAlign: "right",
			marginRight: baseSize * 0.4,
			color: colors.text,
			fontFamily: settings.font,
		},
		listBulletInline: {
			marginRight: baseSize * 0.4,
			color: colors.text,
			fontFamily: settings.font,
		},
		listContent: {
			flex: 1,
			color: colors.text,
			fontFamily: settings.font,
		},
		listNested: {
			marginLeft: baseSize * 1.2,
			marginTop: spacing * 0.4,
		},
		quote: {
			borderLeftWidth: 2,
			borderLeftColor: colors.divider,
			paddingLeft: baseSize * 0.6,
			marginBottom: spacing,
			fontFamily: settings.font,
		},
		quoteText: {
			color: colors.muted,
			fontStyle: "italic",
			fontFamily: settings.font,
		},
		divider: {
			borderBottomWidth: 1,
			borderBottomColor: colors.divider,
			marginVertical: spacing,
			fontFamily: settings.font,
			// hide if this is used as page break
			display: settings.splitByDivider ? "none" : "flex",
		},
		image: {
			width: "100%",
			objectFit: "contain",
			marginVertical: spacing,
		},
		link: {
			color: colors.link,
			textDecoration: "underline",
			fontFamily: settings.font,
		},
		code: {
			backgroundColor: colors.code,
			borderRadius: 2,
			paddingHorizontal: 2,
			fontFamily: "Monospace",
		},
		callout: {
			borderLeftWidth: 3,
			paddingLeft: baseSize * 0.6,
			paddingRight: baseSize * 0.6,
			paddingTop: baseSize * 0.5,
			paddingBottom: baseSize * 0.5,
			marginBottom: spacing,
			borderRadius: 4,
			fontFamily: settings.font,
		},
		calloutIcon: {
			fontSize: baseSize * 1.2,
			marginRight: baseSize * 0.4,
		},
		calloutIconImage: {
			width: baseSize * 1.2,
			height: baseSize * 1.2,
			marginRight: baseSize * 0.4,
			objectFit: "cover",
		},
		calloutText: {
			color: colors.text,
			fontFamily: settings.font,
		},
		bookmark: {
			marginBottom: spacing,
		},
		bookmarkCaption: {
			color: colors.text,
			marginBottom: spacing * 0.4,
			fontFamily: settings.font,
		},
		linkPreview: {
			borderWidth: 1,
			borderColor: colors.divider,
			borderRadius: 4,
			padding: spacing * 0.6,
			marginBottom: spacing,
			fontFamily: settings.font,
		},
		linkPreviewUrl: {
			color: colors.muted,
			marginBottom: spacing * 0.3,
			fontFamily: settings.font,
		},
		table: {
			borderWidth: 1,
			borderColor: colors.divider,
			borderRadius: 4,
			marginBottom: spacing,
		},
		tableRow: {
			flexDirection: "row",
			borderBottomWidth: 1,
			borderBottomColor: colors.divider,
		},
		tableRowLast: {
			borderBottomWidth: 0,
		},
		tableCell: {
			flexGrow: 1,
			flexBasis: 0,
			paddingVertical: spacing * 0.3,
			paddingHorizontal: spacing * 0.4,
			borderRightWidth: 1,
			borderRightColor: colors.divider,
		},
		tableCellLast: {
			borderRightWidth: 0,
		},
		tableHeaderCell: {
			backgroundColor: colors.tableHeaderBg,
		},
		tableText: {
			color: colors.text,
			fontSize: baseSize * 0.95,
			fontFamily: settings.font,
		},
		tableHeaderText: {
			fontWeight: 600,
		},
		toggleLabel: {
			color: colors.text,
			marginBottom: spacing * 0.4,
			fontFamily: settings.font,
		},
		toggleChildren: {
			marginLeft: spacing * 0.8,
		},
		unsupportedBanner: {
			backgroundColor: "#f97316",
			borderRadius: 4,
			paddingVertical: spacing * 0.4,
			paddingHorizontal: spacing * 0.6,
			marginBottom: spacing,
		},
		unsupportedBannerText: {
			color: "#ffffff",
			fontFamily: settings.font,
			fontSize: baseSize * 0.9,
		},
		todoItem: {
			flexDirection: "row",
			marginBottom: spacing * 0.6,
			fontFamily: settings.font,
		},
		todoCheckbox: {
			width: baseSize * 1.2,
			height: baseSize * 1.2,
			marginRight: baseSize * 0.4,
			color: colors.text,
		},
		todoContent: {
			flex: 1,
			color: colors.text,
			fontFamily: settings.font,
		},
		todoContentChecked: {
			color: colors.muted,
			textDecoration: "line-through",
		},
	});
};

export type BlockStyles = ReturnType<typeof createBlockStyles>;
