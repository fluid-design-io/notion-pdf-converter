import { Button } from "@/components/ui/button";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelFooter = () => {
	const { resetSettings } = useSettingsPanelContext();

	return (
		<div className="mt-8">
			<Button variant="ghost" size="sm" onClick={resetSettings}>
				Reset to defaults
			</Button>
		</div>
	);
};
