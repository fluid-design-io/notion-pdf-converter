import { Link, View } from "@react-pdf/renderer";
import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type BookmarkBlockProps = {
	block: BlockByType<"bookmark">;
	styles: BlockStyles;
};

export function BookmarkBlock({ block, styles }: BookmarkBlockProps) {
	const { url, caption } = block.bookmark;
	if (!url) return null;

	return (
		<View style={styles.bookmark}>
			{caption?.length ? (
				<RichText
					richText={caption}
					style={styles.bookmarkCaption}
					linkStyle={styles.link}
					codeStyle={styles.code}
				/>
			) : null}
			<Link src={url} style={styles.link}>
				{url}
			</Link>
		</View>
	);
}
