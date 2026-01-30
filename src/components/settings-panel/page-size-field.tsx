import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { pageSizeOptions } from "@/lib/pdf-settings";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelPageSizeField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Page Size</FieldLabel>
			<Select
				value={settings.pageSize}
				onValueChange={(value) => {
					const pageSize = value as "letter" | "a4" | "legal";
					if (pageSize) setSettings({ pageSize });
				}}
			>
				<SelectTrigger>
					<SelectValue className="uppercase" />
				</SelectTrigger>
				<SelectContent>
					{pageSizeOptions.map((size) => (
						<SelectItem key={size} value={size}>
							{size.toUpperCase()}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</Field>
	);
};
