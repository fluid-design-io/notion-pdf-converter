import { IconDownload, IconRefresh, IconRotate2 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	ButtonGroup,
	ButtonGroupSeparator,
} from "@/components/ui/button-group";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelFooter = () => {
	const { downloadUrl, onDownload, onRefresh, resetSettings } =
		useSettingsPanelContext();

	return (
		<ButtonGroup aria-label="Settings actions" className="w-full justify-end">
			<Button
				variant="outline"
				size="icon-sm"
				onClick={onDownload}
				disabled={!downloadUrl}
				aria-label="Download PDF"
			>
				<IconDownload />
			</Button>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={onRefresh}
				aria-label="Refresh"
			>
				<IconRefresh />
			</Button>
			<ButtonGroupSeparator />
			<Button
				variant="outline"
				size="icon-sm"
				onClick={resetSettings}
				aria-label="Reset to defaults"
			>
				<IconRotate2 />
			</Button>
		</ButtonGroup>
	);
};
