import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

export const SettingsPanelHeader = () => {
	const { state } = useSidebar();
	return (
		<div className="flex items-center justify-between">
			<div
				className={cn(
					"flex items-center gap-2 font-semibold text-sm",
					state === "collapsed" && "hidden",
				)}
			>
				PDF Editor
			</div>
			<SidebarTrigger />
		</div>
	);
};
