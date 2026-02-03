import { parsePageId } from "@/lib/notion/utils/parse-page-id";

import { Client, type NotionClientError } from "@notionhq/client";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { createServerFn } from "@tanstack/react-start";

export const fetchNotionPage = createServerFn({ method: "POST" })
	.inputValidator((data: { id: string }) => {
		if (!data || typeof data.id !== "string" || data.id.trim().length === 0) {
			throw new Error("A Notion page ID is required.");
		}
		return data;
	})
	.handler(async ({ data }) => {
		const token = process.env.NOTION_API_TOKEN;
		if (!token) {
			throw new Error(
				"Missing NOTION_API_TOKEN. Configure an integration token to fetch pages.",
			);
		}
		const notionApi = new Client({ auth: token });
		// Parse the page ID from the URL using our utility function
		const pageId = parsePageId(data.id);
		if (!pageId) {
			throw new Error("Could not extract a valid Notion page ID from the URL.");
		}

		try {
			return await notionApi.pages.retrieve({ page_id: data.id });
		} catch (error) {
			const notionError = error as NotionClientError;
			if (notionError?.code === "object_not_found") {
				throw new Error(
					"Notion page not found for this integration. Share the page with your Notion integration and try again.",
				);
			}
			throw error;
		}
	});

export const fetchNotionBlocks = createServerFn({ method: "POST" })
	.inputValidator((data: { id: string }) => {
		if (!data || typeof data.id !== "string" || data.id.trim().length === 0) {
			throw new Error("A Notion page ID is required.");
		}
		return data;
	})
	.handler(async ({ data }) => {
		const token = process.env.NOTION_API_TOKEN;
		if (!token) {
			throw new Error(
				"Missing NOTION_API_TOKEN. Configure an integration token to fetch blocks.",
			);
		}
		const notionApi = new Client({ auth: token });
		const pageId = parsePageId(data.id);
		if (!pageId) {
			throw new Error("Could not extract a valid Notion page ID from the URL.");
		}

		const blocks: BlockObjectResponse[] = [];
		let cursor: string | undefined;
		try {
			do {
				const response = await notionApi.blocks.children.list({
					block_id: pageId,
					page_size: 100,
					start_cursor: cursor,
				});
				const pageBlocks = response.results.filter(
					(result): result is BlockObjectResponse => result.object === "block",
				);
				blocks.push(...pageBlocks);
				cursor = response.has_more
					? (response.next_cursor ?? undefined)
					: undefined;
			} while (cursor);
		} catch (error) {
			const notionError = error as NotionClientError;
			if (notionError?.code === "object_not_found") {
				throw new Error(
					"Notion blocks not found for this integration. Share the page with your Notion integration and try again.",
				);
			}
			throw error;
		}

		const fetchBlockChildren = async (blockId: string) => {
			const children: BlockObjectResponse[] = [];
			let childCursor: string | undefined;
			do {
				const response = await notionApi.blocks.children.list({
					block_id: blockId,
					page_size: 100,
					start_cursor: childCursor,
				});
				const childBlocks = response.results.filter(
					(result): result is BlockObjectResponse => result.object === "block",
				);
				children.push(...childBlocks);
				childCursor = response.has_more
					? (response.next_cursor ?? undefined)
					: undefined;
			} while (childCursor);
			return children;
		};

		const enrichedBlocks: (BlockObjectResponse & {
			children?: BlockObjectResponse[];
		})[] = [];

		for (const block of blocks) {
			if (
				block.has_children &&
				(block.type === "table" ||
					block.type === "toggle" ||
					block.type === "bulleted_list_item" ||
					block.type === "numbered_list_item")
			) {
				const children = await fetchBlockChildren(block.id);
				enrichedBlocks.push({ ...block, children });
			} else {
				enrichedBlocks.push(block);
			}
		}

		return enrichedBlocks;
	});
