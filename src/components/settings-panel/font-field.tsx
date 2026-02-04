import { FontPicker } from "@/components/font-picker";
import { Field, FieldLabel } from "@/components/ui/field";

import { FONTS } from "@/lib/fonts";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelFontField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Font</FieldLabel>
			<FontPicker
				fonts={FONTS}
				value={settings.font}
				onChange={(value) => setSettings({ font: value })}
			/>
		</Field>
	);
};
