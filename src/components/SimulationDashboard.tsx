import type { SimulationResults } from "@/lib/simulation";
import { Beaker, Flame, Droplets, Package } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import RiskSensitivityAnalysis from "@/components/RiskSensitivityAnalysis";

interface Props {
  results: SimulationResults;
}

const SimulationDashboard = ({ results }: Props) => {
  const productionCards = [
    { label: "Dry Bagasse", value: `${results.dryBagasse.toFixed(2)} t/day`, icon: Flame, sub: "After moisture removal" },
    { label: "Biochar Produced", value: `${results.biocharProduced.toFixed(2)} t/day`, icon: Droplets, sub: "30% pyrolysis yield" },
    { label: "Graphene Oxide", value: `${results.goProduced.toFixed(1)} kg/day`, icon: Beaker, sub: "15% oxidation yield" },
    { label: "Annual GO Output", value: `${(results.goProducedYearly / 1000).toFixed(1)} tons/yr`, icon: Package, sub: `${results.goProducedMonthly.toFixed(0)} kg/month` },
  ];

  return (
    <section className="section-shell">
      <div className="container mx-auto px-6">
        <SectionReveal className="mx-auto mb-12 max-w-3xl text-center">
          <div className="section-kicker mb-5">Production outcomes</div>
          <h2 className="section-title">
            See the <span className="text-gradient-primary">material flow</span> at a glance
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            The results focus on the operational story first: how much material moves through the process, what energy is required, and what carbon benefit is implied.
          </p>
        </SectionReveal>

        <SectionReveal delayMs={100} className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productionCards.map((card) => (
            <div key={card.label} className="metric-card neon-border group p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] transition-colors duration-300 group-hover:bg-white/[0.1]">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mb-2 text-2xl font-semibold text-foreground">{card.value}</div>
              <div className="mb-1 text-sm font-medium text-foreground">{card.label}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.sub}</div>
            </div>
          ))}
        </SectionReveal>

        <SectionReveal delayMs={180} className="glass-panel-strong neon-border mx-auto mt-8 max-w-6xl p-6 md:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Energy required</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{results.energyRequired.toLocaleString()} kWh/day</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Energy cost</div>
              <div className="mt-2 text-2xl font-semibold text-accent">${results.energyCostDaily.toFixed(0)}/day</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Carbon saved</div>
              <div className="mt-2 text-2xl font-semibold text-primary">{results.carbonSaved.toLocaleString()} tCO₂/yr</div>
            </div>
          </div>
        </SectionReveal>

        {/* NEW: Risk & Sensitivity Analysis Section */}
        <SectionReveal delayMs={260} className="mx-auto mt-12 max-w-6xl">
          <RiskSensitivityAnalysis results={results} />
        </SectionReveal>
      </div>
    </section>
  );
};

export default SimulationDashboard;
