import type { ReactNode } from "react";

import { View } from "@react-pdf/renderer";
import type { BlockStyles } from "../styles";
import type { BlockByType, NotionBlock } from "../types";

type ColumnListBlockProps = {
	block: BlockByType<"column_list">;
	styles: BlockStyles;
	renderColumnChildren: (children: NotionBlock[]) => ReactNode;
};

export function ColumnListBlock({
	block,
	styles,
	renderColumnChildren,
}: ColumnListBlockProps) {
	const columns = (block.children ?? []).filter(
		(child): child is BlockByType<"column"> => child.type === "column",
	);

	if (columns.length === 0) return null;

	const allColumnsHaveWidthRatio = columns.every(
		(column) => typeof column.column.width_ratio === "number",
	);

	return (
		<View style={styles.columnList}>
			{columns.map((column, index) => {
				const isLastColumn = index === columns.length - 1;
				const ratio = column.column.width_ratio;
				const widthStyle =
					allColumnsHaveWidthRatio && typeof ratio === "number"
						? { flexGrow: ratio, flexShrink: 1, flexBasis: 0 as const }
						: { flexGrow: 1, flexShrink: 1, flexBasis: 0 as const };

				return (
					<View
						key={column.id}
						style={
							isLastColumn
								? [styles.column, widthStyle]
								: [styles.column, styles.columnSpacer, widthStyle]
						}
					>
						{renderColumnChildren(column.children ?? [])}
					</View>
				);
			})}
		</View>
	);
}
