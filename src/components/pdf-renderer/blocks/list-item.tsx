import { Text, View } from "@react-pdf/renderer";
import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type ListItemBlockProps = {
	block: BlockByType<"bulleted_list_item"> | BlockByType<"numbered_list_item">;
	styles: BlockStyles;
	index?: number;
};

export function ListItemBlock({ block, styles, index }: ListItemBlockProps) {
	const richText = block[block.type].rich_text;
	const bullet =
		block.type === "numbered_list_item" ? `${index ?? 1}.` : "\u2022";

	return (
		<View style={styles.listItem} wrap>
			<Text style={styles.listBullet}>{bullet}</Text>
			<View style={styles.listContent}>
				<RichText
					richText={richText}
					style={styles.listContent}
					linkStyle={styles.link}
					codeStyle={styles.code}
				/>
			</View>
		</View>
	);
}
