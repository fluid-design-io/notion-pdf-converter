import { useState } from "react";

import { PdfPreview } from "@/components/pdf-renderer/pdf-preview";
import { SettingsPanel } from "@/components/settings-panel";
import { FieldGroup } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";

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
		<div className="flex h-svh bg-muted text-foreground">
			<main className="relative flex flex-1 flex-col p-6">
				<PdfPreview
					title={pageTitle}
					blocks={blocks}
					onBlobUrlChange={setDownloadUrl}
				/>

				<div className="absolute right-8 bottom-8 z-10 border border-border bg-background px-1.5 py-0.5 font-medium font-mono text-foreground/80 text-xs">
					preview
				</div>
			</main>
			<ScrollArea render={<aside />} className="h-svh w-full max-w-xs">
				<div className="py-6 pr-6">
					<SettingsPanel downloadUrl={downloadUrl} onDownload={handleDownload}>
						<SettingsPanel.Header />
						<SettingsPanel.Actions />
						<FieldGroup className="gap-4">
							{/* <SettingsPanel.PresetField />
							<SettingsPanel.SavePresetField /> */}
							<SettingsPanel.ThemeField />
							<SettingsPanel.FontField />
							<SettingsPanel.FontSizeField />
							<SettingsPanel.LineHeightField />
							<SettingsPanel.HeadingScaleField />
							<SettingsPanel.MarginsField />
							<SettingsPanel.HeaderField />
							<SettingsPanel.FooterField />
							<SettingsPanel.PageSizeField />
							<SettingsPanel.OrientationField />
							<SettingsPanel.PageBreakField />
						</FieldGroup>
						<SettingsPanel.Footer />
					</SettingsPanel>
				</div>
			</ScrollArea>
		</div>
	);
}
