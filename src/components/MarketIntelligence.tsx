import { useRef, useState } from "react";
import AnimatedNumber from "@/components/AnimatedNumber";
import ChartExportButton from "@/components/ChartExportButton";
import SectionReveal from "@/components/SectionReveal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Battery, Droplets, Cpu, Shield } from "lucide-react";

const demandData = [
  { year: "2020", demand: 120 },
  { year: "2021", demand: 175 },
  { year: "2022", demand: 250 },
  { year: "2023", demand: 380 },
  { year: "2024", demand: 520 },
  { year: "2025", demand: 720 },
  { year: "2026", demand: 980 },
  { year: "2027", demand: 1350 },
  { year: "2028", demand: 1850 },
];

const priceData = [
  { year: "2020", price: 220 },
  { year: "2021", price: 200 },
  { year: "2022", price: 180 },
  { year: "2023", price: 160 },
  { year: "2024", price: 150 },
  { year: "2025", price: 140 },
  { year: "2026", price: 130 },
  { year: "2027", price: 120 },
  { year: "2028", price: 110 },
];

const useCases = [
  { icon: Battery, title: "Energy Storage", desc: "Lithium-ion battery anodes, supercapacitors, fuel cells", share: "35%" },
  { icon: Droplets, title: "Water Treatment", desc: "Heavy metal removal, desalination membranes, purification", share: "25%" },
  { icon: Cpu, title: "Electronics & Sensors", desc: "Flexible displays, biosensors, conductive inks", share: "22%" },
  { icon: Shield, title: "Composites & Coatings", desc: "Anti-corrosion, structural reinforcement, packaging", share: "18%" },
];

const MarketIntelligence = () => {
  const [activeApplication, setActiveApplication] = useState(0);
  const demandChartRef = useRef<HTMLDivElement>(null);
  const priceChartRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section-shell" id="market">
      <div className="container mx-auto px-6">
        <SectionReveal className="mx-auto mb-12 max-w-3xl text-center">
          <div className="section-kicker mb-5">Market context</div>
          <h2 className="section-title">
            Pair the model with <span className="text-gradient-accent">cleaner market signals</span>
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            The market layer adds visual context around demand growth, pricing movement, and likely application areas for graphene oxide.
          </p>
        </SectionReveal>

        <SectionReveal delayMs={60} className="mx-auto mb-8 grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "2028 demand", value: 1850, formatter: (value: number) => `${value.toFixed(0)} MT` },
            { label: "Demand CAGR", value: 38, formatter: (value: number) => `${value.toFixed(0)}%` },
            { label: "2028 price", value: 110, formatter: (value: number) => `$${value.toFixed(0)}/kg` },
            { label: "Largest use case", value: 35, formatter: (value: number) => `${value.toFixed(0)}% share` },
          ].map((metric) => (
            <div key={metric.label} className="metric-card text-center">
              <div className="mb-1 text-2xl font-semibold text-primary md:text-3xl">
                <AnimatedNumber value={metric.value} formatter={metric.formatter} />
              </div>
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </SectionReveal>

        <div className="mx-auto mb-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          <SectionReveal delayMs={100} className="chart-panel neon-border">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="chart-title">Global GO demand</h3>
                <p className="chart-copy">Metric tons with a strong projected long-term growth curve.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="chart-note neon-text">Demand outlook</div>
                <ChartExportButton targetRef={demandChartRef} fileName="market-demand-outlook.png" />
              </div>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              <div className="chart-legend-button chart-legend-active">Projected growth lane</div>
              <div className="chart-legend-button">Capacity planning reference</div>
            </div>
            <div ref={demandChartRef} className="rounded-[24px] border border-white/10 bg-black/20 p-4 md:p-5">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={demandData}>
                  <defs>
                    <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(164 70% 57%)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(164 70% 57%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="hsl(0 0% 100% / 0.06)" strokeDasharray="4 10" />
                  <XAxis dataKey="year" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(220 22% 10% / 0.92)", border: "1px solid hsl(0 0% 100% / 0.08)", borderRadius: "16px", color: "hsl(210 20% 96%)", backdropFilter: "blur(14px)" }} labelStyle={{ color: "hsl(210 20% 96%)", fontWeight: 600 }} />
                  <Area className="area-glow" type="monotone" dataKey="demand" stroke="hsl(164 70% 57% / 0.28)" fill="url(#demandGrad)" strokeWidth={8} name="Demand glow" />
                  <Area type="monotone" dataKey="demand" stroke="hsl(164 70% 57%)" fill="url(#demandGrad)" strokeWidth={2.5} name="Demand (MT)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="chart-note">2028 demand: 1850 MT</div>
              <div className="chart-note">Projected CAGR: 38%</div>
            </div>
          </SectionReveal>

          <SectionReveal delayMs={180} className="chart-panel neon-border">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="chart-title">GO price trend</h3>
                <p className="chart-copy">Indicative $/kg trajectory as production scales over time.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="chart-note neon-text">Pricing trend</div>
                <ChartExportButton targetRef={priceChartRef} fileName="market-price-trend.png" />
              </div>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              <div className="chart-legend-button chart-legend-active">Premium price curve</div>
              <div className="chart-legend-button">Scale-pressure reference</div>
            </div>
            <div ref={priceChartRef} className="rounded-[24px] border border-white/10 bg-black/20 p-4 md:p-5">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={priceData}>
                  <CartesianGrid vertical={false} stroke="hsl(0 0% 100% / 0.06)" strokeDasharray="4 10" />
                  <XAxis dataKey="year" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(220 22% 10% / 0.92)", border: "1px solid hsl(0 0% 100% / 0.08)", borderRadius: "16px", color: "hsl(210 20% 96%)", backdropFilter: "blur(14px)" }} labelStyle={{ color: "hsl(210 20% 96%)", fontWeight: 600 }} />
                  <Line className="line-glow" type="monotone" dataKey="price" stroke="hsl(194 82% 71% / 0.28)" strokeWidth={8} dot={false} isAnimationActive={false} name="Price glow" />
                  <Line type="monotone" dataKey="price" stroke="hsl(194 82% 71%)" strokeWidth={2.5} dot={{ fill: "hsl(194 82% 71%)", strokeWidth: 0, r: 3.5 }} activeDot={{ r: 5, fill: "hsl(164 70% 57%)" }} name="Price ($/kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">Reference: industry reports and publicly available research summaries.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="chart-note">2020 to 2028: $220 → $110</div>
              <div className="chart-note">Lower pricing as scale improves</div>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal delayMs={240} className="mx-auto mb-8 max-w-3xl text-center">
          <h3 className="text-2xl font-semibold text-foreground md:text-3xl">Industrial applications</h3>
          <p className="mt-3 text-sm text-muted-foreground">A compact view of where downstream demand is most likely to appear.</p>
        </SectionReveal>
        <SectionReveal delayMs={300} className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((uc, index) => (
            <button key={uc.title} type="button" onMouseEnter={() => setActiveApplication(index)} onFocus={() => setActiveApplication(index)} className={`metric-card neon-border group p-6 text-left ${activeApplication === index ? "border-accent/30 bg-accent/10" : ""}`}>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] transition-colors duration-300 group-hover:bg-white/[0.1]">
                <uc.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="mb-1 text-lg font-semibold text-accent">{uc.share}</div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">{uc.title}</h4>
              <p className="text-xs leading-6 text-muted-foreground">{uc.desc}</p>
            </button>
          ))}
        </SectionReveal>
        <SectionReveal delayMs={340} className="mx-auto max-w-6xl mt-12">
          <div className="chart-stat-tile">
            <div className="eyebrow-label">Focused application insight</div>
            <div className="mt-2 text-lg font-semibold text-foreground">{useCases[activeApplication]?.title}</div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {useCases[activeApplication]?.desc} This category currently represents {useCases[activeApplication]?.share} of the modeled downstream opportunity mix.
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default MarketIntelligence;
