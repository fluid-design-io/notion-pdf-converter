import { IconDownload, IconRefresh, IconRotate2 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	ButtonGroup,
	ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelFooter = () => {
	const { downloadUrl, onDownload, onRefresh, resetSettings } =
		useSettingsPanelContext();

	return (
		<ButtonGroup
			aria-label="Settings actions"
			className="w-full justify-between"
		>
			<ButtonGroup className="border">
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
					<TooltipContent>
						<p>Download PDF</p>
					</TooltipContent>
				</Tooltip>
				<ButtonGroupSeparator />
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="ghost"
								onClick={onRefresh}
								aria-label="Refresh"
							/>
						}
					>
						<IconRefresh />
					</TooltipTrigger>
					<TooltipContent>
						<p>Refresh</p>
					</TooltipContent>
				</Tooltip>
			</ButtonGroup>
			<ButtonGroup>
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								onClick={resetSettings}
								aria-label="Reset to defaults"
							/>
						}
					>
						<IconRotate2 />
					</TooltipTrigger>
					<TooltipContent>
						<p>Reset to defaults</p>
					</TooltipContent>
				</Tooltip>
			</ButtonGroup>
		</ButtonGroup>
	);
};
