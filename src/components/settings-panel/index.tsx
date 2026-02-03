import * as React from "react";

import { defaultPdfSettings, pdfSettingsParsers } from "@/lib/pdf-settings";
import { usePresetsStore } from "@/lib/presets-store";

import { useRouter } from "@tanstack/react-router";
import { useQueryStates } from "nuqs";
import { SettingsPanelContextProvider } from "./context";
import { SettingsPanelFontField } from "./font-field";
import { SettingsPanelFontSizeField } from "./font-size-field";
import { SettingsPanelFooter } from "./footer";
import { SettingsPanelHeader } from "./header";
import {
	SettingsPanelFooterField,
	SettingsPanelHeaderField,
} from "./header-footer-field";
import { SettingsPanelHeadingScaleField } from "./heading-scale-field";
import { SettingsPanelLineHeightField } from "./line-height-field";
import { SettingsPanelMarginsField } from "./margins-field";
import { SettingsPanelOrientationField } from "./orientation-field";
import { SettingsPanelPageBreakField } from "./page-break-field";
import { SettingsPanelPageSizeField } from "./page-size-field";
import { SettingsPanelPresetField } from "./preset-field";
import { SettingsPanelSavePresetField } from "./save-preset-field";
import { SettingsPanelThemeField } from "./theme-field";

export type SettingsPanelProps = {
	downloadUrl?: string | null;
	onDownload?: () => void;
};

const SettingsPanelProvider = ({
	downloadUrl = null,
	onDownload = () => {},
	children,
}: React.PropsWithChildren<SettingsPanelProps>) => {
	const router = useRouter();

	// Use useTransition to prevent heavy rendering delays when updating settings
	const [settings, setSettings] = useQueryStates(pdfSettingsParsers, {
		shallow: true,
		limitUrlUpdates: {
			method: "debounce",
			timeMs: 650,
		},
	});
	const { presets, addPreset, removePreset } = usePresetsStore();
	const [presetName, setPresetName] = React.useState("");
	const [selectedPresetId, setSelectedPresetId] = React.useState<string | null>(
		presets[0]?.id ?? null,
	);

	React.useEffect(() => {
		if (!selectedPresetId && presets.length > 0) {
			setSelectedPresetId(presets[0].id);
		}
	}, [presets, selectedPresetId]);

	const resetSettings = React.useCallback(() => {
		setSettings(defaultPdfSettings);
	}, [setSettings]);

	const applyPreset = React.useCallback(() => {
		const preset = presets.find((item) => item.id === selectedPresetId);
		if (!preset) return;
		setSettings({
			...preset.settings,
			notionUrl: settings.notionUrl,
		});
	}, [presets, selectedPresetId, setSettings, settings.notionUrl]);

	const deletePreset = React.useCallback(() => {
		if (!selectedPresetId) return;
		removePreset(selectedPresetId);
		setSelectedPresetId(null);
	}, [removePreset, selectedPresetId]);

	const savePreset = React.useCallback(() => {
		const trimmed = presetName.trim();
		if (!trimmed) return;
		const { notionUrl, ...presetSettings } = settings;
		const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
		addPreset({
			id,
			name: trimmed,
			settings: { ...presetSettings, notionUrl: "" },
			createdAt: new Date().toISOString(),
		});
		setPresetName("");
		setSelectedPresetId(id);
	}, [addPreset, presetName, settings]);

	return (
		<SettingsPanelContextProvider
			value={{
				settings,
				setSettings,
				presets,
				addPreset,
				removePreset,
				presetName,
				setPresetName,
				selectedPresetId,
				setSelectedPresetId,
				applyPreset,
				deletePreset,
				savePreset,
				resetSettings,
				downloadUrl: downloadUrl ?? null,
				onDownload,
				onRefresh: () => router.invalidate(),
			}}
		>
			{children}
		</SettingsPanelContextProvider>
	);
};

const SettingsPanelRoot = (
	props: React.PropsWithChildren<SettingsPanelProps>,
) => <SettingsPanelProvider {...props}>{props.children}</SettingsPanelProvider>;

export const SettingsPanel = Object.assign(SettingsPanelRoot, {
	Header: SettingsPanelHeader,
	PresetField: SettingsPanelPresetField,
	SavePresetField: SettingsPanelSavePresetField,
	ThemeField: SettingsPanelThemeField,
	FontField: SettingsPanelFontField,
	FontSizeField: SettingsPanelFontSizeField,
	LineHeightField: SettingsPanelLineHeightField,
	HeadingScaleField: SettingsPanelHeadingScaleField,
	MarginsField: SettingsPanelMarginsField,
	HeaderField: SettingsPanelHeaderField,
	FooterField: SettingsPanelFooterField,
	PageSizeField: SettingsPanelPageSizeField,
	OrientationField: SettingsPanelOrientationField,
	PageBreakField: SettingsPanelPageBreakField,
	Footer: SettingsPanelFooter,
});
