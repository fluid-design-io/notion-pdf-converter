import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

import { type DocumentProps, usePDF } from "@react-pdf/renderer";
import { useThrottledState } from "@tanstack/react-pacer";

// Hook for measuring element size
export function useElementWidth<T extends HTMLElement>(maxWidth?: number) {
	const ref = useRef<T>(null);
	const [width, setWidth] = useThrottledState(0, { wait: 200 });

	useLayoutEffect(() => {
		if (!ref.current) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				// Use contentRect for precise content box measurement
				setWidth(Math.min(entry.contentRect.width, maxWidth ?? Infinity));
			}
		});

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return { ref, width };
}

// Hook for generating the Blob URL
export function usePdfBlob(
	documentCallback: () => React.ReactElement<DocumentProps>,
	deps: any[],
) {
	const document = useMemo(() => documentCallback(), deps);
	const [instance, updateInstance] = usePDF({ document });
	const hasMounted = useRef(false);

	useEffect(() => {
		if (!hasMounted.current) {
			hasMounted.current = true;
			return;
		}

		updateInstance(document);
	}, [document, updateInstance]);

	return {
		url: instance.url ?? null,
		loading: instance.loading,
		error: instance.error ?? null,
	};
}
