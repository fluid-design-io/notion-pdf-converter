import { View } from "@react-pdf/renderer";
import type { BlockStyles } from "../styles";

type DividerBlockProps = {
	styles: BlockStyles;
};

export function DividerBlock({ styles }: DividerBlockProps) {
	return <View style={styles.divider} />;
}
