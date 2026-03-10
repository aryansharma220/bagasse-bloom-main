import type { SimulationInputs } from "@/components/InputModule";

export interface SavedScenario {
  id: string;
  name: string;
  inputs: SimulationInputs;
  createdAt: string;
}

const STORAGE_KEY = "biographx:saved-scenarios";

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const getSavedScenarios = (): SavedScenario[] => {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as SavedScenario[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const persistSavedScenarios = (scenarios: SavedScenario[]) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
};

export const createSavedScenario = (name: string, inputs: SimulationInputs): SavedScenario => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
  name,
  inputs,
  createdAt: new Date().toISOString(),
});
