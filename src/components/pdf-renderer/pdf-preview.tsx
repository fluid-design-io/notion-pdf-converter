import { useEffect, useMemo, useRef, useState } from "react";

import type { PdfSettings } from "@/lib/pdf-settings";

import { pdf } from "@react-pdf/renderer";
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { Spinner } from "../ui/spinner";
import { PdfDocument } from "./index";
import type { NotionBlock } from "./types";

if (typeof window !== "undefined") {
	GlobalWorkerOptions.workerSrc = new URL(
		"pdfjs-dist/build/pdf.worker.min.mjs",
		import.meta.url,
	).toString();
}

type PdfPreviewProps = {
	title: string;
	blocks: NotionBlock[];
	settings: PdfSettings;
	onBlobUrlChange?: (url: string | null) => void;
};

export function PdfPreview({
	title,
	blocks,
	settings,
	onBlobUrlChange,
}: PdfPreviewProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [blobUrl, setBlobUrl] = useState<string | null>(null);
	const [containerWidth, setContainerWidth] = useState(0);
	const [isRendering, setIsRendering] = useState(false);

	const documentElement = useMemo(
		() => <PdfDocument title={title} blocks={blocks} settings={settings} />,
		[title, blocks, settings],
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || typeof ResizeObserver === "undefined") {
			return;
		}

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				setContainerWidth(entry.contentRect.width);
			}
		});
		observer.observe(container);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		let cancelled = false;
		let currentUrl: string | null = null;

		setIsRendering(true);
		const createBlob = async () => {
			try {
				const blob = await pdf(documentElement).toBlob();
				if (cancelled) return;
				currentUrl = URL.createObjectURL(blob);
				setBlobUrl(currentUrl);
				onBlobUrlChange?.(currentUrl);
			} catch {
				if (!cancelled) {
					setBlobUrl(null);
					onBlobUrlChange?.(null);
				}
			}
		};

		void createBlob();

		return () => {
			cancelled = true;
			if (currentUrl) {
				URL.revokeObjectURL(currentUrl);
			}
			onBlobUrlChange?.(null);
		};
	}, [documentElement, onBlobUrlChange]);

	useEffect(() => {
		if (!blobUrl || !containerRef.current || containerWidth === 0) {
			return;
		}

		let cancelled = false;
		let loadingTask: PDFDocumentLoadingTask | null = null;
		let currentDocument: PDFDocumentProxy | null = null;

		const renderPages = async () => {
			setIsRendering(true);
			const container = containerRef.current;
			if (!container) return;
			container.innerHTML = "";

			loadingTask = getDocument(blobUrl);
			currentDocument = await loadingTask.promise;

			const deviceScale = window.devicePixelRatio || 1;
			const containerPadding = 32;

			for (
				let pageNumber = 1;
				pageNumber <= currentDocument.numPages;
				pageNumber += 1
			) {
				if (cancelled) return;
				const page = await currentDocument.getPage(pageNumber);
				const baseViewport = page.getViewport({ scale: 1 });
				const scale =
					containerWidth > containerPadding
						? (containerWidth - containerPadding) / baseViewport.width
						: 1;
				const viewport = page.getViewport({ scale });

				const canvas = document.createElement("canvas");
				const context = canvas.getContext("2d");
				if (!context) continue;

				canvas.width = viewport.width * deviceScale;
				canvas.height = viewport.height * deviceScale;
				canvas.style.width = `${viewport.width}px`;
				canvas.style.height = `${viewport.height}px`;
				context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);

				const pageWrapper = document.createElement("div");
				pageWrapper.className =
					"mx-auto my-4 w-fit rounded-xs overflow-hidden bg-background shadow ring-1 ring-border/30";
				pageWrapper.appendChild(canvas);
				container.appendChild(pageWrapper);

				await page.render({ canvasContext: context, viewport, canvas }).promise;
			}

			if (!cancelled) {
				setIsRendering(false);
			}
		};

		void renderPages();

		return () => {
			cancelled = true;
			void loadingTask?.destroy();
			void currentDocument?.destroy();
		};
	}, [blobUrl, containerWidth]);

	return (
		<>
			{isRendering ? (
				<div className="absolute inset-0 flex items-center justify-center bg-background/50 text-muted-foreground text-xs backdrop-blur-sm">
					<Spinner />
				</div>
			) : null}
			<div ref={containerRef} className="min-h-full" />
		</>
	);
}
