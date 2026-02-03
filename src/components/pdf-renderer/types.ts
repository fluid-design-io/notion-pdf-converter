import type {
	BlockObjectResponse,
	RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type NotionBlock = BlockObjectResponse & {
	children?: BlockObjectResponse[];
};
export type NotionRichText = RichTextItemResponse;
export type BlockByType<T extends NotionBlock["type"]> = Extract<
	NotionBlock,
	{ type: T }
>;
