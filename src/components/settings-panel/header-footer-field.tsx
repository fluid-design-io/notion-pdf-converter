import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { headerFooterContentOptions } from "@/lib/pdf-settings";

import { useSettingsPanelContext } from "./context";

type HeaderFooterContent = (typeof headerFooterContentOptions)[number];

const CONTENT_LABELS: Record<HeaderFooterContent, string> = {
	title: "Title",
	pageNumber: "Page Number",
	custom: "Custom Text",
	none: "None",
};

type SideControlsProps = {
	label: string;
	enabled: boolean;
	content: HeaderFooterContent;
	customText: string;
	onEnabledChange: (value: boolean) => void;
	onContentChange: (value: HeaderFooterContent) => void;
	onCustomTextChange: (value: string) => void;
};

const HeaderFooterSideControls = ({
	label,
	enabled,
	content,
	customText,
	onEnabledChange,
	onContentChange,
	onCustomTextChange,
}: SideControlsProps) => {
	const showCustomInput = enabled && content === "custom";

	return (
		<div className="rounded-none border border-border p-2">
			<div className="flex items-center justify-between gap-2">
				<label className="flex items-center gap-2 font-medium text-xs">
					<Checkbox checked={enabled} onCheckedChange={onEnabledChange}>
						{label}
					</Checkbox>
				</label>
				<Select
					value={content}
					onValueChange={(value) =>
						onContentChange(value as HeaderFooterContent)
					}
					disabled={!enabled}
				>
					<SelectTrigger size="sm" className="min-w-36">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{headerFooterContentOptions.map((option) => (
							<SelectItem key={option} value={option}>
								{CONTENT_LABELS[option]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			{showCustomInput && (
				<div className="mt-2">
					<Input
						value={customText}
						onChange={(event) => onCustomTextChange(event.target.value)}
						placeholder={`${label} custom text`}
						className="text-xs"
					/>
				</div>
			)}
		</div>
	);
};

export const SettingsPanelHeaderField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Header</FieldLabel>
			<div className="flex flex-col gap-2">
				<HeaderFooterSideControls
					label="Left"
					enabled={settings.headerLeftEnabled}
					content={settings.headerLeftContent}
					customText={settings.headerLeftCustomText}
					onEnabledChange={(value) => setSettings({ headerLeftEnabled: value })}
					onContentChange={(value) => setSettings({ headerLeftContent: value })}
					onCustomTextChange={(value) =>
						setSettings({ headerLeftCustomText: value })
					}
				/>
				<HeaderFooterSideControls
					label="Right"
					enabled={settings.headerRightEnabled}
					content={settings.headerRightContent}
					customText={settings.headerRightCustomText}
					onEnabledChange={(value) =>
						setSettings({ headerRightEnabled: value })
					}
					onContentChange={(value) =>
						setSettings({ headerRightContent: value })
					}
					onCustomTextChange={(value) =>
						setSettings({ headerRightCustomText: value })
					}
				/>
			</div>
		</Field>
	);
};

export const SettingsPanelFooterField = () => {
	const { settings, setSettings } = useSettingsPanelContext();

	return (
		<Field>
			<FieldLabel>Footer</FieldLabel>
			<div className="flex flex-col gap-2">
				<HeaderFooterSideControls
					label="Left"
					enabled={settings.footerLeftEnabled}
					content={settings.footerLeftContent}
					customText={settings.footerLeftCustomText}
					onEnabledChange={(value) => setSettings({ footerLeftEnabled: value })}
					onContentChange={(value) => setSettings({ footerLeftContent: value })}
					onCustomTextChange={(value) =>
						setSettings({ footerLeftCustomText: value })
					}
				/>
				<HeaderFooterSideControls
					label="Right"
					enabled={settings.footerRightEnabled}
					content={settings.footerRightContent}
					customText={settings.footerRightCustomText}
					onEnabledChange={(value) =>
						setSettings({ footerRightEnabled: value })
					}
					onContentChange={(value) =>
						setSettings({ footerRightContent: value })
					}
					onCustomTextChange={(value) =>
						setSettings({ footerRightCustomText: value })
					}
				/>
			</div>
		</Field>
	);
};
