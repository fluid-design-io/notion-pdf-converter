import { Field, FieldLabel } from "@/components/ui/field";

import { Input } from "../ui/input";
import { useSettingsPanelContext } from "./context";

const MarginLabel = ({ children }: { children: React.ReactNode }) => (
	<span className="flex items-center justify-center rounded-none border border-border border-r-0 px-1.5 py-1 text-muted-foreground text-xs uppercase">
		{children}
	</span>
);

export const SettingsPanelMarginsField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Margins</FieldLabel>
			<div className="grid grid-cols-2 gap-2">
				<div className="flex">
					<MarginLabel>T</MarginLabel>
					<Input
						value={settings.marginTop}
						onChange={(event) =>
							setSettings({ marginTop: Number(event.target.value) })
						}
						inputMode="decimal"
						className="text-xs"
						type="number"
					/>
				</div>
				<div className="flex">
					<MarginLabel>R</MarginLabel>
					<Input
						value={settings.marginRight}
						onChange={(event) =>
							setSettings({ marginRight: Number(event.target.value) })
						}
						inputMode="decimal"
						className="text-xs"
						type="number"
					/>
				</div>
				<div className="flex">
					<MarginLabel>B</MarginLabel>
					<Input
						value={settings.marginBottom}
						onChange={(event) =>
							setSettings({ marginBottom: Number(event.target.value) })
						}
						inputMode="decimal"
						className="text-xs"
						type="number"
					/>
				</div>
				<div className="flex">
					<MarginLabel>L</MarginLabel>
					<Input
						value={settings.marginLeft}
						onChange={(event) =>
							setSettings({ marginLeft: Number(event.target.value) })
						}
						inputMode="decimal"
						className="text-xs"
						type="number"
					/>
				</div>
			</div>
		</Field>
	);
};
