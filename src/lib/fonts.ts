import "@fontsource/roboto/400";
import "@fontsource/roboto/700";

import "@fontsource/monaspace-neon/400";
import "@fontsource/monaspace-neon/700";

import "@fontsource/lora/400";
import "@fontsource/lora/700";

/** Supported fonts to render in the PDF, we're using weights 400, 600 and 700 for all the fonts. */
export const FONTS = [
	{
		family: "Roboto",
		fonts: [
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-normal.woff",
				fontWeight: 400,
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-italic.woff",
				fontWeight: 400,
				fontStyle: "italic",
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-600-normal.woff",
				fontWeight: 600,
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-600-italic.woff",
				fontWeight: 600,
				fontStyle: "italic",
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-700-normal.woff",
				fontWeight: 700,
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-700-italic.woff",
				fontWeight: 700,
				fontStyle: "italic",
			},
		],
	},
	{
		family: "Monospace",
		fonts: [
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/monaspace-neon@latest/latin-400-normal.woff",
				fontWeight: 400,
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/monaspace-neon@latest/latin-400-italic.woff",
				fontWeight: 400,
				fontStyle: "italic",
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/monaspace-neon@latest/latin-600-normal.woff",
				fontWeight: 600,
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/monaspace-neon@latest/latin-600-italic.woff",
				fontWeight: 600,
				fontStyle: "italic",
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/monaspace-neon@latest/latin-700-normal.woff",
				fontWeight: 700,
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/monaspace-neon@latest/latin-700-italic.woff",
				fontWeight: 700,
				fontStyle: "italic",
			},
		],
	},
	{
		family: "Lora",
		fonts: [
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-400-normal.woff",
				fontWeight: 400,
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-400-italic.woff",
				fontWeight: 400,
				fontStyle: "italic",
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-600-normal.woff",
				fontWeight: 600,
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-600-italic.woff",
				fontWeight: 600,
				fontStyle: "italic",
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-700-normal.woff",
				fontWeight: 700,
			},
			{
				src: "https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-700-italic.woff",
				fontWeight: 700,
				fontStyle: "italic",
			},
		],
	},
] as const;

export type FontType = (typeof FONTS)[number];
