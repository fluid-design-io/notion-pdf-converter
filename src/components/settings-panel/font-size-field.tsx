import { Field, FieldLabel } from "@/components/ui/field";
import { Stepper } from "@/components/ui/stepper";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelFontSizeField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Font Size</FieldLabel>
			<Stepper
				value={settings.fontSize}
				onChange={(value) => setSettings({ fontSize: value })}
				min={8}
				max={32}
				step={1}
			/>
		</Field>
	);
};
