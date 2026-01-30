import { View } from "@react-pdf/renderer";
import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type QuoteBlockProps = {
	block: BlockByType<"quote">;
	styles: BlockStyles;
};

export function QuoteBlock({ block, styles }: QuoteBlockProps) {
	return (
		<View style={styles.quote} wrap>
			<RichText
				richText={block.quote.rich_text}
				style={styles.quoteText}
				linkStyle={styles.link}
				codeStyle={styles.code}
			/>
		</View>
	);
}
