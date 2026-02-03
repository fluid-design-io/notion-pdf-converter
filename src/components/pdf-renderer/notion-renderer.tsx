import type { PdfSettings } from "@/lib/pdf-settings";

import { Text, View } from "@react-pdf/renderer";
import {
	BookmarkBlock,
	CalloutBlock,
	DividerBlock,
	HeadingBlock,
	ImageBlock,
	LinkPreviewBlock,
	ListItemBlock,
	ParagraphBlock,
	QuoteBlock,
	TableBlock,
	TodoBlock,
	ToggleBlock,
} from "./blocks";
import type { BlockStyles } from "./styles";
import type { BlockByType, NotionBlock } from "./types";

type NotionRendererProps = {
	blocks: NotionBlock[];
	settings: PdfSettings;
	styles: BlockStyles;
};

const shouldBreakBefore = (
	block: NotionBlock,
	settings: PdfSettings,
	index: number,
) => {
	if (index === 0) return false;
	if (block.type === "heading_1") return settings.splitByH1;
	if (block.type === "heading_2") return settings.splitByH2;
	if (block.type === "heading_3") return settings.splitByH3;
	if (block.type === "divider") return settings.splitByDivider;
	return false;
};

export function NotionRenderer({
	blocks,
	settings,
	styles,
}: NotionRendererProps) {
	let listKind: "bulleted" | "numbered" | null = null;
	let listIndex = 1;
	const isDev = import.meta.env.DEV;

	const renderUnsupported = (blockType: string) =>
		isDev ? (
			<View style={styles.unsupportedBanner}>
				<Text style={styles.unsupportedBannerText}>
					Unsupported block type {blockType}
				</Text>
			</View>
		) : null;

	return (
		<View>
			{blocks.map((block, index) => {
				const isListItem =
					block.type === "bulleted_list_item" ||
					block.type === "numbered_list_item";
				if (!isListItem) {
					listKind = null;
					listIndex = 1;
				}
				const breakBefore = shouldBreakBefore(block, settings, index);

				switch (block.type) {
					case "paragraph":
						return (
							<View key={block.id} break={breakBefore}>
								<ParagraphBlock block={block} styles={styles} />
							</View>
						);
					case "heading_1":
					case "heading_2":
					case "heading_3":
						return (
							<View key={block.id} break={breakBefore}>
								<HeadingBlock block={block} styles={styles} />
							</View>
						);
					case "bulleted_list_item": {
						if (listKind !== "bulleted") {
							listKind = "bulleted";
							listIndex = 1;
						}
						const bulletedChildren = block.children ?? [];
						return (
							<View key={block.id} break={breakBefore}>
								<ListItemBlock block={block} styles={styles} />
								{bulletedChildren.length > 0 ? (
									<View style={styles.listNested}>
										<NotionRenderer
											blocks={bulletedChildren}
											settings={settings}
											styles={styles}
										/>
									</View>
								) : null}
							</View>
						);
					}
					case "numbered_list_item": {
						if (listKind !== "numbered") {
							listKind = "numbered";
							listIndex = 1;
						}
						const itemIndex = listIndex;
						listIndex += 1;
						const numberedChildren = block.children ?? [];
						return (
							<View key={block.id} break={breakBefore}>
								<ListItemBlock
									block={block}
									styles={styles}
									index={itemIndex}
								/>
								{numberedChildren.length > 0 ? (
									<View style={styles.listNested}>
										<NotionRenderer
											blocks={numberedChildren}
											settings={settings}
											styles={styles}
										/>
									</View>
								) : null}
							</View>
						);
					}
					case "quote":
						return (
							<View key={block.id} break={breakBefore}>
								<QuoteBlock block={block} styles={styles} />
							</View>
						);
					case "divider":
						return (
							<View key={block.id} break={breakBefore}>
								<DividerBlock styles={styles} />
							</View>
						);
					case "image":
						return (
							<View key={block.id} break={breakBefore}>
								<ImageBlock block={block} styles={styles} />
							</View>
						);
					case "callout":
						return (
							<View key={block.id} break={breakBefore}>
								<CalloutBlock
									block={block}
									styles={styles}
									settings={settings}
								/>
							</View>
						);
					case "bookmark":
						return (
							<View key={block.id} break={breakBefore}>
								<BookmarkBlock block={block} styles={styles} />
							</View>
						);
					case "link_preview":
						return (
							<View key={block.id} break={breakBefore}>
								<LinkPreviewBlock block={block} styles={styles} />
							</View>
						);
					case "table": {
						const rowBlocks = (block.children ?? []).filter(
							(child): child is BlockByType<"table_row"> =>
								child.type === "table_row",
						);
						return (
							<View key={block.id} break={breakBefore}>
								<TableBlock block={block} rows={rowBlocks} styles={styles} />
							</View>
						);
					}
					case "toggle": {
						const toggleChildren = block.children ?? [];
						return (
							<View key={block.id} break={breakBefore}>
								<ToggleBlock block={block} styles={styles} />
								{toggleChildren.length > 0 ? (
									<View style={styles.toggleChildren}>
										<NotionRenderer
											blocks={toggleChildren}
											settings={settings}
											styles={styles}
										/>
									</View>
								) : null}
							</View>
						);
					}
					case "to_do":
						return (
							<View key={block.id} break={breakBefore}>
								<TodoBlock block={block} styles={styles} />
							</View>
						);
					default:
						return (() => {
							const unsupported = renderUnsupported(block.type);
							return unsupported ? (
								<View key={block.id} break={breakBefore}>
									{unsupported}
								</View>
							) : null;
						})();
				}
			})}
		</View>
	);
}
