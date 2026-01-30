import { Button } from "@/components/ui/button";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelActions = () => {
	const { downloadUrl, onDownload, onRefresh } = useSettingsPanelContext();

	return (
		<div className="mb-4 flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={onDownload}
				disabled={!downloadUrl}
			>
				Download
			</Button>
			<Button variant="outline" size="sm" onClick={onRefresh}>
				Refresh
			</Button>
		</div>
	);
};
