import { Field, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { orientationOptions } from "@/lib/pdf-settings";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelOrientationField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Orientation</FieldLabel>
			<ToggleGroup
				value={[settings.orientation]}
				onValueChange={(value) => {
					const orientation = value[0];
					if (orientation) setSettings({ orientation });
				}}
				variant="outline"
				size="sm"
			>
				{orientationOptions.map((option) => (
					<ToggleGroupItem
						key={`orientation-${option}`}
						value={option}
						className="hover:bg-background data-pressed:bg-background"
					>
						{option === "portrait" ? "Portrait" : "Landscape"}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</Field>
	);
};
