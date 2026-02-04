import { SidebarTrigger } from "@/components/ui/sidebar";

export const SettingsPanelHeader = () => {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2 font-semibold text-sm tracking-wider">
				N→P Editor
			</div>
			<SidebarTrigger />
		</div>
	);
};
