import type { TextProps } from "@react-pdf/renderer";
import { Link, Text } from "@react-pdf/renderer";
import type { NotionRichText } from "./types";

type RichTextProps = {
	richText: NotionRichText[];
	style?: TextProps["style"];
	linkStyle?: TextProps["style"];
	codeStyle?: TextProps["style"];
};

export function RichText({
	richText,
	style,
	linkStyle,
	codeStyle,
}: RichTextProps) {
	return (
		<Text style={style}>
			{richText.map((item, index) => {
				const annotations = item.annotations;
				const textStyle: TextProps["style"] = {
					fontWeight: annotations.bold ? 700 : 400,
					fontStyle: annotations.italic ? "italic" : "normal",
					textDecoration: annotations.underline
						? "underline"
						: annotations.strikethrough
							? "line-through"
							: undefined,
				};
				const content = item.plain_text ?? "";
				const link =
					item.href ??
					(item.type === "text" ? (item.text.link?.url ?? null) : null);
				const styleWithCode = annotations.code
					? [textStyle, codeStyle]
					: textStyle;

				if (link) {
					return (
						<Link
							key={`${item.plain_text}-${index}`}
							src={link}
							style={[styleWithCode, linkStyle]}
						>
							{content}
						</Link>
					);
				}

				return (
					<Text key={`${item.plain_text}-${index}`} style={styleWithCode}>
						{content}
					</Text>
				);
			})}
		</Text>
	);
}
