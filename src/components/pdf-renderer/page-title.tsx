import { Text } from "@react-pdf/renderer";
import type { BlockStyles } from "./styles";

export const PageTitle = ({
	title,
	styles,
}: {
	title: string;
	styles: BlockStyles["pageTitle"];
}) => {
	if (!title) return null;
	return <Text style={styles}>{title}</Text>;
};
