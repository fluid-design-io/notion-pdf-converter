import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type ParagraphBlockProps = {
	block: BlockByType<"paragraph">;
	styles: BlockStyles;
};

export function ParagraphBlock({ block, styles }: ParagraphBlockProps) {
	return (
		<RichText
			richText={block.paragraph.rich_text}
			style={styles.paragraph}
			linkStyle={styles.link}
			codeStyle={styles.code}
		/>
	);
}
