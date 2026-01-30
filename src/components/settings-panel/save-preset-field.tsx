import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelSavePresetField = () => {
	const { presetName, setPresetName, savePreset } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Save Preset</FieldLabel>
			<div className="flex flex-col gap-2">
				<Input
					value={presetName}
					onChange={(event) => setPresetName(event.target.value)}
					placeholder="Preset name"
				/>
				<Button type="button" variant="outline" size="sm" onClick={savePreset}>
					Save current
				</Button>
			</div>
		</Field>
	);
};
