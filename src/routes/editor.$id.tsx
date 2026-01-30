import { useState } from "react";

import { PdfPreview } from "@/components/pdf-renderer/pdf-preview";
import { SettingsPanel } from "@/components/settings-panel";
import { FieldGroup } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";

import { pdfSettingsParsers } from "@/lib/pdf-settings";

import { createFileRoute } from "@tanstack/react-router";
import { useQueryStates } from "nuqs";
import { fetchNotionBlocks, fetchNotionPage } from "@/server/notion";

export const Route = createFileRoute("/editor/$id")({
	component: EditorPage,
	loader: async ({ params }) => {
		const page = await fetchNotionPage({ data: { id: params.id } });
		const blocks = await fetchNotionBlocks({ data: { id: params.id } });
		let pageTitle = "";
		if (page.object === "page" && "properties" in page) {
			const titleProperty = page.properties?.title;
			if (titleProperty && "title" in titleProperty) {
				console.log("✨ titleProperty", titleProperty);
				pageTitle = titleProperty.title[0]?.plain_text || "Notion Page";
			}
		}
		return { pageTitle, blocks };
	},
});

function EditorPage() {
	const { pageTitle, blocks } = Route.useLoaderData();
	const [settings] = useQueryStates(pdfSettingsParsers);
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
				<ScrollArea className="h-[calc(100vh-3rem)] w-full overflow-hidden rounded border bg-background">
					<PdfPreview
						title={pageTitle}
						blocks={blocks}
						settings={settings}
						onBlobUrlChange={setDownloadUrl}
					/>
				</ScrollArea>
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
