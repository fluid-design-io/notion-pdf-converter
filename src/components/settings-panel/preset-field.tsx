import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelPresetField = () => {
	const {
		presets,
		selectedPresetId,
		setSelectedPresetId,
		applyPreset,
		deletePreset,
	} = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Preset</FieldLabel>
			<div className="flex flex-col gap-2">
				<Select
					value={selectedPresetId ?? undefined}
					onValueChange={(value) => setSelectedPresetId(value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select preset" />
					</SelectTrigger>
					<SelectContent>
						{presets.length === 0 && (
							<SelectItem value="empty" disabled>
								No presets yet
							</SelectItem>
						)}
						{presets.map((preset) => (
							<SelectItem key={preset.id} value={preset.id}>
								{preset.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="flex gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={applyPreset}
						disabled={!selectedPresetId}
					>
						Apply
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={deletePreset}
						disabled={!selectedPresetId}
					>
						Delete
					</Button>
				</div>
			</div>
		</Field>
	);
};
