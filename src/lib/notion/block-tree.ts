import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type RecursiveNotionBlock = BlockObjectResponse & {
	children?: RecursiveNotionBlock[];
};

type ListBlockChildrenFn = (blockId: string) => Promise<BlockObjectResponse[]>;

export async function enrichBlockTree(
	blocks: BlockObjectResponse[],
	listBlockChildren: ListBlockChildrenFn,
): Promise<RecursiveNotionBlock[]> {
	const enrichedBlocks: RecursiveNotionBlock[] = [];

	for (const block of blocks) {
		const enrichedBlock: RecursiveNotionBlock = { ...block };

		if (block.has_children) {
			const children = await listBlockChildren(block.id);
			enrichedBlock.children = await enrichBlockTree(children, listBlockChildren);
		}

		enrichedBlocks.push(enrichedBlock);
	}

	return enrichedBlocks;
}
