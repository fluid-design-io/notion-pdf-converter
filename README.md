# Notion PDF Preview

This project renders Notion pages into PDFs using `@react-pdf/renderer`, then previews them in the browser via `pdfjs-dist`.

## PDF Preview Structure

### Rendering (React-PDF)
- Entry point: `src/components/pdf-renderer/index.tsx` (`PdfDocument`)
- Flow:
  - Receives `title`, `blocks`, and `settings`
  - Registers selected fonts from `src/lib/fonts.ts`
  - Builds page styles from settings and theme colors
  - Renders a `Document` → `Page` → `NotionRenderer` tree
  - Applies optional headers/footers using fixed React-PDF `View` elements

### Styling (React-PDF styles)
- Block-level styles live in `src/components/pdf-renderer/styles.ts`
- `getRendererStyles(settings)` centralizes typography, spacing, and theming
- Use these styles inside each block renderer for consistent layout

### Display (PDF.js preview)
- Entry point: `src/components/pdf-renderer/pdf-preview.tsx` (`PdfPreview`)
- Flow:
  - Uses `usePdfBlob` to render `PdfDocument` into a blob URL
  - Loads the PDF via `pdfjs-dist` (`getDocument`)
  - Virtualizes pages with `@tanstack/react-virtual`
  - Renders each page to a canvas via `src/components/pdf-renderer/pdf-page.tsx`

## Notion Block Rendering

`src/components/pdf-renderer/notion-renderer.tsx` maps Notion block types to React-PDF components:
- Each block type has a dedicated renderer in `src/components/pdf-renderer/blocks/`
- Lists and toggles recurse into children
- Page breaks are applied via settings (H1/H2/H3/divider)

## Implementing Future Blocks

1. **Create a block component**
   - Add a new file in `src/components/pdf-renderer/blocks/`
   - Example: `quote.tsx`, `callout.tsx`
2. **Export it**
   - Add it to `src/components/pdf-renderer/blocks/index.ts`
3. **Wire it in**
   - Add a `case` to the switch in `src/components/pdf-renderer/notion-renderer.tsx`
4. **Add styles**
   - Extend `getRendererStyles` in `src/components/pdf-renderer/styles.ts` as needed
5. **Handle children (if any)**
   - Follow the patterns in list items or toggles for recursive rendering
6. **Validate data**
   - Use `BlockByType<T>` from `src/components/pdf-renderer/types.ts` for proper typing

### Suggested Block Template
```tsx
import type { BlockByType } from "../types";
import type { BlockStyles } from "../styles";
import { Text, View } from "@react-pdf/renderer";

type ExampleBlockProps = {
  block: BlockByType<"example_block_type">;
  styles: BlockStyles;
};

export const ExampleBlock = ({ block, styles }: ExampleBlockProps) => (
  <View>
    <Text>{/* render block content here */}</Text>
  </View>
);
```
