import { useMemo, useState } from "react";
import { Factory, Droplets, Zap as ZapIcon, Users, Building2, TrendingUp, SlidersHorizontal, Sparkles, ArrowRight, Map } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { runSimulation, type SimulationResults } from "@/lib/simulation";
import { getRegionalData, indianRegionalData } from "@/lib/regional-data";

export interface SimulationInputs {
  bagasseTons: number;
  moisturePercent: number;
  electricityCost: number;
  laborCost: number;
  plantCapex: number;
  grapheneMarketPrice: number;
  selectedRegion?: string; // NEW
  carbonCreditValue?: number; // NEW
}

interface InputModuleProps {
  inputs: SimulationInputs;
  liveResults: SimulationResults;
  onInputsChange: (inputs: SimulationInputs) => void;
  onFocusResults: () => void;
}

const fields: Array<{ key: keyof SimulationInputs; label: string; unit: string; icon: typeof Factory; defaultVal: number; min: number; max: number; step?: number }> = [
  { key: "bagasseTons", label: "Bagasse Input", unit: "tons/day", icon: Factory, defaultVal: 10, min: 1, max: 1000 },
  { key: "moisturePercent", label: "Moisture Content", unit: "%", icon: Droplets, defaultVal: 45, min: 5, max: 80 },
  { key: "electricityCost", label: "Electricity Cost", unit: "$/kWh", icon: ZapIcon, defaultVal: 0.08, min: 0.01, max: 1, step: 0.01 },
  { key: "laborCost", label: "Labor Cost", unit: "$/day", icon: Users, defaultVal: 500, min: 50, max: 10000 },
  { key: "plantCapex", label: "Plant CAPEX", unit: "$ (million)", icon: Building2, defaultVal: 2, min: 0.1, max: 100, step: 0.1 },
  { key: "grapheneMarketPrice", label: "GO Market Price", unit: "$/kg", icon: TrendingUp, defaultVal: 150, min: 50, max: 500 },
];

export const defaultSimulationInputs: SimulationInputs = {
  bagasseTons: 10,
  moisturePercent: 45,
  electricityCost: 0.08,
  laborCost: 500,
  plantCapex: 2,
  grapheneMarketPrice: 150,
  selectedRegion: "tamil-nadu", // NEW: Default to TN (lowest cost)
  carbonCreditValue: 2.4, // NEW: Default carbon credit value
};

export const simulationPresets: Array<{ id: string; label: string; description: string; values: SimulationInputs }> = [
  {
    id: "pilot",
    label: "Pilot",
    description: "Lower-capacity validation setup with cautious operating economics.",
    values: {
      bagasseTons: 6,
      moisturePercent: 50,
      electricityCost: 0.1,
      laborCost: 350,
      plantCapex: 1.2,
      grapheneMarketPrice: 165,
    },
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "A moderate commercial scenario with realistic utility and pricing assumptions.",
    values: {
      bagasseTons: 12,
      moisturePercent: 42,
      electricityCost: 0.08,
      laborCost: 540,
      plantCapex: 2.4,
      grapheneMarketPrice: 155,
    },
  },
  {
    id: "scale-up",
    label: "Scale-up",
    description: "Higher-throughput model intended to test stronger economies of scale.",
    values: {
      bagasseTons: 22,
      moisturePercent: 38,
      electricityCost: 0.07,
      laborCost: 750,
      plantCapex: 4.8,
      grapheneMarketPrice: 145,
    },
  },
];

const fieldMap = Object.fromEntries(fields.map((field) => [field.key, field])) as Record<keyof SimulationInputs, (typeof fields)[number]>;

const quickTuneFields: Array<{ key: keyof SimulationInputs; label: string; unit: string }> = [
  { key: "bagasseTons", label: "Throughput", unit: "tons/day" },
  { key: "electricityCost", label: "Energy cost", unit: "$/kWh" },
  { key: "grapheneMarketPrice", label: "GO price", unit: "$/kg" },
];

const clampInputValue = (key: keyof SimulationInputs, value: number) => {
  const config = fieldMap[key];
  return Math.min(config.max, Math.max(config.min, value));
};

const formatCompactCurrency = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const InputModule = ({ inputs, liveResults, onInputsChange, onFocusResults }: InputModuleProps) => {
  const [showRegionDetails, setShowRegionDetails] = useState(false);

  // Get current region data
  const currentRegion = inputs.selectedRegion ? getRegionalData(inputs.selectedRegion) : getRegionalData("tamil-nadu");

  const handleRegionChange = (regionKey: string) => {
    const regionData = getRegionalData(regionKey);
    if (regionData) {
      onInputsChange({
        ...inputs,
        selectedRegion: regionKey,
        electricityCost: regionData.electricityCost,
        laborCost: regionData.laborCost,
        carbonCreditValue: regionData.carbonCreditValue,
      });
    }
  };

  const sensitivityCards = useMemo(() => {
    const scenarios = [
      {
        label: "Increase throughput",
        detail: "+10% bagasse feed",
        key: "bagasseTons" as const,
        nextValue: clampInputValue("bagasseTons", inputs.bagasseTons * 1.1),
      },
      {
        label: "Lift market pricing",
        detail: "+10% GO price",
        key: "grapheneMarketPrice" as const,
        nextValue: clampInputValue("grapheneMarketPrice", inputs.grapheneMarketPrice * 1.1),
      },
      {
        label: "Reduce energy burden",
        detail: "-10% electricity cost",
        key: "electricityCost" as const,
        nextValue: clampInputValue("electricityCost", inputs.electricityCost * 0.9),
      },
    ];

    return scenarios.map((scenario) => {
      const adjustedInputs = { ...inputs, [scenario.key]: scenario.nextValue };
      const adjustedResults = runSimulation(adjustedInputs);

      return {
        ...scenario,
        roiDelta: adjustedResults.roiPercent - liveResults.roiPercent,
        profitDelta: adjustedResults.yearlyProfit - liveResults.yearlyProfit,
      };
    });
  }, [inputs, liveResults]);

  const handleChange = (key: keyof SimulationInputs, value: number) => {
    onInputsChange({ ...inputs, [key]: clampInputValue(key, value) });
  };

  const activePreset = simulationPresets.find((preset) =>
    Object.entries(preset.values).every(([key, value]) => inputs[key as keyof SimulationInputs] === value),
  )?.id;

  return (
    <section id="simulator" className="section-shell">
      <div className="container mx-auto px-6">
        <SectionReveal className="mx-auto mb-12 max-w-3xl text-center">
          <div className="section-kicker mb-5">Interactive model</div>
          <h2 className="section-title">
            Shape the scenario with <span className="text-gradient-primary">smarter live controls</span>
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Presets, quick-tune sliders, and live recalculation make the simulator feel more exploratory while still staying readable.
          </p>
        </SectionReveal>

        <SectionReveal delayMs={120} className="glass-panel-strong mx-auto max-w-5xl p-5 md:p-8">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Scenario presets
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {simulationPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onInputsChange(preset.values)}
                    className={`rounded-[22px] border p-4 text-left transition-all duration-300 ${activePreset === preset.id ? "border-primary/45 bg-primary/10 shadow-[0_0_30px_hsl(164_70%_57%_/_0.15)]" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.06]"}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{preset.label}</span>
                      {activePreset === preset.id && <span className="chart-note">Active</span>}
                    </div>
                    <p className="text-xs leading-6 text-muted-foreground">{preset.description}</p>
                  </button>
                ))}
              </div>

              {/* NEW: Region Selector */}
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Map className="h-4 w-4 text-accent" />
                  Production region (India)
                </div>
                <Select value={inputs.selectedRegion || "tamil-nadu"} onValueChange={handleRegionChange}>
                  <SelectTrigger className="w-full border-white/10 bg-black/20">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black/40 text-foreground">
                    {Object.entries(indianRegionalData).map(([key, data]) => (
                      <SelectItem key={key} value={key} className="cursor-pointer">
                        {data.state} — ₹{(data.electricityCost * 75).toFixed(0)}/kWh
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentRegion && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs text-muted-foreground">
                    <p><strong>Sugar mills:</strong> {currentRegion.sugarmillDensity}</p>
                    <p><strong>Key incentives:</strong> {currentRegion.majorIncentives.slice(0, 2).join(", ")}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <SlidersHorizontal className="h-4 w-4 text-accent" />
                Live scenario snapshot
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Daily GO output", value: `${liveResults.goProduced.toFixed(1)} kg` },
                  { label: "Annual revenue", value: formatCompactCurrency(liveResults.yearlyRevenue + liveResults.yearlyFarbonCreditRevenue) },
                  { label: "ROI", value: `${liveResults.roiPercent.toFixed(1)}%` },
                  { label: "Carbon credit/yr", value: formatCompactCurrency(liveResults.yearlyFarbonCreditRevenue) },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:bg-white/[0.06]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06] subtle-ring">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <label htmlFor={String(f.key)} className="text-sm font-semibold text-foreground">
                      {f.label}
                    </label>
                    <span className="ml-2 text-xs text-muted-foreground">{f.unit}</span>
                  </div>
                </div>
                <input
                  id={String(f.key)}
                  type="number"
                  value={inputs[f.key]}
                  min={f.min}
                  max={f.max}
                  step={f.step || 1}
                  onChange={(e) => handleChange(f.key, parseFloat(e.target.value) || 0)}
                  placeholder={`Enter ${f.label.toLowerCase()}`}
                  title={f.label}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 font-mono text-lg text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary/40 focus:bg-black/30 focus:ring-4 focus:ring-primary/10"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  Range: {f.min} to {f.max}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Quick-tune sensitivity sliders
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {quickTuneFields.map((field) => {
                const config = fieldMap[field.key];

                return (
                  <div key={field.key} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{field.label}</p>
                        <p className="text-xs text-muted-foreground">{field.unit}</p>
                      </div>
                      <p className="text-sm font-semibold text-primary">{inputs[field.key]}</p>
                    </div>
                    <input
                      type="range"
                      min={config.min}
                      max={config.max}
                      step={config.step || 1}
                      value={inputs[field.key]}
                      onChange={(e) => handleChange(field.key, parseFloat(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
                      title={field.label}
                    />
                    <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      <span>{config.min}</span>
                      <span>{config.max}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {sensitivityCards.map((card) => (
              <div key={card.label} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Sensitivity signal</div>
                <h3 className="text-base font-semibold text-foreground">{card.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">ROI change</p>
                    <p className={`mt-2 text-lg font-semibold ${card.roiDelta >= 0 ? "text-primary" : "text-destructive"}`}>
                      {card.roiDelta >= 0 ? "+" : ""}{card.roiDelta.toFixed(1)} pts
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Profit change</p>
                    <p className={`mt-2 text-lg font-semibold ${card.profitDelta >= 0 ? "text-primary" : "text-destructive"}`}>
                      {card.profitDelta >= 0 ? "+" : ""}{formatCompactCurrency(card.profitDelta)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-5 md:flex-row md:px-6">
            <div>
              <p className="text-sm font-medium text-foreground">Live results update as you tune the model</p>
              <p className="mt-1 text-sm text-muted-foreground">Use the controls above, then jump straight to the results stack whenever you want to review the latest scenario.</p>
            </div>
            <button onClick={onFocusResults} className="button-primary min-w-[210px]">
              View live results
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default InputModule;
