import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

import { useSettingsPanelContext } from "./context";

export const SettingsPanelPageBreakField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Page Break</FieldLabel>
			<div className="flex flex-col gap-2 text-xs">
				<label className="flex items-center gap-2" htmlFor="split-h1">
					<Checkbox
						id="split-h1"
						checked={settings.splitByH1}
						onCheckedChange={(checked) =>
							setSettings({ splitByH1: checked === true })
						}
					/>
					Split pages by H1
				</label>
				<label className="flex items-center gap-2" htmlFor="split-h2">
					<Checkbox
						id="split-h2"
						checked={settings.splitByH2}
						onCheckedChange={(checked) =>
							setSettings({ splitByH2: checked === true })
						}
					/>
					Split pages by H2
				</label>
				<label className="flex items-center gap-2" htmlFor="split-h3">
					<Checkbox
						id="split-h3"
						checked={settings.splitByH3}
						onCheckedChange={(checked) =>
							setSettings({ splitByH3: checked === true })
						}
					/>
					Split pages by H3
				</label>
				<label className="flex items-center gap-2" htmlFor="split-divider">
					<Checkbox
						id="split-divider"
						checked={settings.splitByDivider}
						onCheckedChange={(checked) =>
							setSettings({ splitByDivider: checked === true })
						}
					/>
					Split pages by Divider
				</label>
			</div>
		</Field>
	);
};
