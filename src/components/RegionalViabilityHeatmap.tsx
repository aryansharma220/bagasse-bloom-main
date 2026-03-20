import { indianRegionalData } from "@/lib/regional-data";
import { Badge } from "@/components/ui/badge";
import { Map } from "lucide-react";
import type { SimulationInputs } from "@/components/InputModule";
import { runSimulation } from "@/lib/simulation";
import type { SimulationResults } from "@/lib/simulation";

const INR_PER_USD = 83;

interface RegionalViabilityProps {
  inputs: SimulationInputs;
  baselineResults: SimulationResults;
}

export const RegionalViabilityHeatmap = ({ inputs, baselineResults }: RegionalViabilityProps) => {
  // Calculate viability for each region
  const regionalScores = Object.entries(indianRegionalData).map(([key, regionData]) => {
    // Run simulation with this region's costs
    const regionalInputs = {
      ...inputs,
      selectedRegion: key,
      electricityCost: regionData.electricityCost,
      laborCost: regionData.laborCost,
      carbonCreditValue: regionData.carbonCreditValue,
    };

    const results = runSimulation(regionalInputs);

    // Score based on ROI, with bonus for local advantages
    let score = results.roiPercent;
    
    // Add bonuses
    if (results.roiPercent > 0) {
      score += (regionData.carbonCreditValue - 2.0) * 50; // Carbon credit value bonus
      score += regionData.bagasseAvailability > 2_000_000 ? 10 : 5; // Feedstock availability
    }

    const statusValue: "excellent" | "strong" | "viable" | "challenging" =
      results.roiPercent > 50
        ? "excellent"
        : results.roiPercent > 30
          ? "strong"
          : results.roiPercent > 15
            ? "viable"
            : "challenging";

    return {
      key,
      state: regionData.state,
      electricityCost: regionData.electricityCost,
      laborCost: regionData.laborCost,
      bagasseAvailability: regionData.bagasseAvailability,
      roiPercent: results.roiPercent,
      yearlyProfit: results.yearlyProfit,
      paybackYears: results.paybackYears,
      score,
      status: statusValue,
      topIncentive: regionData.majorIncentives[0],
    };
  });

  // Sort by score
  const sorted = [...regionalScores].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...regionalScores.map(r => r.score));

  // Helper to get heat color
  const getStatusColor = (
    status: "excellent" | "strong" | "viable" | "challenging"
  ): string => {
    switch (status) {
      case "excellent":
        return "from-green-400/20 to-green-500/10";
      case "strong":
        return "from-blue-400/20 to-blue-500/10";
      case "viable":
        return "from-amber-400/20 to-amber-500/10";
      case "challenging":
        return "from-red-400/20 to-red-500/10";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-500/30 text-green-200">Excellent</Badge>;
      case "strong":
        return <Badge className="bg-blue-500/30 text-blue-200">Strong</Badge>;
      case "viable":
        return <Badge className="bg-amber-500/30 text-amber-200">Viable</Badge>;
      case "challenging":
        return <Badge className="bg-red-500/30 text-red-200">Challenging</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 sm:p-6 w-full">
        <div className="mb-6 flex items-center gap-2">
          <Map className="h-5 w-5 text-accent" />
          <h3 className="text-base font-semibold text-foreground">Regional Viability Comparison</h3>
        </div>

        <div className="space-y-3">
          {sorted.map((region, index) => {
            const normalizedScore = (region.score / maxScore) * 100;

            return (
              <div
                key={region.key}
                className={`overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r ${getStatusColor(region.status as "excellent" | "strong" | "viable" | "challenging")} p-4 transition-all duration-300 hover:border-white/20`}
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                      <h4 className="font-semibold text-foreground">{region.state}</h4>
                      {getStatusBadge(region.status)}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{region.topIncentive}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{region.roiPercent.toFixed(1)}%</p>
                    <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">ROI</p>
                  </div>
                </div>

                {/* Heat bar */}
                <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-black/30">
                  {/* stylelint-disable-next-line declaration-no-important */}
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${normalizedScore}%` }}
                  />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 text-xs">
                  <div className="rounded-lg bg-black/20 px-2 py-2">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Electricity</p>
                    <p className="mt-1 font-semibold text-foreground truncate">₹{(region.electricityCost * INR_PER_USD).toFixed(2)}/kWh</p>
                  </div>
                  <div className="rounded-lg bg-black/20 px-2 py-2">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Annual Profit</p>
                    <p className="mt-1 font-semibold text-primary truncate">₹{((region.yearlyProfit * INR_PER_USD) / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-lg bg-black/20 px-2 py-2">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Payback</p>
                    <p className="mt-1 font-semibold text-foreground">
                      {region.paybackYears === Infinity ? "N/A" : `${region.paybackYears.toFixed(1)}y`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5 w-full">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Viability Status</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
            {[
              ["Excellent", "ROI > 50%", "bg-green-500/30"],
              ["Strong", "ROI 30-50%", "bg-blue-500/30"],
              ["Viable", "ROI 15-30%", "bg-amber-500/30"],
              ["Challenging", "ROI < 15%", "bg-red-500/30"],
            ].map(([status, desc, color]) => (
              <div key={status} className={`rounded-lg ${color} px-3 py-2 sm:px-4 sm:py-3`}>
                <p className="text-xs font-semibold text-foreground">{status}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="rounded-[24px] border-2 border-primary/50 bg-primary/10 p-5 sm:p-6 w-full">
        <h4 className="mb-2 font-semibold text-primary text-base">💡 Best Regions for Your Scenario</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-primary">{sorted[0].state}</strong> is ranked #1 with <strong>{sorted[0].roiPercent.toFixed(1)}% ROI</strong>. 
          {sorted.find(r => r.electricityCost === Math.min(...sorted.map(s => s.electricityCost))) && (
            <>
              {" "}If prioritizing lower electricity costs, consider <strong className="text-primary">{sorted.find(r => r.electricityCost === Math.min(...sorted.map(s => s.electricityCost)))?.state}</strong>.{" "}
            </>
          )}
          For highest feedstock availability, <strong className="text-primary">Uttar Pradesh</strong> offers 6.5M tons/year bagasse.
        </p>
      </div>
    </div>
  );
};

export default RegionalViabilityHeatmap;
