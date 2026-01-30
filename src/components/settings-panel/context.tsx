import * as React from "react";

import type { PdfSettings } from "@/lib/pdf-settings";
import type { Preset } from "@/lib/presets-store";

export type SettingsPanelContextValue = {
	settings: PdfSettings;
	setSettings: (values: Partial<PdfSettings>) => void;
	presets: Preset[];
	addPreset: (preset: Preset) => void;
	removePreset: (id: string) => void;
	presetName: string;
	setPresetName: (value: string) => void;
	selectedPresetId: string | null;
	setSelectedPresetId: (id: string | null) => void;
	applyPreset: () => void;
	deletePreset: () => void;
	savePreset: () => void;
	resetSettings: () => void;
	downloadUrl: string | null;
	onDownload: () => void;
	onRefresh: () => void;
};

const SettingsPanelContext = React.createContext<SettingsPanelContextValue | null>(
	null,
);

export const useSettingsPanelContext = () => {
	const context = React.use(SettingsPanelContext);
	if (!context) {
		throw new Error(
			"useSettingsPanelContext must be used within SettingsPanelProvider",
		);
	}
	return context;
};

export const SettingsPanelContextProvider = SettingsPanelContext.Provider;
