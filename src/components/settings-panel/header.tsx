import { SidebarTrigger } from "@/components/ui/sidebar";

import Logo from "../logo";

export const SettingsPanelHeader = () => {
	return (
		<div className="flex items-center justify-between">
			<Logo className="h-6" />
			<SidebarTrigger />
		</div>
	);
};
