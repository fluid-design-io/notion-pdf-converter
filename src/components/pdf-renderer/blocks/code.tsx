import type { PdfSettings } from "@/lib/pdf-settings";

import { Text, View } from "@react-pdf/renderer";
import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type CodeBlockProps = {
	block: BlockByType<"code">;
	styles: BlockStyles;
	settings: PdfSettings;
};

function renderPlainLines(text: string) {
	const normalized = text.replace(/\r\n?/g, "\n").replace(/\t/g, "    ");
	const lines = normalized.split("\n");
	return lines.length > 0 ? lines : [""];
}

export function CodeBlock({ block, styles, settings }: CodeBlockProps) {
	const codeText = block.code.rich_text.map((item) => item.plain_text ?? "").join("");
	const highlightedDoc = block.codeHighlight?.[settings.theme];
	const lines = renderPlainLines(codeText);
	const language = block.code.language;
	const hasCaption = block.code.caption.length > 0;

	return (
		<View style={styles.codeBlock}>
			<View style={styles.codeBlockHeader}>
				<Text style={styles.codeBlockLanguage}>{language}</Text>
			</View>
			<View style={styles.codeBlockBody}>
				{highlightedDoc
					? highlightedDoc.lines.map((line, lineIndex) => (
							<Text key={`${block.id}-line-${lineIndex}`} style={styles.codeBlockLine}>
								{line.length === 0 ? " " : null}
								{line.map((segment, segmentIndex) => (
									<Text
										key={`${block.id}-line-${lineIndex}-seg-${segmentIndex}`}
										style={{
											...(segment.color ? { color: segment.color } : {}),
											...(segment.fontStyle
												? { fontStyle: segment.fontStyle }
												: {}),
											...(segment.fontWeight
												? { fontWeight: segment.fontWeight }
												: {}),
											...(segment.textDecoration
												? { textDecoration: segment.textDecoration }
												: {}),
										}}
									>
										{segment.text.length > 0 ? segment.text : " "}
									</Text>
								))}
							</Text>
						))
					: lines.map((line, lineIndex) => (
							<Text key={`${block.id}-line-${lineIndex}`} style={styles.codeBlockLine}>
								{line.length > 0 ? line : " "}
							</Text>
						))}
			</View>
			{hasCaption ? (
				<RichText
					richText={block.code.caption}
					style={styles.codeBlockCaption}
					linkStyle={styles.link}
					codeStyle={styles.code}
				/>
			) : null}
		</View>
	);
}
