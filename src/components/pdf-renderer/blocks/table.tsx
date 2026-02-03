import { View } from "@react-pdf/renderer";
import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type TableBlockProps = {
	block: BlockByType<"table">;
	rows: BlockByType<"table_row">[];
	styles: BlockStyles;
};

export function TableBlock({ block, rows, styles }: TableBlockProps) {
	const columnCount = block.table.table_width;
	if (!columnCount) return null;

	return (
		<View style={styles.table}>
			{rows.map((row, rowIndex) => {
				const isLastRow = rowIndex === rows.length - 1;
				return (
					<View
						key={row.id}
						style={[styles.tableRow, isLastRow ? styles.tableRowLast : null]}
					>
						{Array.from({ length: columnCount }).map((_, colIndex) => {
							const cell = row.table_row.cells[colIndex] ?? [];
							const isHeader =
								(block.table.has_column_header && rowIndex === 0) ||
								(block.table.has_row_header && colIndex === 0);
							const isLastCell = colIndex === columnCount - 1;

							return (
								<View
									key={`${row.id}-${colIndex}`}
									style={[
										styles.tableCell,
										isLastCell ? styles.tableCellLast : null,
										isHeader ? styles.tableHeaderCell : null,
									]}
								>
									<RichText
										richText={cell}
										style={[
											styles.tableText,
											isHeader ? styles.tableHeaderText : null,
										]}
										linkStyle={styles.link}
										codeStyle={styles.code}
									/>
								</View>
							);
						})}
					</View>
				);
			})}
		</View>
	);
}
