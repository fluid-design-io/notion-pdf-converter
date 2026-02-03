import type { PdfSettings } from "./pdf-settings";

type PageSize = {
	width: number;
	height: number;
};

const PAGE_SIZES: Record<PdfSettings["pageSize"], PageSize> = {
	letter: { width: 612, height: 792 },
	a4: { width: 595.28, height: 841.89 },
	legal: { width: 612, height: 1008 },
};

export const getPageDimensions = (settings: PdfSettings): PageSize => {
	const base = PAGE_SIZES[settings.pageSize];
	if (settings.orientation === "landscape") {
		return { width: base.height, height: base.width };
	}
	return base;
};

export const getPageAspectRatio = (settings: PdfSettings) => {
	const { width, height } = getPageDimensions(settings);
	return height / width;
};
