import { Image } from "@react-pdf/renderer";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type ImageBlockProps = {
	block: BlockByType<"image">;
	styles: BlockStyles;
};

export function ImageBlock({ block, styles }: ImageBlockProps) {
	const image =
		block.image.type === "external" ? block.image.external : block.image.file;
	const src = image.url;

	if (!src) return null;

	return <Image src={src} style={styles.image} />;
}
