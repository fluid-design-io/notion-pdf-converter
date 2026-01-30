import "@fontsource/roboto";
import "@fontsource/outfit";

export const FONTS = [
	{
		family: "Roboto",
		fonts: [
			{ src: "/fonts/roboto/roboto-latin-100-normal.ttf", fontWeight: 100 },
			{ src: "/fonts/roboto/roboto-latin-100-italic.ttf", fontStyle: "italic" },
			{ src: "/fonts/roboto/roboto-latin-200-normal.ttf", fontWeight: 200 },
			{ src: "/fonts/roboto/roboto-latin-200-italic.ttf", fontStyle: "italic" },
			{ src: "/fonts/roboto/roboto-latin-300-normal.ttf", fontWeight: 300 },
			{ src: "/fonts/roboto/roboto-latin-300-italic.ttf", fontStyle: "italic" },
			{ src: "/fonts/roboto/roboto-latin-400-normal.ttf", fontWeight: 400 },
			{ src: "/fonts/roboto/roboto-latin-400-italic.ttf", fontStyle: "italic" },
			{ src: "/fonts/roboto/roboto-latin-500-normal.ttf", fontWeight: 500 },
			{ src: "/fonts/roboto/roboto-latin-500-italic.ttf", fontStyle: "italic" },
			{ src: "/fonts/roboto/roboto-latin-600-normal.ttf", fontWeight: 600 },
			{ src: "/fonts/roboto/roboto-latin-600-italic.ttf", fontStyle: "italic" },
			{ src: "/fonts/roboto/roboto-latin-700-normal.ttf", fontWeight: 700 },
			{ src: "/fonts/roboto/roboto-latin-700-italic.ttf", fontStyle: "italic" },
			{ src: "/fonts/roboto/roboto-latin-800-normal.ttf", fontWeight: 800 },
			{ src: "/fonts/roboto/roboto-latin-800-italic.ttf", fontStyle: "italic" },
			{ src: "/fonts/roboto/roboto-latin-900-normal.ttf", fontWeight: 900 },
			{ src: "/fonts/roboto/roboto-latin-900-italic.ttf", fontStyle: "italic" },
		],
	},
	// {
	// 	family: "Outfit",
	// 	fonts: [
	// 		{ src: "/fonts/outfit/outfit-latin-100-normal.ttf", fontWeight: 100 },
	// 		{ src: "/fonts/outfit/outfit-latin-200-normal.ttf", fontWeight: 200 },
	// 		{ src: "/fonts/outfit/outfit-latin-300-normal.ttf", fontWeight: 300 },
	// 		{ src: "/fonts/outfit/outfit-latin-400-normal.ttf", fontWeight: 400 },
	// 		{ src: "/fonts/outfit/outfit-latin-500-normal.ttf", fontWeight: 500 },
	// 		{ src: "/fonts/outfit/outfit-latin-600-normal.ttf", fontWeight: 600 },
	// 		{ src: "/fonts/outfit/outfit-latin-700-normal.ttf", fontWeight: 700 },
	// 		{ src: "/fonts/outfit/outfit-latin-800-normal.ttf", fontWeight: 800 },
	// 		{ src: "/fonts/outfit/outfit-latin-900-normal.ttf", fontWeight: 900 },
	// 	],
	// },
] as const;

export type FontType = (typeof FONTS)[number];
