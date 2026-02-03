import { useDeferredValue, useEffect, useState } from "react";

import { pdfSettingsParsers } from "@/lib/pdf-settings";

import { useQueryStates } from "nuqs";
import {
	GlobalWorkerOptions,
	getDocument,
	type PDFDocumentProxy,
} from "pdfjs-dist";
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
		useElementWidth<HTMLDivElement>();

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
		setIsParsing(true);

		const loadPdf = async () => {
			try {
				const loadingTask = getDocument(blobUrl);
				const loadedDoc = await loadingTask.promise;
				if (!cancelled) {
					setPdfDoc(loadedDoc);
					setIsParsing(false);
				}
			} catch (e) {
				if (!cancelled) setIsParsing(false);
			}
		};

		void loadPdf();
		return () => {
			cancelled = true;
		};
	}, [blobUrl]);

	const isLoading = isGenerating || isParsing;

	return (
		<div className="relative isolate min-h-full">
			{isLoading && (
				<div className="fixed inset-0 z-10 flex items-center justify-center bg-background/50 text-muted-foreground text-xs backdrop-blur-sm">
					<Spinner />
				</div>
			)}

			{/* The Container */}
			<div ref={containerRef} className="min-h-full">
				{/* Render pages declaratively */}
				{pdfDoc &&
					containerWidth > 0 &&
					Array.from({ length: pdfDoc.numPages }, (_, i) => (
						<PdfPage
							key={`page-${i + 1}`}
							pdfDoc={pdfDoc}
							pageNumber={i + 1}
							width={containerWidth - 32} // padding logic
						/>
					))}
			</div>
		</div>
	);
}
