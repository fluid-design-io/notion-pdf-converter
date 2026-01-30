import type { PdfSettings } from "@/lib/pdf-settings";

import { Text, View } from "@react-pdf/renderer";
import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type CalloutBlockProps = {
	block: BlockByType<"callout">;
	styles: BlockStyles;
	settings: PdfSettings;
};

const getCalloutColor = (color: string, isDark: boolean) => {
	const colorMap: Record<string, { bg: string; border: string }> = {
		blue: {
			bg: isDark ? "#1e3a5f" : "#dbeafe",
			border: isDark ? "#3b82f6" : "#3b82f6",
		},
		blue_background: {
			bg: isDark ? "#1e3a5f" : "#dbeafe",
			border: isDark ? "#3b82f6" : "#3b82f6",
		},
		brown: {
			bg: isDark ? "#3d2e1f" : "#fef3c7",
			border: isDark ? "#92400e" : "#92400e",
		},
		brown_background: {
			bg: isDark ? "#3d2e1f" : "#fef3c7",
			border: isDark ? "#92400e" : "#92400e",
		},
		gray: {
			bg: isDark ? "#374151" : "#f3f4f6",
			border: isDark ? "#6b7280" : "#9ca3af",
		},
		gray_background: {
			bg: isDark ? "#374151" : "#f3f4f6",
			border: isDark ? "#6b7280" : "#9ca3af",
		},
		green: {
			bg: isDark ? "#1e3a2e" : "#d1fae5",
			border: isDark ? "#10b981" : "#10b981",
		},
		green_background: {
			bg: isDark ? "#1e3a2e" : "#d1fae5",
			border: isDark ? "#10b981" : "#10b981",
		},
		orange: {
			bg: isDark ? "#3d2a1f" : "#fed7aa",
			border: isDark ? "#f97316" : "#f97316",
		},
		orange_background: {
			bg: isDark ? "#3d2a1f" : "#fed7aa",
			border: isDark ? "#f97316" : "#f97316",
		},
		pink: {
			bg: isDark ? "#3d1e2e" : "#fce7f3",
			border: isDark ? "#ec4899" : "#ec4899",
		},
		pink_background: {
			bg: isDark ? "#3d1e2e" : "#fce7f3",
			border: isDark ? "#ec4899" : "#ec4899",
		},
		purple: {
			bg: isDark ? "#2e1e3d" : "#e9d5ff",
			border: isDark ? "#a855f7" : "#a855f7",
		},
		purple_background: {
			bg: isDark ? "#2e1e3d" : "#e9d5ff",
			border: isDark ? "#a855f7" : "#a855f7",
		},
		red: {
			bg: isDark ? "#3d1e1e" : "#fee2e2",
			border: isDark ? "#ef4444" : "#ef4444",
		},
		red_background: {
			bg: isDark ? "#3d1e1e" : "#fee2e2",
			border: isDark ? "#ef4444" : "#ef4444",
		},
		yellow: {
			bg: isDark ? "#3d3d1e" : "#fef9c3",
			border: isDark ? "#eab308" : "#eab308",
		},
		yellow_background: {
			bg: isDark ? "#3d3d1e" : "#fef9c3",
			border: isDark ? "#eab308" : "#eab308",
		},
		default: {
			bg: isDark ? "#1e293b" : "#f8fafc",
			border: isDark ? "#475569" : "#cbd5e1",
		},
	};

	return colorMap[color] || colorMap.default;
};

export function CalloutBlock({ block, styles, settings }: CalloutBlockProps) {
	const callout = block.callout;
	const icon = callout.icon;
	const color = callout.color || "default";
	const isDark = settings.theme === "dark";
	const colors = getCalloutColor(color, isDark);

	return (
		<View
			style={[
				styles.callout,
				{
					backgroundColor: colors.bg,
					borderLeftColor: colors.border,
				},
			]}
			wrap
		>
			<View style={{ flexDirection: "row" }}>
				{icon && icon.type === "emoji" && (
					<Text style={styles.calloutIcon}>{icon.emoji}</Text>
				)}
				<View style={{ flex: 1 }}>
					<RichText
						richText={callout.rich_text}
						style={styles.calloutText}
						linkStyle={styles.link}
						codeStyle={styles.code}
					/>
				</View>
			</View>
		</View>
	);
}
