import type { SimulationResults } from "@/lib/simulation";
import { Brain, CheckCircle2, AlertTriangle, XCircle, Lightbulb } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";

interface Props {
  results: SimulationResults;
}

const levelConfig = {
  high: { icon: CheckCircle2, color: "text-primary", border: "border-primary/30", bg: "bg-primary/5", label: "HIGH VIABILITY" },
  moderate: { icon: AlertTriangle, color: "text-accent", border: "border-accent/30", bg: "bg-accent/5", label: "MODERATE VIABILITY" },
  low: { icon: XCircle, color: "text-destructive", border: "border-destructive/30", bg: "bg-destructive/5", label: "LOW VIABILITY" },
};

const AIRecommendation = ({ results }: Props) => {
  const config = levelConfig[results.recommendationLevel];
  const Icon = config.icon;

  return (
    <section className="section-shell">
      <div className="container mx-auto px-6">
        <SectionReveal className="mx-auto mb-12 max-w-3xl text-center">
          <div className="section-kicker mb-5">Decision guidance</div>
          <h2 className="section-title">
            Turn the numbers into a <span className="text-gradient-primary">clear next move</span>
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            The recommendation layer condenses the scenario into a concise viability signal and a short list of strategic next steps.
          </p>
        </SectionReveal>

        <div className="max-w-3xl mx-auto">
          <SectionReveal className={`glass-panel-strong neon-border mb-8 p-8 ${config.border} ${config.bg}`}>
            <div className="mb-4 flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <span className={`text-xs font-mono font-bold ${config.color} tracking-widest`}>{config.label}</span>
            </div>
            <div className="flex items-start gap-4">
              <Icon className={`mt-1 h-8 w-8 flex-shrink-0 ${config.color}`} />
              <p className="text-lg text-foreground leading-relaxed">{results.recommendation}</p>
            </div>
          </SectionReveal>

          <SectionReveal delayMs={120} className="glass-panel neon-border p-6">
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Strategic Suggestions</h3>
            </div>
            <div className="space-y-3">
              {results.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <span className="text-xs font-mono font-bold text-primary mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-foreground">{s}</p>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delayMs={200} className="glass-panel neon-border mt-8 p-6">
            <h3 className="mb-4 font-semibold">Revenue Streams</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "SaaS Subscription for Sugar Mills",
                "Consulting & Feasibility Services",
                "Carbon Credit Advisory",
                "Government Sustainability Programs",
              ].map((stream) => (
                <div key={stream} className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{stream}</span>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendation;
