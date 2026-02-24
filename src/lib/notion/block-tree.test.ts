import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { describe, expect, it, vi } from "vitest";

import { enrichBlockTree } from "./block-tree";

function mockBlock(
	id: string,
	type: string,
	hasChildren = false,
): BlockObjectResponse {
	return {
		object: "block",
		id,
		type,
		has_children: hasChildren,
	} as unknown as BlockObjectResponse;
}

describe("enrichBlockTree", () => {
	it("recursively fetches column_list -> column -> content", async () => {
		const rootBlocks = [mockBlock("col-list-1", "column_list", true)];
		const childMap = new Map<string, BlockObjectResponse[]>([
			[
				"col-list-1",
				[
					mockBlock("col-1", "column", true),
					mockBlock("col-2", "column", true),
				],
			],
			["col-1", [mockBlock("p-1", "paragraph")]],
			["col-2", [mockBlock("code-1", "code")]],
		]);
		const listChildren = vi.fn(async (blockId: string) => childMap.get(blockId) ?? []);

		const result = await enrichBlockTree(rootBlocks, listChildren);

		expect(listChildren).toHaveBeenCalledTimes(3);
		expect(listChildren).toHaveBeenNthCalledWith(1, "col-list-1");
		expect(listChildren).toHaveBeenNthCalledWith(2, "col-1");
		expect(listChildren).toHaveBeenNthCalledWith(3, "col-2");

		const columnList = result[0];
		expect(columnList?.children).toHaveLength(2);
		expect(columnList?.children?.[0]?.type).toBe("column");
		expect(columnList?.children?.[0]?.children?.[0]?.type).toBe("paragraph");
		expect(columnList?.children?.[1]?.children?.[0]?.type).toBe("code");
	});

	it("recursively enriches nested toggle/list/table hierarchies", async () => {
		const rootBlocks = [mockBlock("toggle-1", "toggle", true)];
		const childMap = new Map<string, BlockObjectResponse[]>([
			["toggle-1", [mockBlock("list-1", "bulleted_list_item", true)]],
			["list-1", [mockBlock("table-1", "table", true)]],
			["table-1", [mockBlock("row-1", "table_row", false)]],
		]);
		const listChildren = vi.fn(async (blockId: string) => childMap.get(blockId) ?? []);

		const result = await enrichBlockTree(rootBlocks, listChildren);

		expect(listChildren).toHaveBeenCalledTimes(3);
		expect(result[0]?.children?.[0]?.children?.[0]?.type).toBe("table");
		expect(result[0]?.children?.[0]?.children?.[0]?.children?.[0]?.type).toBe(
			"table_row",
		);
	});
});
