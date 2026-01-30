import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PdfSettings } from './pdf-settings'

export type Preset = {
  id: string
  name: string
  settings: PdfSettings
  createdAt: string
}

type PresetsStore = {
  presets: Preset[]
  addPreset: (preset: Preset) => void
  removePreset: (id: string) => void
  updatePreset: (id: string, settings: PdfSettings) => void
  renamePreset: (id: string, name: string) => void
  clearPresets: () => void
}

export const usePresetsStore = create<PresetsStore>()(
  persist(
    (set) => ({
      presets: [],
      addPreset: (preset) =>
        set((state) => ({ presets: [preset, ...state.presets] })),
      removePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((preset) => preset.id !== id),
        })),
      updatePreset: (id, settings) =>
        set((state) => ({
          presets: state.presets.map((preset) =>
            preset.id === id ? { ...preset, settings } : preset
          ),
        })),
      renamePreset: (id, name) =>
        set((state) => ({
          presets: state.presets.map((preset) =>
            preset.id === id ? { ...preset, name } : preset
          ),
        })),
      clearPresets: () => set({ presets: [] }),
    }),
    {
      name: 'notion-pdf-presets',
      version: 1,
    }
  )
)
