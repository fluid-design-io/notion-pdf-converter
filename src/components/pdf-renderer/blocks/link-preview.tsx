import { Link, Text, View } from "@react-pdf/renderer";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type LinkPreviewBlockProps = {
	block: BlockByType<"link_preview">;
	styles: BlockStyles;
};

export function LinkPreviewBlock({ block, styles }: LinkPreviewBlockProps) {
	const url = block.link_preview.url;
	if (!url) return null;

	return (
		<View style={styles.linkPreview}>
			<Text style={styles.linkPreviewUrl}>{url}</Text>
			<Link src={url} style={styles.link}>
				Open link
			</Link>
		</View>
	);
}
