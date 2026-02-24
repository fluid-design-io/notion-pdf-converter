import type {
	BlockObjectResponse,
	RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { CodeHighlightThemes } from "@/lib/notion/code-highlighting";

export type NotionBlock = BlockObjectResponse & {
	children?: NotionBlock[];
	codeHighlight?: CodeHighlightThemes;
};
export type NotionRichText = RichTextItemResponse;
export type BlockByType<T extends NotionBlock["type"]> = Extract<
	NotionBlock,
	{ type: T }
>;
