import type { SimulationInputs } from "@/components/InputModule";

export interface SimulationResults {
  // Production
  dryBagasse: number; // tons/day
  biocharProduced: number; // tons/day
  goProduced: number; // kg/day
  goProducedMonthly: number; // kg/month
  goProducedYearly: number; // kg/year

  // Energy
  energyRequired: number; // kWh/day
  energyCostDaily: number; // $/day

  // Costs
  dailyOpex: number;
  monthlyOpex: number;
  yearlyOpex: number;

  // Revenue
  dailyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;

  // Financial
  yearlyProfit: number;
  roiPercent: number;
  paybackYears: number;

  // Carbon
  carbonSaved: number; // tons CO2/year

  // AI Recommendation
  recommendation: string;
  recommendationLevel: "high" | "moderate" | "low";
  suggestions: string[];
}

export function runSimulation(inputs: SimulationInputs): SimulationResults {
  // Step 1: Drying (remove moisture)
  const dryBagasse = inputs.bagasseTons * (1 - inputs.moisturePercent / 100);

  // Step 2: Pyrolysis → 30% biochar yield
  const biocharProduced = dryBagasse * 0.30;

  // Step 3: Chemical Oxidation → 15% GO yield from biochar
  const goProducedTons = biocharProduced * 0.15;
  const goProduced = goProducedTons * 1000; // kg/day
  const goProducedMonthly = goProduced * 30;
  const goProducedYearly = goProduced * 365;

  // Energy: ~500 kWh per ton of bagasse processed
  const energyRequired = inputs.bagasseTons * 500;
  const energyCostDaily = energyRequired * inputs.electricityCost;

  // Chemical costs: ~$20/kg GO for chemicals
  const chemicalCostDaily = goProduced * 20;

  // Daily OPEX
  const dailyOpex = energyCostDaily + inputs.laborCost + chemicalCostDaily;
  const monthlyOpex = dailyOpex * 30;
  const yearlyOpex = dailyOpex * 365;

  // Revenue
  const dailyRevenue = goProduced * inputs.grapheneMarketPrice;
  const monthlyRevenue = dailyRevenue * 30;
  const yearlyRevenue = dailyRevenue * 365;

  // Profit & ROI
  const yearlyProfit = yearlyRevenue - yearlyOpex;
  const capexDollars = inputs.plantCapex * 1_000_000;
  const roiPercent = capexDollars > 0 ? ((yearlyProfit / capexDollars) * 100) : 0;
  const paybackYears = yearlyProfit > 0 ? capexDollars / yearlyProfit : Infinity;

  // Carbon savings: ~1.5 tons CO2 saved per ton of bagasse diverted from burning
  const carbonSaved = inputs.bagasseTons * 365 * 1.5;

  // AI Recommendation
  let recommendation: string;
  let recommendationLevel: "high" | "moderate" | "low";
  const suggestions: string[] = [];

  if (roiPercent > 50) {
    recommendationLevel = "high";
    recommendation = `High ROI of ${roiPercent.toFixed(0)}% — Proceed with investment. Strong profitability projected.`;
    suggestions.push(`Install ${inputs.bagasseTons} ton/day processing unit`);
    suggestions.push("Secure long-term bagasse supply contracts");
    suggestions.push("Apply for carbon credit certification");
  } else if (roiPercent > 15) {
    recommendationLevel = "moderate";
    recommendation = `Moderate ROI of ${roiPercent.toFixed(0)}% — Viable with optimizations. Consider scaling up for better margins.`;
    suggestions.push(`Consider scaling to ${Math.ceil(inputs.bagasseTons * 1.5)} tons/day for better economics`);
    suggestions.push("Negotiate lower electricity rates");
    suggestions.push("Explore government subsidies for green technology");
  } else {
    recommendationLevel = "low";
    recommendation = `Low ROI of ${roiPercent.toFixed(0)}% — Wait for market price increase or reduce CAPEX.`;
    suggestions.push("Wait for GO market price to increase above $200/kg");
    suggestions.push("Explore pilot-scale production first");
    suggestions.push("Partner with research institutions for cost reduction");
  }

  return {
    dryBagasse,
    biocharProduced,
    goProduced,
    goProducedMonthly,
    goProducedYearly,
    energyRequired,
    energyCostDaily,
    dailyOpex,
    monthlyOpex,
    yearlyOpex,
    dailyRevenue,
    monthlyRevenue,
    yearlyRevenue,
    yearlyProfit,
    roiPercent,
    paybackYears,
    carbonSaved,
    recommendation,
    recommendationLevel,
    suggestions,
  };
}
