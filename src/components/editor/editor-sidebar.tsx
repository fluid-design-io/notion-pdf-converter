import { SettingsPanel } from "@/components/settings-panel";
import { FieldGroup } from "@/components/ui/field";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

import { SidebarCollapsedToolbar } from "./sidebar-collapsed-toolbar";

type EditorSidebarProps = {
	downloadUrl: string | null;
	onDownload: () => void;
};

export const EditorSidebar = ({
	downloadUrl,
	onDownload,
}: EditorSidebarProps) => {
	return (
		<SettingsPanel downloadUrl={downloadUrl} onDownload={onDownload}>
			<SidebarCollapsedToolbar />
			<Sidebar side="right" collapsible="offcanvas" variant="inset">
				<SidebarHeader className="relative">
					<SettingsPanel.Header />
					<div className="pointer-events-none absolute inset-x-0 top-full z-10 h-8 bg-linear-180 from-sidebar to-transparent" />
				</SidebarHeader>

				<SidebarContent>
					<FieldGroup className="gap-4 px-2 py-6">
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
				</SidebarContent>

				<SidebarFooter className="relative">
					<div className="pointer-events-none absolute inset-x-0 bottom-full z-10 h-8 bg-linear-0 from-sidebar to-transparent" />
					<SettingsPanel.Footer />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
		</SettingsPanel>
	);
};
