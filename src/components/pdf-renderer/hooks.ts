import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { DocumentProps, pdf } from "@react-pdf/renderer";

// Hook for measuring element size
export function useElementWidth<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const [width, setWidth] = useState(0);

	useLayoutEffect(() => {
		if (!ref.current) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				// Use contentRect for precise content box measurement
				setWidth(entry.contentRect.width);
			}
		});

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return { ref, width };
}

// Hook for generating the Blob URL
export function usePdfBlob(
	documentCallback: () => React.ReactElement,
	deps: any[],
) {
	const [url, setUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);

		const generate = async () => {
			try {
				const doc = documentCallback() as React.ReactElement<DocumentProps>;
				const blob = await pdf(doc).toBlob();

				if (cancelled) return;

				const newUrl = URL.createObjectURL(blob);
				setUrl(newUrl);
				setError(null);
			} catch (err) {
				if (!cancelled)
					setError(
						err instanceof Error ? err : new Error("Failed to generate PDF"),
					);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void generate();

		return () => {
			cancelled = true;
			// Revoke old URL to prevent memory leaks
			setUrl((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return null;
			});
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return { url, loading, error };
}
