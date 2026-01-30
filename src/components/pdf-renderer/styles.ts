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
				}
			: {
					text: "#0f172a",
					muted: "#475569",
					divider: "#e2e8f0",
					link: "#2563eb",
					code: "#e2e8f0",
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
		},
		listBullet: {
			width: baseSize * 1.2,
			textAlign: "right",
			marginRight: baseSize * 0.4,
			color: colors.text,
			fontFamily: settings.font,
		},
		listContent: {
			flex: 1,
			color: colors.text,
			fontFamily: settings.font,
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
		calloutText: {
			color: colors.text,
			fontFamily: settings.font,
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
