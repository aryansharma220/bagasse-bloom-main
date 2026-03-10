import SectionReveal from "@/components/SectionReveal";
import { runSimulation, type SimulationResults } from "@/lib/simulation";
import { type SimulationInputs, simulationPresets } from "@/components/InputModule";

interface ScenarioComparisonProps {
  currentInputs: SimulationInputs;
  currentResults: SimulationResults;
}

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const ScenarioComparison = ({ currentInputs, currentResults }: ScenarioComparisonProps) => {
  const presetScenarios = simulationPresets.map((preset) => ({
    id: preset.id,
    label: preset.label,
    description: preset.description,
    results: runSimulation(preset.values),
    isCurrent: false,
  }));

  const scenarios = [
    {
      id: "current",
      label: "Current",
      description: "Your live working scenario based on the latest inputs.",
      results: currentResults,
      isCurrent: true,
    },
    ...presetScenarios,
  ];

  const bestScenarioId = scenarios.reduce((best, scenario) =>
    scenario.results.roiPercent > best.results.roiPercent ? scenario : best,
  ).id;

  const changedFields = Object.entries(currentInputs)
    .filter(([key, value]) => value !== simulationPresets[1].values[key as keyof SimulationInputs])
    .length;

  return (
    <section className="section-shell pt-8">
      <div className="container mx-auto px-6">
        <SectionReveal className="mx-auto mb-10 max-w-3xl text-center">
          <div className="section-kicker mb-5">Scenario comparison</div>
          <h2 className="section-title">
            Compare the live case against <span className="text-gradient-accent">curated operating profiles</span>
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            This view helps you see whether the current mix of throughput, cost, and pricing assumptions is outperforming more structured reference scenarios.
          </p>
        </SectionReveal>

        <SectionReveal delayMs={120} className="glass-panel-strong mx-auto max-w-6xl p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow-label">Comparison summary</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">Current scenario versus baseline presets</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="chart-note">{changedFields} input changes from balanced preset</div>
              <div className="chart-note">Best ROI: {scenarios.find((item) => item.id === bestScenarioId)?.label}</div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {scenarios.map((scenario) => {
              const roiDelta = scenario.results.roiPercent - currentResults.roiPercent;
              const profitDelta = scenario.results.yearlyProfit - currentResults.yearlyProfit;

              return (
                <div
                  key={scenario.id}
                  className={`rounded-[26px] border p-5 transition-all duration-300 ${scenario.isCurrent ? "border-primary/35 bg-primary/10 shadow-[0_0_34px_hsl(164_70%_57%_/_0.14)]" : "border-white/10 bg-white/[0.04]"}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{scenario.label}</p>
                      <p className="mt-1 text-xs leading-6 text-muted-foreground">{scenario.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {scenario.isCurrent && <span className="chart-note">Live</span>}
                      {bestScenarioId === scenario.id && <span className="chart-note">Top ROI</span>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "ROI", value: `${scenario.results.roiPercent.toFixed(1)}%` },
                      { label: "Annual profit", value: formatCurrency(scenario.results.yearlyProfit) },
                      { label: "GO output", value: `${scenario.results.goProduced.toFixed(1)} kg/day` },
                      { label: "Payback", value: scenario.results.paybackYears === Infinity ? "N/A" : `${scenario.results.paybackYears.toFixed(1)} yrs` },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{metric.label}</p>
                        <p className="mt-2 text-base font-semibold text-foreground">{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  {!scenario.isCurrent && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">ROI vs current</p>
                        <p className={`mt-2 text-sm font-semibold ${roiDelta >= 0 ? "text-primary" : "text-destructive"}`}>
                          {roiDelta >= 0 ? "+" : ""}{roiDelta.toFixed(1)} pts
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Profit vs current</p>
                        <p className={`mt-2 text-sm font-semibold ${profitDelta >= 0 ? "text-primary" : "text-destructive"}`}>
                          {profitDelta >= 0 ? "+" : ""}{formatCurrency(profitDelta)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default ScenarioComparison;
