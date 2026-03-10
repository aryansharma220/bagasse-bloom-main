import { useRef, useState } from "react";
import type { SimulationResults } from "@/lib/simulation";
import AnimatedNumber from "@/components/AnimatedNumber";
import ChartExportButton from "@/components/ChartExportButton";
import SectionReveal from "@/components/SectionReveal";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Props {
  results: SimulationResults;
}

const FinancialAnalysis = ({ results }: Props) => {
  const [activeBarKey, setActiveBarKey] = useState<"all" | "revenue" | "cost">("all");
  const [activeCostIndex, setActiveCostIndex] = useState(0);
  const revenueChartRef = useRef<HTMLDivElement>(null);
  const breakdownChartRef = useRef<HTMLDivElement>(null);

  const revenueVsCost = [
    { name: "Daily", revenue: Math.round(results.dailyRevenue), cost: Math.round(results.dailyOpex) },
    { name: "Monthly", revenue: Math.round(results.monthlyRevenue), cost: Math.round(results.monthlyOpex) },
    { name: "Yearly", revenue: Math.round(results.yearlyRevenue), cost: Math.round(results.yearlyOpex) },
  ];

  const costBreakdown = [
    { name: "Energy", value: Math.round(results.energyCostDaily * 365) },
    { name: "Labor", value: Math.round(results.dailyOpex * 365 - results.energyCostDaily * 365 - results.goProduced * 20 * 365) },
    { name: "Chemicals", value: Math.round(results.goProduced * 20 * 365) },
  ].filter((c) => c.value > 0);

  const COST_COLOR_CLASSES = ["bg-primary", "bg-accent", "bg-blue-400"];
  const COLORS = ["hsl(164 70% 57%)", "hsl(194 82% 71%)", "hsl(221 66% 64%)"];

  const formatCurrency = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
    return `$${v}`;
  };

  const summaryNotes = [
    `Revenue spread ${formatCurrency(results.yearlyRevenue - results.yearlyOpex)}`,
    `${results.roiPercent.toFixed(1)}% projected ROI`,
    results.paybackYears === Infinity ? "No payback under current assumptions" : `${results.paybackYears.toFixed(1)} year payback`,
  ];
  const activeCost = costBreakdown[activeCostIndex] ?? costBreakdown[0];
  const financialMetrics = [
    { label: "Annual Revenue", value: results.yearlyRevenue, accent: true, formatter: formatCurrency },
    { label: "Annual OPEX", value: results.yearlyOpex, formatter: formatCurrency },
    { label: "ROI", value: results.roiPercent, accent: true, formatter: (value: number) => `${value.toFixed(1)}%` },
    { label: "Payback Period", value: results.paybackYears, formatter: (value: number) => (value === Infinity ? "N/A" : `${value.toFixed(1)} yrs`) },
  ];

  return (
    <section className="section-shell">
      <div className="container mx-auto px-6">
        <SectionReveal className="mx-auto mb-12 max-w-3xl text-center">
          <div className="section-kicker mb-5">Financial picture</div>
          <h2 className="section-title">
            Understand the <span className="text-gradient-accent">economic shape</span> of the scenario
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            The financial section blends concise KPIs with clean visual comparisons so the economics feel easier to interpret and present.
          </p>
        </SectionReveal>

        <SectionReveal delayMs={80} className="mx-auto mb-12 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
          {financialMetrics.map((metric) => (
            <div key={metric.label} className="metric-card text-center">
              <div className={`mb-1 text-2xl font-semibold md:text-3xl ${metric.accent ? 'text-primary' : 'text-accent'}`}>
                <AnimatedNumber value={metric.value} formatter={metric.formatter} />
              </div>
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </SectionReveal>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          <SectionReveal delayMs={140} className="chart-panel neon-border">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="chart-title">Revenue vs cost</h3>
                <p className="chart-copy">Side-by-side comparison across daily, monthly, and yearly horizons.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="chart-note neon-text">Cashflow comparison</div>
                <ChartExportButton targetRef={revenueChartRef} fileName="financial-revenue-vs-cost.png" />
              </div>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              {[
                { key: "all", label: "All series" },
                { key: "revenue", label: "Revenue" },
                { key: "cost", label: "Cost" },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setActiveBarKey(option.key as typeof activeBarKey)}
                  className={`chart-legend-button ${activeBarKey === option.key ? "chart-legend-active" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div ref={revenueChartRef} className="rounded-[24px] border border-white/10 bg-black/20 p-4 md:p-5">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueVsCost}>
                  <defs>
                    <linearGradient id="revenueBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(164 70% 62%)" />
                      <stop offset="100%" stopColor="hsl(164 70% 46%)" />
                    </linearGradient>
                    <linearGradient id="costBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(194 82% 78%)" />
                      <stop offset="100%" stopColor="hsl(194 72% 62%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="hsl(0 0% 100% / 0.06)" strokeDasharray="4 10" />
                  <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220 22% 10% / 0.92)", border: "1px solid hsl(0 0% 100% / 0.08)", borderRadius: "16px", color: "hsl(210 20% 96%)", backdropFilter: "blur(14px)" }}
                    labelStyle={{ color: "hsl(210 20% 96%)", fontWeight: 600 }}
                    formatter={(value: number, name: string) => [formatCurrency(value), name === "revenue" ? "Revenue" : "Cost"]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="url(#revenueBarGrad)"
                    radius={[8, 8, 0, 0]}
                    name="Revenue"
                    fillOpacity={activeBarKey === "all" || activeBarKey === "revenue" ? 1 : 0.22}
                  />
                  <Bar
                    dataKey="cost"
                    fill="url(#costBarGrad)"
                    radius={[8, 8, 0, 0]}
                    name="Cost"
                    fillOpacity={activeBarKey === "all" || activeBarKey === "cost" ? 1 : 0.22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {summaryNotes.map((note) => (
                <div key={note} className="chart-note">
                  {note}
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delayMs={220} className="chart-panel neon-border">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="chart-title">Annual cost breakdown</h3>
                <p className="chart-copy">Energy, labor, and chemical burdens under the current assumptions.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="chart-note neon-text">Operating structure</div>
                <ChartExportButton targetRef={breakdownChartRef} fileName="financial-cost-breakdown.png" />
              </div>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              {costBreakdown.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onMouseEnter={() => setActiveCostIndex(index)}
                  onFocus={() => setActiveCostIndex(index)}
                  onClick={() => setActiveCostIndex(index)}
                  className={`chart-legend-button ${activeCostIndex === index ? "chart-legend-active" : ""}`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${COST_COLOR_CLASSES[index % COST_COLOR_CLASSES.length]}`} />
                  {item.name}
                </button>
              ))}
            </div>
            <div ref={breakdownChartRef} className="rounded-[24px] border border-white/10 bg-black/20 p-4 md:p-5">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={58}
                    paddingAngle={3}
                    dataKey="value"
                    activeIndex={activeCostIndex}
                    onMouseEnter={(_, index) => setActiveCostIndex(index)}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {costBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={activeCostIndex === i ? 1 : 0.32} stroke={activeCostIndex === i ? "hsl(210 20% 96%)" : "transparent"} strokeWidth={activeCostIndex === i ? 1.5 : 0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(220 22% 10% / 0.92)", border: "1px solid hsl(0 0% 100% / 0.08)", borderRadius: "16px", color: "hsl(210 20% 96%)", backdropFilter: "blur(14px)" }}
                    labelStyle={{ color: "hsl(210 20% 96%)", fontWeight: 600 }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {costBreakdown.map((item, index) => (
                <div key={item.name} className={`chart-stat-tile ${activeCostIndex === index ? "border-primary/25 bg-primary/10" : ""}`}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${COST_COLOR_CLASSES[index % COST_COLOR_CLASSES.length]}`} />
                    <span className="eyebrow-label">{item.name}</span>
                  </div>
                  <div className="text-base font-semibold text-foreground">{formatCurrency(item.value)}</div>
                </div>
              ))}
            </div>
            {activeCost && (
              <div className="mt-5 chart-stat-tile">
                <div className="eyebrow-label">Focused cost driver</div>
                <div className="mt-2 text-lg font-semibold text-foreground">{activeCost.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {formatCurrency(activeCost.value)} annually · {((activeCost.value / results.yearlyOpex) * 100).toFixed(1)}% of total operating cost
                </div>
              </div>
            )}
          </SectionReveal>
        </div>

        <SectionReveal
          delayMs={280}
          className={`glass-panel-strong mx-auto mt-8 max-w-6xl p-6 text-center ${results.yearlyProfit > 0 ? 'border-primary/20' : 'border-destructive/30'}`}
        >
          <div className="mb-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">Annual net profit</div>
          <div className={`text-3xl font-semibold md:text-4xl ${results.yearlyProfit > 0 ? 'text-primary' : 'text-destructive'}`}>
            <AnimatedNumber value={results.yearlyProfit} formatter={formatCurrency} />
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            This is the cleanest single number for quickly judging whether the scenario feels commercially compelling under the current assumptions.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

export default FinancialAnalysis;
