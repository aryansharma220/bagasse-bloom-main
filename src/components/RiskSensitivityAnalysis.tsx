import { AlertTriangle, TrendingDown, TrendingUp, Target, AlertCircle } from "lucide-react";
import type { SimulationResults } from "@/lib/simulation";

interface RiskSensitivityAnalysisProps {
  results: SimulationResults;
}

export const RiskSensitivityAnalysis = ({ results }: RiskSensitivityAnalysisProps) => {
  const goPrice_downImpact = results.sensitivityFactors.goPrice.down20 - results.roiPercent;
  const goPrice_upImpact = results.sensitivityFactors.goPrice.up20 - results.roiPercent;
  const elecCost_downImpact = results.sensitivityFactors.electricityCost.down10 - results.roiPercent;
  const elecCost_upImpact = results.sensitivityFactors.electricityCost.up10 - results.roiPercent;
  const capacity_halfImpact = results.sensitivityFactors.capacity.half - results.roiPercent;
  const capacity_doubleImpact = results.sensitivityFactors.capacity.double - results.roiPercent;

  const isHighRisk = results.roiPercent < 15;
  const isModerateRisk = results.roiPercent >= 15 && results.roiPercent < 50;

  return (
    <div className="space-y-6">
      {/* Break-Even Analysis */}
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          <h3 className="text-base font-semibold text-foreground">Break-Even Analysis</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Min GO Price</p>
            <p className="mt-3 text-2xl font-bold text-primary">${results.breakEvenGoPrice.toFixed(0)}/kg</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Plant breaks even at this price<br/>
              (Current: ${results.priceNarginPercentage > 0 ? "Above" : "Below"} breakeven)
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Carbon Credits Impact</p>
            <p className="mt-3 text-2xl font-bold text-green-400">${results.yearlyFarbonCreditRevenue.toFixed(0)}/yr</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Adds {((results.yearlyFarbonCreditRevenue / (results.yearlyRevenue + results.yearlyFarbonCreditRevenue)) * 100).toFixed(1)}% to total revenue
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Profit Margin</p>
            <p className="mt-3 text-2xl font-bold text-primary">{results.priceNarginPercentage.toFixed(1)}%</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {results.priceNarginPercentage > 20 ? "✓ Healthy" : "⚠ Tight margins"}
            </p>
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="text-base font-semibold text-foreground">Sensitivity to Key Variables</h3>
        </div>

        <div className="space-y-4">
          {/* GO Price Sensitivity */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground">GO Market Price</p>
              <p className="text-xs text-muted-foreground">Most sensitive factor</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">-20% price</p>
                <p className={`mt-1 text-lg font-semibold ${goPrice_downImpact < 0 ? "text-destructive" : "text-primary"}`}>
                  ROI: {results.sensitivityFactors.goPrice.down20.toFixed(1)}%
                </p>
                <p className={`text-xs ${goPrice_downImpact < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {goPrice_downImpact >= 0 ? "+" : ""}{goPrice_downImpact.toFixed(1)} pts
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">+20% price</p>
                <p className="mt-1 text-lg font-semibold text-green-400">
                  ROI: {results.sensitivityFactors.goPrice.up20.toFixed(1)}%
                </p>
                <p className="text-xs text-green-300">
                  +{goPrice_upImpact.toFixed(1)} pts
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-white/5 p-2 text-xs text-muted-foreground">
              💡 Price swing of ±20% = ROI range of {Math.abs(goPrice_upImpact - goPrice_downImpact).toFixed(0)}%
            </div>
          </div>

          {/* Electricity Cost Sensitivity */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground">Electricity Cost</p>
              <p className="text-xs text-muted-foreground">Negotiable lever</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">-10% cost</p>
                <p className="mt-1 text-lg font-semibold text-primary">
                  ROI: {results.sensitivityFactors.electricityCost.down10.toFixed(1)}%
                </p>
                <p className="text-xs text-primary">
                  +{elecCost_downImpact.toFixed(1)} pts
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">+10% cost</p>
                <p className={`mt-1 text-lg font-semibold ${elecCost_upImpact < 0 ? "text-destructive" : "text-primary"}`}>
                  ROI: {results.sensitivityFactors.electricityCost.up10.toFixed(1)}%
                </p>
                <p className={`text-xs ${elecCost_upImpact < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {elecCost_upImpact >= 0 ? "+" : ""}{elecCost_upImpact.toFixed(1)} pts
                </p>
              </div>
            </div>
          </div>

          {/* Capacity Sensitivity */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground">Plant Capacity</p>
              <p className="text-xs text-muted-foreground">Scale impact</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">50% capacity</p>
                <p className={`mt-1 text-lg font-semibold ${capacity_halfImpact < 0 ? "text-destructive" : "text-primary"}`}>
                  ROI: {results.sensitivityFactors.capacity.half.toFixed(1)}%
                </p>
                <p className={`text-xs ${capacity_halfImpact < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {capacity_halfImpact >= 0 ? "+" : ""}{capacity_halfImpact.toFixed(1)} pts
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">2x capacity</p>
                <p className="mt-1 text-lg font-semibold text-green-400">
                  ROI: {results.sensitivityFactors.capacity.double.toFixed(1)}%
                </p>
                <p className="text-xs text-green-300">
                  +{capacity_doubleImpact.toFixed(1)} pts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Flag */}
      {isHighRisk && (
        <div className="rounded-[24px] border-2 border-destructive/50 bg-destructive/10 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-destructive" />
            <div>
              <h4 className="font-semibold text-destructive">High Risk Project</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Project has low margins and high sensitivity to market price. Consider: (1) Reduce CAPEX, (2) Start pilot-scale, (3) Secure long-term customer contracts, (4) Pursue government subsidies
              </p>
            </div>
          </div>
        </div>
      )}

      {isModerateRisk && (
        <div className="rounded-[24px] border-2 border-accent/50 bg-accent/10 p-5">
          <div className="flex gap-3">
            <AlertCircle className="h-6 w-6 flex-shrink-0 text-accent" />
            <div>
              <h4 className="font-semibold text-accent">Moderate Risk - Action Items</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Viable but requires execution excellence. Critical: Lock in GO pricing contracts, negotiate regional electricity rates, and claim all available government incentives.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskSensitivityAnalysis;
