import { Fragment } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import {
	ToggleGroup,
	ToggleGroupItem,
	ToggleGroupSeparator,
} from "@/components/ui/toggle-group";

import { themeOptions } from "@/lib/pdf-settings";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelThemeField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Theme</FieldLabel>
			<ToggleGroup
				variant="outline"
				value={[settings.theme]}
				onValueChange={(value) => {
					const theme = value[0];
					if (theme) setSettings({ theme });
				}}
			>
				{themeOptions.map((option, index) => (
					<Fragment key={`theme-${option}`}>
						<ToggleGroupItem
							value={option}
							className="hover:bg-background data-pressed:bg-background"
						>
							{option === "light" ? "Light" : "Dark"}
						</ToggleGroupItem>
						{index !== themeOptions.length - 1 && <ToggleGroupSeparator />}
					</Fragment>
				))}
			</ToggleGroup>
		</Field>
	);
};
