import { Field, FieldLabel } from "@/components/ui/field";
import { Stepper } from "@/components/ui/stepper";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelLineHeightField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Line Height</FieldLabel>
			<Stepper
				value={settings.lineHeight}
				onChange={(value) => setSettings({ lineHeight: value })}
				min={1}
				max={2.5}
				step={0.1}
				format={(value) => value.toFixed(1)}
				parse={(value) => Number.parseFloat(value)}
			/>
		</Field>
	);
};
