import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { type DocumentProps, usePDF } from "@react-pdf/renderer";

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
