import { useDeferredValue, useEffect, useState } from "react";

import { getPageAspectRatio } from "@/lib/pdf-page-sizes";
import { pdfSettingsParsers } from "@/lib/pdf-settings";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useQueryStates } from "nuqs";
import {
	GlobalWorkerOptions,
	getDocument,
	type PDFDocumentProxy,
} from "pdfjs-dist";
import { ScrollArea } from "../ui/scroll-area";
import { Spinner } from "../ui/spinner";
import { useElementWidth, usePdfBlob } from "./hooks";
import { PdfDocument } from "./index";
import { PdfPage } from "./pdf-page";
import type { NotionBlock } from "./types";

// Initialize worker once outside component
if (typeof window !== "undefined" && !GlobalWorkerOptions.workerSrc) {
	GlobalWorkerOptions.workerSrc = new URL(
		"pdfjs-dist/build/pdf.worker.min.mjs",
		import.meta.url,
	).toString();
}

type PdfPreviewProps = {
	title: string;
	blocks: NotionBlock[];
	onBlobUrlChange?: (url: string | null) => void;
};

export function PdfPreview({
	title,
	blocks,
	onBlobUrlChange,
}: PdfPreviewProps) {
	const [settings] = useQueryStates(pdfSettingsParsers);
	const { ref: containerRef, width: containerWidth } =
		useElementWidth<HTMLDivElement>(1024);

	const deferredBlocks = useDeferredValue(blocks);

	const { url: blobUrl, loading: isGenerating } = usePdfBlob(
		() => (
			<PdfDocument title={title} blocks={deferredBlocks} settings={settings} />
		),
		[title, deferredBlocks, settings],
	);

	// Local state for the loaded PDF.js document
	const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
	const [isParsing, setIsParsing] = useState(false);

	// Sync blob URL with parent
	useEffect(() => {
		onBlobUrlChange?.(blobUrl);
	}, [blobUrl, onBlobUrlChange]);

	// Load the PDF Document when the blob changes
	useEffect(() => {
		if (!blobUrl) {
			setPdfDoc(null);
			return;
		}

		let cancelled = false;
		let loadingTask: ReturnType<typeof getDocument> | null = null;
		setIsParsing(true);

		const loadPdf = async () => {
			try {
				loadingTask = getDocument(blobUrl);
				const loadedDoc = await loadingTask.promise;
				if (!cancelled) {
					setPdfDoc(loadedDoc);
					setIsParsing(false);
				}
			} catch {
				if (!cancelled) setIsParsing(false);
			}
		};

		void loadPdf();
		return () => {
			cancelled = true;
			loadingTask?.destroy();
		};
	}, [blobUrl]);

	const isLoading = isGenerating || isParsing;
	const pageWidth = Math.max(containerWidth - 32, 0);
	const pageGap = 32;
	const virtualizer = useVirtualizer({
		count: pdfDoc?.numPages ?? 0,
		getScrollElement: () =>
			containerRef.current?.querySelector(
				'[data-slot="scroll-area-viewport"]',
			) as HTMLDivElement | null,
		estimateSize: () =>
			Math.max(pageWidth * getPageAspectRatio(settings) + pageGap, 0),
		overscan: 3,
	});

	useEffect(() => {
		virtualizer.measure();
	}, [containerWidth]);

	return (
		<div className="relative overflow-y-hidden">
			{isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 text-muted-foreground text-xs backdrop-blur-sm">
					<Spinner />
				</div>
			)}

			<ScrollArea ref={containerRef} className="h-full w-full">
				{/* Render pages declaratively */}
				{pdfDoc && containerWidth > 0 && (
					<div
						className="relative w-full"
						style={{ height: virtualizer.getTotalSize() }}
					>
						{virtualizer.getVirtualItems().map((virtualRow) => (
							<div
								key={virtualRow.key}
								className="absolute top-0 left-0 w-full"
								style={{
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<PdfPage
									pdfDoc={pdfDoc}
									pageNumber={virtualRow.index + 1}
									width={pageWidth}
								/>
							</div>
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
