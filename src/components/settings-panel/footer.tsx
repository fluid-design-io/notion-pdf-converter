import { IconDownload, IconRefresh, IconRotate2 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
					<TooltipTrigger>
						<Button
							variant="ghost"
							onClick={onDownload}
							disabled={!downloadUrl}
							aria-label="Download PDF"
						>
							<IconDownload />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Download PDF</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger>
						<Button variant="ghost" onClick={onRefresh} aria-label="Refresh">
							<IconRefresh />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Refresh</p>
					</TooltipContent>
				</Tooltip>
			</ButtonGroup>
			<ButtonGroup>
				<Tooltip>
					<TooltipTrigger>
						<Button
							variant="outline"
							onClick={resetSettings}
							aria-label="Reset to defaults"
						>
							<IconRotate2 />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Reset to defaults</p>
					</TooltipContent>
				</Tooltip>
			</ButtonGroup>
		</ButtonGroup>
	);
};
