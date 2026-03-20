import { useMemo, useState } from "react";
import { Archive, FileDown, FileText, Save, Trash2, Upload } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { runSimulation, type SimulationResults } from "@/lib/simulation";
import { type SimulationInputs } from "@/components/InputModule";
import type { SavedScenario } from "@/lib/scenario-storage";
import { exportSimulationReport } from "@/lib/report-export";
import { exportSimulationSummary } from "@/lib/summary-export";

interface SavedScenariosProps {
  currentInputs: SimulationInputs;
  currentResults: SimulationResults;
  savedScenarios: SavedScenario[];
  onSaveScenario: (name: string) => void;
  onLoadScenario: (scenarioId: string) => void;
  onDeleteScenario: (scenarioId: string) => void;
}

const INR_PER_USD = 83;

const formatCurrency = (value: number) => {
  const inrValue = value * INR_PER_USD;
  if (Math.abs(inrValue) >= 10_000_000) return `₹${(inrValue / 10_000_000).toFixed(2)} Cr`;
  if (Math.abs(inrValue) >= 100_000) return `₹${(inrValue / 100_000).toFixed(1)} L`;
  return `₹${inrValue.toFixed(0)}`;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const SavedScenarios = ({
  currentInputs,
  currentResults,
  savedScenarios,
  onSaveScenario,
  onLoadScenario,
  onDeleteScenario,
}: SavedScenariosProps) => {
  const [scenarioName, setScenarioName] = useState("");

  const scenarioCards = useMemo(
    () =>
      savedScenarios.map((scenario) => ({
        ...scenario,
        results: runSimulation(scenario.inputs),
      })),
    [savedScenarios],
  );

  const currentFingerprint = JSON.stringify(currentInputs);

  const handleSave = () => {
    const trimmedName = scenarioName.trim();
    onSaveScenario(trimmedName || `Scenario ${savedScenarios.length + 1}`);
    setScenarioName("");
  };

  const handleExportCurrent = async () => {
    await exportSimulationReport({
      inputs: currentInputs,
      results: currentResults,
      scenarioName: scenarioName.trim() || "current-live-model",
    });
  };

  const handleSummaryCurrent = () => {
    exportSimulationSummary({
      inputs: currentInputs,
      results: currentResults,
      scenarioName: scenarioName.trim() || "current-live-model",
    });
  };

  return (
    <section className="section-shell pt-8">
      <div className="container mx-auto px-6">
        <SectionReveal className="mx-auto mb-10 max-w-3xl text-center">
          <div className="section-kicker mb-5">Saved scenarios</div>
          <h2 className="section-title">
            Keep your best cases in a <span className="text-gradient-primary">local scenario vault</span>
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Save promising configurations locally, reload them instantly, and compare their commercial shape without re-entering the same assumptions.
          </p>
        </SectionReveal>

        <SectionReveal delayMs={120} className="glass-panel-strong mx-auto max-w-6xl p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                <Save className="h-4 w-4 text-primary" />
                Save current live scenario
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="scenario-name" className="mb-2 block text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Scenario name
                  </label>
                  <input
                    id="scenario-name"
                    type="text"
                    value={scenarioName}
                    onChange={(event) => setScenarioName(event.target.value)}
                    placeholder="North plant / Q2 case"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="chart-stat-tile">
                    <div className="eyebrow-label">Current ROI</div>
                    <div className="mt-2 text-lg font-semibold text-primary">{currentResults.roiPercent.toFixed(1)}%</div>
                  </div>
                  <div className="chart-stat-tile">
                    <div className="eyebrow-label">Annual profit</div>
                    <div className="mt-2 text-lg font-semibold text-foreground">{formatCurrency(currentResults.yearlyProfit)}</div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button type="button" onClick={handleSave} className="button-primary w-full justify-center">
                    <Archive className="h-4 w-4" />
                    Save locally
                  </button>
                  <button type="button" onClick={handleExportCurrent} className="button-secondary w-full justify-center">
                    <FileDown className="h-4 w-4" />
                    Export PDF
                  </button>
                  <button type="button" onClick={handleSummaryCurrent} className="button-secondary w-full justify-center">
                    <FileText className="h-4 w-4" />
                    Summary
                  </button>
                </div>
                <p className="text-xs leading-6 text-muted-foreground">
                  Saved scenarios are stored only in this browser on this device. Summary downloads are exported as markdown files.
                </p>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Scenario vault</p>
                  <p className="mt-1 text-xs text-muted-foreground">Load, review, or remove locally stored configurations.</p>
                </div>
                <div className="chart-note">{scenarioCards.length} saved</div>
              </div>

              {scenarioCards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-8 text-center text-sm text-muted-foreground">
                  No saved scenarios yet. Store a live case to start building a reference library.
                </div>
              ) : (
                <div className="space-y-3">
                  {scenarioCards.map((scenario) => {
                    const isCurrent = JSON.stringify(scenario.inputs) === currentFingerprint;

                    return (
                      <div key={scenario.id} className={`rounded-2xl border px-4 py-4 ${isCurrent ? "border-primary/35 bg-primary/10" : "border-white/10 bg-black/20"}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">{scenario.name}</p>
                              {isCurrent && <span className="chart-note">Loaded</span>}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Saved {formatDate(scenario.createdAt)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => onLoadScenario(scenario.id)} className="chart-action-button">
                              <Upload className="h-3.5 w-3.5" />
                              Load
                            </button>
                            <button
                              type="button"
                              onClick={() => exportSimulationReport({ inputs: scenario.inputs, results: scenario.results, scenarioName: scenario.name })}
                              className="chart-action-button"
                            >
                              <FileDown className="h-3.5 w-3.5" />
                              PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => exportSimulationSummary({ inputs: scenario.inputs, results: scenario.results, scenarioName: scenario.name })}
                              className="chart-action-button"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Summary
                            </button>
                            <button type="button" onClick={() => onDeleteScenario(scenario.id)} className="chart-action-button">
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div className="chart-stat-tile">
                            <div className="eyebrow-label">ROI</div>
                            <div className="mt-2 text-base font-semibold text-primary">{scenario.results.roiPercent.toFixed(1)}%</div>
                          </div>
                          <div className="chart-stat-tile">
                            <div className="eyebrow-label">Annual profit</div>
                            <div className="mt-2 text-base font-semibold text-foreground">{formatCurrency(scenario.results.yearlyProfit)}</div>
                          </div>
                          <div className="chart-stat-tile">
                            <div className="eyebrow-label">GO output</div>
                            <div className="mt-2 text-base font-semibold text-foreground">{scenario.results.goProduced.toFixed(1)} kg/day</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default SavedScenarios;
