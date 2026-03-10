import type { SimulationInputs } from "@/components/InputModule";
import type { SimulationResults } from "@/lib/simulation";

interface ExportReportOptions {
  inputs: SimulationInputs;
  results: SimulationResults;
  scenarioName?: string;
}

const formatCurrency = (value: number) => {
  if (!Number.isFinite(value)) return "N/A";
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

const formatNumber = (value: number, digits = 2) => {
  if (!Number.isFinite(value)) return "N/A";
  return value.toFixed(digits);
};

const drawSection = (
  doc: {
    setFontSize: (size: number) => void;
    setTextColor: (r: number, g: number, b: number) => void;
    text: (text: string | string[], x: number, y: number, options?: { maxWidth?: number }) => void;
    line: (x1: number, y1: number, x2: number, y2: number) => void;
  },
  title: string,
  rows: Array<[string, string]>,
  startY: number,
) => {
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(title, 18, startY);
  doc.line(18, startY + 2, 192, startY + 2);

  let y = startY + 10;
  rows.forEach(([label, value]) => {
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 20, y);
    doc.setTextColor(15, 23, 42);
    doc.text(value, 120, y, { maxWidth: 70 });
    y += 8;
  });

  return y + 4;
};

export const exportSimulationReport = async ({ inputs, results, scenarioName }: ExportReportOptions) => {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const reportDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  doc.setFillColor(9, 17, 31);
  doc.rect(0, 0, 210, 297, "F");
  doc.setFillColor(19, 34, 56);
  doc.roundedRect(12, 12, 186, 273, 6, 6, "F");

  doc.setFontSize(26);
  doc.setTextColor(236, 253, 245);
  doc.text("BioGraphX", 18, 28);

  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184);
  doc.text("Bagasse-to-graphene feasibility report", 18, 36);
  doc.text(`Generated ${reportDate}`, 18, 43);
  doc.text(`Scenario ${scenarioName ?? "Current live model"}`, 18, 50);

  doc.setFillColor(15, 118, 110);
  doc.roundedRect(140, 20, 48, 18, 5, 5, "F");
  doc.setFontSize(10);
  doc.setTextColor(240, 253, 250);
  doc.text(`ROI ${formatNumber(results.roiPercent, 1)}%`, 148, 31);

  let y = 66;
  y = drawSection(
    doc,
    "Scenario inputs",
    [
      ["Bagasse input", `${formatNumber(inputs.bagasseTons, 1)} tons/day`],
      ["Moisture content", `${formatNumber(inputs.moisturePercent, 1)}%`],
      ["Electricity cost", `${formatCurrency(inputs.electricityCost)}/kWh`],
      ["Labor cost", `${formatCurrency(inputs.laborCost)}/day`],
      ["Plant CAPEX", `${formatCurrency(inputs.plantCapex * 1_000_000)}`],
      ["GO market price", `${formatCurrency(inputs.grapheneMarketPrice)}/kg`],
    ],
    y,
  );

  y = drawSection(
    doc,
    "Production outputs",
    [
      ["Dry bagasse", `${formatNumber(results.dryBagasse, 2)} tons/day`],
      ["Biochar produced", `${formatNumber(results.biocharProduced, 2)} tons/day`],
      ["GO produced", `${formatNumber(results.goProduced, 1)} kg/day`],
      ["Monthly GO output", `${formatNumber(results.goProducedMonthly, 0)} kg/month`],
      ["Annual GO output", `${formatNumber(results.goProducedYearly, 0)} kg/year`],
      ["Carbon saved", `${formatNumber(results.carbonSaved, 0)} tCO2/year`],
    ],
    y,
  );

  y = drawSection(
    doc,
    "Financial overview",
    [
      ["Annual revenue", formatCurrency(results.yearlyRevenue)],
      ["Annual OPEX", formatCurrency(results.yearlyOpex)],
      ["Annual net profit", formatCurrency(results.yearlyProfit)],
      ["ROI", `${formatNumber(results.roiPercent, 1)}%`],
      ["Payback period", Number.isFinite(results.paybackYears) ? `${formatNumber(results.paybackYears, 1)} years` : "N/A"],
      ["Energy cost", `${formatCurrency(results.energyCostDaily)}/day`],
    ],
    y,
  );

  if (y > 230) {
    doc.addPage();
    doc.setFillColor(9, 17, 31);
    doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(19, 34, 56);
    doc.roundedRect(12, 12, 186, 273, 6, 6, "F");
    y = 28;
  }

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("Recommendation", 18, y);
  doc.line(18, y + 2, 192, y + 2);

  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(results.recommendation, 20, y + 10, { maxWidth: 170 });

  const suggestionLines = results.suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`);
  doc.setTextColor(71, 85, 105);
  doc.text(suggestionLines, 24, y + 28, { maxWidth: 164 });

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("BioGraphX report export · Generated from live client-side simulation assumptions.", 18, 278);

  const safeName = (scenarioName ?? "current-scenario")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  doc.save(`biographx-report-${safeName || "scenario"}.pdf`);
};
