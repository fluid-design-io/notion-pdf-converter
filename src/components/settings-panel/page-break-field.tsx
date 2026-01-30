import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";

import { useSettingsPanelContext } from "./context";

const PAGE_BREAK_OPTIONS = ["H1", "H2", "H3", "Divider"] as const;

function settingsToValue(settings: {
	splitByH1: boolean;
	splitByH2: boolean;
	splitByH3: boolean;
	splitByDivider: boolean;
}): string[] {
	const value: string[] = [];
	if (settings.splitByH1) value.push("H1");
	if (settings.splitByH2) value.push("H2");
	if (settings.splitByH3) value.push("H3");
	if (settings.splitByDivider) value.push("Divider");
	return value;
}

function valueToSettings(value: string[]) {
	return {
		splitByH1: value.includes("H1"),
		splitByH2: value.includes("H2"),
		splitByH3: value.includes("H3"),
		splitByDivider: value.includes("Divider"),
	};
}

export const SettingsPanelPageBreakField = () => {
	const { settings, setSettings } = useSettingsPanelContext();
	const value = settingsToValue(settings);

	const handleValueChange = (newValue: string[]) => {
		setSettings(valueToSettings(newValue));
	};

	return (
		<Field>
			<FieldLabel>Page Break</FieldLabel>
			<Combobox
				items={[...PAGE_BREAK_OPTIONS]}
				multiple
				value={value}
				onValueChange={handleValueChange}
			>
				<ComboboxChips>
					<ComboboxValue>
						{value.map((item) => (
							<ComboboxChip key={item}>{item}</ComboboxChip>
						))}
					</ComboboxValue>
					<ComboboxChipsInput placeholder="Add page break element" />
				</ComboboxChips>
				<ComboboxContent className="md:w-72">
					<ComboboxEmpty>No items found.</ComboboxEmpty>
					<ComboboxList>
						{(item) => (
							<ComboboxItem key={item} value={item}>
								{item}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		</Field>
	);
};
