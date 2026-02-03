import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type ToggleBlockProps = {
	block: BlockByType<"toggle">;
	styles: BlockStyles;
};

export function ToggleBlock({ block, styles }: ToggleBlockProps) {
	return (
		<RichText
			richText={block.toggle.rich_text}
			style={styles.toggleLabel}
			linkStyle={styles.link}
			codeStyle={styles.code}
		/>
	);
}
