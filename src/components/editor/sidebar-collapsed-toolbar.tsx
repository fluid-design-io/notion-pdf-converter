import {
	IconChevronLeft,
	IconDownload,
	IconRotate2,
	IconSettings2,
} from "@tabler/icons-react";

import { useSettingsPanelContext } from "@/components/settings-panel/context";
import { Button } from "@/components/ui/button";
import {
	ButtonGroup,
	ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { useSidebar } from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import { useIsMobile } from "@/hooks/use-mobile";

export const SidebarCollapsedToolbar = () => {
	const { state, toggleSidebar } = useSidebar();
	const { resetSettings, downloadUrl, onDownload } = useSettingsPanelContext();
	const isMobile = useIsMobile();
	if (state === "expanded") return null;
	if (isMobile) {
		return (
			<div
				className={cn(
					"fixed flex justify-between",
					"border-border border-t",
					"inset-x-0 bottom-0",
					"z-11 bg-popover shadow-2xl shadow-black",
				)}
			>
				<Button
					variant="outline"
					onClick={onDownload}
					disabled={!downloadUrl}
					className="border-y-0 border-l-0"
				>
					<IconDownload />
					Download PDF
				</Button>

				<Button
					variant="outline"
					onClick={toggleSidebar}
					className="border-y-0 border-r-0"
				>
					<IconSettings2 />
					Settings
				</Button>
			</div>
		);
	}
	return (
		<div
			className={cn(
				"fixed",
				"top-4 right-0 bottom-auto",
				"z-11 bg-popover shadow-2xl shadow-black",
			)}
		>
			<ButtonGroup orientation={isMobile ? "horizontal" : "vertical"}>
				<Tooltip>
					<TooltipTrigger
						render={
							<Button variant="ghost" size="icon-lg" onClick={toggleSidebar} />
						}
					>
						<IconChevronLeft />
					</TooltipTrigger>
					<TooltipContent side="left">
						<p>Toggle sidebar</p>
					</TooltipContent>
				</Tooltip>
				<ButtonGroupSeparator />
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="ghost"
								onClick={resetSettings}
								aria-label="Reset to defaults"
							/>
						}
					>
						<IconRotate2 />
					</TooltipTrigger>
					<TooltipContent side="left">
						<p>Reset to defaults</p>
					</TooltipContent>
				</Tooltip>
				<ButtonGroupSeparator />

				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								onClick={onDownload}
								disabled={!downloadUrl}
								aria-label="Reset to defaults"
								className="border-none"
							/>
						}
					>
						<IconDownload />
					</TooltipTrigger>
					<TooltipContent side="left">
						<p>Download PDF</p>
					</TooltipContent>
				</Tooltip>
			</ButtonGroup>
		</div>
	);
};
