import type { PdfSettings } from "@/lib/pdf-settings";

import { View } from "@react-pdf/renderer";
import {
	CalloutBlock,
	DividerBlock,
	HeadingBlock,
	ImageBlock,
	ListItemBlock,
	ParagraphBlock,
	QuoteBlock,
	TodoBlock,
} from "./blocks";
import { createBlockStyles } from "./styles";
import type { NotionBlock } from "./types";

type NotionRendererProps = {
	blocks: NotionBlock[];
	settings: PdfSettings;
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

export function NotionRenderer({ blocks, settings }: NotionRendererProps) {
	const styles = createBlockStyles(settings);
	let listKind: "bulleted" | "numbered" | null = null;
	let listIndex = 1;

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
						return (
							<View key={block.id} break={breakBefore}>
								<ListItemBlock block={block} styles={styles} />
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
						return (
							<View key={block.id} break={breakBefore}>
								<ListItemBlock
									block={block}
									styles={styles}
									index={itemIndex}
								/>
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
					case "to_do":
						return (
							<View key={block.id} break={breakBefore}>
								<TodoBlock block={block} styles={styles} />
							</View>
						);
					default:
						return null;
				}
			})}
		</View>
	);
}
