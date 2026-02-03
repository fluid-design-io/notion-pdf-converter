/**
 * Browser polyfills. Import this first in the client entry.
 * TanStack Start can leak server deps (e.g. @notionhq/client using Buffer) into the client bundle.
 */
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
	(globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer;
}
