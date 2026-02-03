import { SettingsPanel } from "@/components/settings-panel";
import { FieldGroup } from "@/components/ui/field";
import {
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

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
			<SidebarHeader>
				<SettingsPanel.Header />
			</SidebarHeader>
			<SidebarContent>
				<FieldGroup className="gap-4 px-2 pb-2">
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
			<SidebarFooter>
				<SettingsPanel.Footer />
			</SidebarFooter>
			<SidebarRail />
		</SettingsPanel>
	);
};
