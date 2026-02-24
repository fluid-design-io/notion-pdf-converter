import type { NotionBlock } from "@/components/pdf-renderer/types";

import { enrichBlockTree } from "@/lib/notion/block-tree";
import { highlightCodeThemes } from "@/lib/notion/code-highlighting";
import { parsePageId } from "@/lib/notion/utils/parse-page-id";

import { type NotionClientError } from "@notionhq/client";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { createServerFn } from "@tanstack/react-start";

async function addCodeHighlightsToBlocks(
	blocks: NotionBlock[],
): Promise<NotionBlock[]> {
	const highlightedBlocks: NotionBlock[] = [];

	for (const block of blocks) {
		let nextBlock: NotionBlock = block;

		if (block.children && block.children.length > 0) {
			nextBlock = {
				...nextBlock,
				children: await addCodeHighlightsToBlocks(block.children),
			};
		}

		if (block.type === "code") {
			const codeText = block.code.rich_text
				.map((item) => item.plain_text ?? "")
				.join("");
			nextBlock = {
				...nextBlock,
				codeHighlight: await highlightCodeThemes(codeText, block.code.language),
			};
		}

		highlightedBlocks.push(nextBlock);
	}

	return highlightedBlocks;
}

export const fetchNotionPage = createServerFn({ method: "POST" })
	.inputValidator((data: { id: string }) => {
		if (!data || typeof data.id !== "string" || data.id.trim().length === 0) {
			throw new Error("A Notion page ID is required.");
		}
		return data;
	})
	.handler(async ({ data }) => {
		const { withNotionClient } = await import("@/server/notion-client.server");
		const pageId = parsePageId(data.id);
		if (!pageId) {
			throw new Error("Could not extract a valid Notion page ID from the URL.");
		}

		try {
			return await withNotionClient((notionApi) =>
				notionApi.pages.retrieve({ page_id: pageId }),
			);
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
		const { withNotionClient } = await import("@/server/notion-client.server");
		const pageId = parsePageId(data.id);
		if (!pageId) {
			throw new Error("Could not extract a valid Notion page ID from the URL.");
		}

		try {
			return await withNotionClient(async (notionApi) => {
				const listBlockChildren = async (blockId: string) => {
					const blocks: BlockObjectResponse[] = [];
					let cursor: string | undefined;

					do {
						const response = await notionApi.blocks.children.list({
							block_id: blockId,
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

					return blocks;
				};

				const rootBlocks = await listBlockChildren(pageId);
				const enrichedBlocks = await enrichBlockTree(
					rootBlocks,
					listBlockChildren,
				);
				return await addCodeHighlightsToBlocks(enrichedBlocks as NotionBlock[]);
			});
		} catch (error) {
			const notionError = error as NotionClientError;
			if (notionError?.code === "object_not_found") {
				throw new Error(
					"Notion blocks not found for this integration. Share the page with your Notion integration and try again.",
				);
			}
			throw error;
		}
	});
