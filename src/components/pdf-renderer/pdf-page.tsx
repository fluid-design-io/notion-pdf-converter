import { useEffect, useRef } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

type PdfPageProps = {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  width: number;
  scale?: number;
};

export const PdfPage = ({ pdfDoc, pageNumber, width, scale = 1 }: PdfPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pdfDoc) return;

    // 1. Track cancellation
    let renderTask: RenderTask | null = null;
    let cancelled = false;

    const render = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1 });
        const scale = width / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // 2. Store the render task so we can cancel it specifically
        renderTask = page.render({
          canvasContext: context,
          viewport: scaledViewport,
          canvas,
        })

        await renderTask.promise;
      } catch (error: any) {
        // Ignore errors caused by cancellation
        if (error.name !== 'RenderingCancelledException') {
          console.error(error);
        }
      }
    };

    void render();

    // 3. Cleanup: Cancel the specific PDF.js task if the user scrolls away/resizes fast
    return () => {
      cancelled = true;
      if (renderTask) {
        renderTask.cancel(); 
      }
    };
  }, [pdfDoc, pageNumber, width]);
  return (
    <div className="mx-auto my-4 w-fit overflow-hidden rounded-xs bg-background shadow ring-1 ring-border/30">
      <canvas ref={canvasRef} />
    </div>
  );
};