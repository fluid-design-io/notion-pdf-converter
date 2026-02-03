import { useState } from "react";

import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { PdfPreview } from "@/components/pdf-renderer/pdf-preview";
import {
	Sidebar,
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";

import { createFileRoute } from "@tanstack/react-router";
import { fetchNotionBlocks, fetchNotionPage } from "@/server/notion";

export const Route = createFileRoute("/editor/$id")({
	component: EditorPage,
	loader: async ({ params }) => {
		const page = await fetchNotionPage({ data: { id: params.id } });
		const blocks = await fetchNotionBlocks({ data: { id: params.id } });
		let pageTitle = "";
		if (page.object === "page" && "properties" in page) {
			console.log("Page properties", page.properties);
			const titleProperty = page.properties?.Name;
			if (titleProperty && "title" in titleProperty) {
				pageTitle = titleProperty.title[0]?.plain_text || "Notion Page";
			}
		}
		return { pageTitle, blocks };
	},
	staleTime: 1000 * 60 * 10, // 10 minutes
	gcTime: 1000 * 60 * 60 * 24, // 24 hours
});

function EditorPage() {
	const { pageTitle, blocks } = Route.useLoaderData();
	console.log("PageTitle", pageTitle);

	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

	const handleDownload = () => {
		if (!downloadUrl) return;
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = `${pageTitle}.pdf`;
		link.click();
	};

	return (
		<SidebarProvider className="h-svh bg-sidebar text-sidebar-foreground">
			<SidebarInset className="relative bg-sidebar">
				<PdfPreview
					title={pageTitle}
					blocks={blocks}
					onBlobUrlChange={setDownloadUrl}
				/>
			</SidebarInset>
			<Sidebar side="right" collapsible="icon" variant="inset">
				<EditorSidebar downloadUrl={downloadUrl} onDownload={handleDownload} />
			</Sidebar>
		</SidebarProvider>
	);
}
