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

  // Carbon Credits (NEW)
  carbonSaved: number; // tons CO2/year
  carbonCreditValue: number; // $/ton CO2
  yearlyFarbonCreditRevenue: number; // $ per year

  // Financial
  yearlyProfit: number; // Now includes carbon credits
  roiPercent: number;
  paybackYears: number;

  // Risk & Sensitivity (NEW)
  breakEvenGoPrice: number; // $/kg
  breakEvenCapacity: number; // tons/day
  capacityUtilizationForBreakeven: number; // % at 10 tons/day
  priceNarginPercentage: number; // % of revenue that is profit margin

  // Sensitivity Analysis (NEW)
  sensitivityFactors: {
    goPrice: { down20: number; up20: number }; // ROI impact
    electricityCost: { down10: number; up10: number };
    capacity: { half: number; double: number };
  };

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

  // Revenue from GO
  const dailyRevenue = goProduced * inputs.grapheneMarketPrice;
  const monthlyRevenue = dailyRevenue * 30;
  const yearlyRevenue = dailyRevenue * 365;

  // Carbon Credits (NEW PHASE 2)
  const carbonSaved = inputs.bagasseTons * 365 * 1.5; // tons CO2/year
  const carbonCreditValue = inputs.carbonCreditValue || 2.4; // $/ton CO2 (default from regional)
  const yearlyFarbonCreditRevenue = carbonSaved * carbonCreditValue;

  // Total Revenue (GO + Carbon Credits)
  const totalYearlyRevenue = yearlyRevenue + yearlyFarbonCreditRevenue;

  // Profit & ROI (including carbon credits)
  const yearlyProfit = totalYearlyRevenue - yearlyOpex;
  const capexDollars = inputs.plantCapex * 1_000_000;
  const roiPercent = capexDollars > 0 ? ((yearlyProfit / capexDollars) * 100) : 0;
  const paybackYears = yearlyProfit > 0 ? capexDollars / yearlyProfit : Infinity;

  // BREAK-EVEN ANALYSIS (NEW PHASE 2)
  // At what price does the plant break even?
  const breakEvenGoPrice = yearlyOpex > 0 ? (yearlyOpex - yearlyFarbonCreditRevenue) / goProducedYearly : 0;

  // At what capacity does the plant break even? (fixed costs amortized, variable costs increase)
  // Assume fixed: $100/day, variable: $0.3/kg GO
  const fixedCostDaily = 100;
  const variableCostPerKg = 0.3;
  const capacityUtilizationForBreakeven = inputs.bagasseTons > 0 ? 
    ((dailyOpex) / (inputs.grapheneMarketPrice + (carbonCreditValue / goProduced) - variableCostPerKg)) / inputs.bagasseTons * 100
    : 0;
  
  const breakEvenCapacity = (yearlyOpex - yearlyFarbonCreditRevenue) / (inputs.grapheneMarketPrice * 365 - variableCostPerKg * 365 * 1000);
  const priceNarginPercentage = totalYearlyRevenue > 0 ? ((yearlyProfit / totalYearlyRevenue) * 100) : 0;

  // SENSITIVITY ANALYSIS (NEW PHASE 2)
  // What if GO price changes by ±20%?
  const goPrice_down20 = ((goProducedYearly * inputs.grapheneMarketPrice * 0.8 + yearlyFarbonCreditRevenue) - yearlyOpex) / capexDollars * 100;
  const goPrice_up20 = ((goProducedYearly * inputs.grapheneMarketPrice * 1.2 + yearlyFarbonCreditRevenue) - yearlyOpex) / capexDollars * 100;

  // What if electricity cost changes by ±10%?
  const elecCost_down10 = ((totalYearlyRevenue) - (yearlyOpex - energyCostDaily * 365 * 0.1)) / capexDollars * 100;
  const elecCost_up10 = ((totalYearlyRevenue) - (yearlyOpex + energyCostDaily * 365 * 0.1)) / capexDollars * 100;

  // What if capacity is halved or doubled?
  const capacity_half = ((goProducedYearly * 0.5 * inputs.grapheneMarketPrice + carbonSaved * 0.5 * carbonCreditValue) - (yearlyOpex * 0.6)) / capexDollars * 100; // Opex scales at 60%
  const capacity_double = ((goProducedYearly * 2 * inputs.grapheneMarketPrice + carbonSaved * 2 * carbonCreditValue) - (yearlyOpex * 1.8)) / capexDollars * 100;

  const sensitivityFactors = {
    goPrice: { down20: goPrice_down20, up20: goPrice_up20 },
    electricityCost: { down10: elecCost_down10, up10: elecCost_up10 },
    capacity: { half: capacity_half, double: capacity_double },
  };

  // AI Recommendation (Updated with sensitivity context)
  let recommendation: string;
  let recommendationLevel: "high" | "moderate" | "low";
  const suggestions: string[] = [];

  if (roiPercent > 50) {
    recommendationLevel = "high";
    recommendation = `High ROI of ${roiPercent.toFixed(0)}% — Proceed with investment. Strong resilience to price fluctuations.`;
    suggestions.push(`Install ${inputs.bagasseTons} ton/day processing unit`);
    suggestions.push("Secure long-term bagasse supply contracts");
    suggestions.push("Apply for carbon credit certification (adds ${yearlyFarbonCreditRevenue.toFixed(0)}/year)");
    suggestions.push(`Plant survives even if GO price drops to $${breakEvenGoPrice.toFixed(0)}/kg`);
  } else if (roiPercent > 15) {
    recommendationLevel = "moderate";
    recommendation = `Moderate ROI of ${roiPercent.toFixed(0)}% — Viable with optimizations. Action required on cost/revenue.`;
    suggestions.push(`Critical: GO price must stay above $${breakEvenGoPrice.toFixed(0)}/kg`);
    suggestions.push("Negotiate lower electricity rates (sensitivity: ±10% = ${(Math.abs(elecCost_down10 - elecCost_up10).toFixed(0))}/ROI swing)");
    suggestions.push("Explore government subsidies & carbon credit certification");
    suggestions.push(`Consider scaling to ${Math.ceil(inputs.bagasseTons * 1.5)} tons/day for better margins`);
  } else {
    recommendationLevel = "low";
    recommendation = `Low ROI of ${roiPercent.toFixed(0)}% — High risk. Major changes needed.`;
    suggestions.push("Project is NOT robust — small price drops kill profitability");
    suggestions.push("Wait for GO market price to increase or start with pilot scale");
    suggestions.push("Partner with research institutions to reduce CAPEX");
    suggestions.push("Strongly pursue carbon credit mechanisms");
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
    carbonSaved,
    carbonCreditValue,
    yearlyFarbonCreditRevenue,
    yearlyProfit,
    roiPercent,
    paybackYears,
    breakEvenGoPrice,
    breakEvenCapacity,
    capacityUtilizationForBreakeven,
    priceNarginPercentage,
    sensitivityFactors,
    recommendation,
    recommendationLevel,
    suggestions,
  };
}
