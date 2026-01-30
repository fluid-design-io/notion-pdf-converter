import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type HeadingBlockProps = {
	block:
		| BlockByType<"heading_1">
		| BlockByType<"heading_2">
		| BlockByType<"heading_3">;
	styles: BlockStyles;
};

export function HeadingBlock({ block, styles }: HeadingBlockProps) {
	const richText = block[block.type].rich_text;
	const style =
		block.type === "heading_1"
			? styles.heading1
			: block.type === "heading_2"
				? styles.heading2
				: styles.heading3;

	return (
		<RichText
			richText={richText}
			style={style}
			linkStyle={styles.link}
			codeStyle={styles.code}
		/>
	);
}
