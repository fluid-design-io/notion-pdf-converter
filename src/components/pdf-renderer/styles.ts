import { TW_COLORS } from "@/lib/colors";
import type { PdfSettings } from "@/lib/pdf-settings";

import { StyleSheet } from "@react-pdf/renderer";

const POINTS_PER_CM = 28.3465;

export const COLORS = {
	light: {
		pageBackground: "#ffffff",
		text: TW_COLORS.neutral[950],
		muted: TW_COLORS.neutral[200],
		mutedForeground: TW_COLORS.neutral[400],
		divider: TW_COLORS.neutral[200],
		link: TW_COLORS.blue[500],
		codeForeground: TW_COLORS.red[600],
		codeBackground: TW_COLORS.neutral[100],
		tableHeaderBg: TW_COLORS.neutral[200],
	},
	dark: {
		pageBackground: TW_COLORS.neutral[900],
		text: TW_COLORS.neutral[50],
		muted: TW_COLORS.neutral[800],
		mutedForeground: TW_COLORS.neutral[600],
		divider: TW_COLORS.neutral[800],
		link: "#38bdf8",
		codeForeground: "#EB5758",
		codeBackground: TW_COLORS.neutral[800],
		tableHeaderBg: TW_COLORS.neutral[800],
	},
};

export type PageStyleOptions = {
	hasHeader?: boolean;
	hasFooter?: boolean;
};

export const getRendererStyles = (
	settings: PdfSettings,
	options: PageStyleOptions = {},
) => {
	const { hasHeader = false, hasFooter = false } = options;
	const baseSize = settings.fontSize;
	const spacing = Math.max(baseSize * 0.6, 6);
	const colors = COLORS[settings.theme];

	const marginTop = settings.marginTop * POINTS_PER_CM;
	const marginRight = settings.marginRight * POINTS_PER_CM;
	const marginBottom = settings.marginBottom * POINTS_PER_CM;
	const marginLeft = settings.marginLeft * POINTS_PER_CM;

	const headerFooterFontSize = Math.max(settings.fontSize * 0.8, 8);
	const headerFooterHeight = Math.max(headerFooterFontSize * 1.6, 16);

	const pageTitleStyle = {
		fontSize: settings.fontSize * 2,
		fontWeight: 700,
		marginBottom: spacing * 2,
		fontFamily: settings.font,
	} as const;

	const pageStyle = {
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
		position: "absolute" as const,
		left: marginLeft,
		right: marginRight,
		flexDirection: "row" as const,
		alignItems: "center" as const,
		height: headerFooterHeight,
	} as const;

	const blockStyles = StyleSheet.create({
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
			marginBottom: spacing,
			marginTop: spacing,
			fontFamily: settings.font,
		},
		heading3: {
			color: colors.text,
			fontSize: baseSize * settings.headingScale * 0.75,
			fontWeight: 600,
			marginBottom: spacing * 0.9,
			marginTop: spacing * 0.9,
			fontFamily: settings.font,
		},
		listItem: {
			marginBottom: spacing * 0.6,
			fontFamily: settings.font,
			paddingLeft: baseSize * 1.6,
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
		listContent: {},
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
			backgroundColor: colors.codeBackground,
			color: colors.codeForeground,
			borderRadius: 6,
			paddingHorizontal: 6,
			paddingVertical: baseSize * 0.1,
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
			fontFamily: settings.font,
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

	return {
		...blockStyles,
		page: pageStyle,
		pageTitle: pageTitleStyle,
		headerFooterText: headerFooterTextStyle,
		headerFooterContainer: headerFooterContainerStyle,
		margins: {
			top: marginTop,
			right: marginRight,
			bottom: marginBottom,
			left: marginLeft,
		},
	};
};

export type BlockStyles = ReturnType<typeof getRendererStyles>;
