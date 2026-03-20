import type { SimulationResults } from "@/lib/simulation";
import { Brain, CheckCircle2, AlertTriangle, XCircle, Lightbulb } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  results: SimulationResults;
  liveRecommendation?: string | null;
  isLiveLoading?: boolean;
  liveError?: string | null;
}

const levelConfig = {
  high: { icon: CheckCircle2, color: "text-primary", border: "border-primary/30", bg: "bg-primary/5", label: "HIGH VIABILITY" },
  moderate: { icon: AlertTriangle, color: "text-accent", border: "border-accent/30", bg: "bg-accent/5", label: "MODERATE VIABILITY" },
  low: { icon: XCircle, color: "text-destructive", border: "border-destructive/30", bg: "bg-destructive/5", label: "LOW VIABILITY" },
};

const AIRecommendation = ({ results, liveRecommendation = null, isLiveLoading = false, liveError = null }: Props) => {
  const config = levelConfig[results.recommendationLevel];
  const Icon = config.icon;
  const recommendationText = liveRecommendation || results.recommendation;

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
              <div className="min-w-0 flex-1">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-2xl font-bold text-foreground mb-4 mt-6 first:mt-0" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-xl font-semibold text-foreground mb-3 mt-5" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-lg font-semibold text-foreground mb-2 mt-4" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-base text-foreground leading-relaxed mb-3" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-primary" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-accent" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside space-y-2 ml-4 mb-3" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside space-y-2 ml-4 mb-3" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-base text-foreground" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, ...props }) =>
                      inline ? (
                        <code className="bg-white/10 px-2 py-0.5 rounded text-sm font-mono text-primary" {...props} />
                      ) : (
                        <code className="block bg-white/10 p-4 rounded-lg text-sm font-mono text-primary overflow-x-auto mb-3" {...props} />
                      ),
                    hr: ({ node, ...props }) => (
                      <hr className="border-white/10 my-6" {...props} />
                    ),
                  }}
                >
                  {recommendationText}
                </ReactMarkdown>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              {isLiveLoading && "Refreshing AI recommendation from live market context..."}
              {!isLiveLoading && liveError && `Live AI unavailable: ${liveError}. Showing model-based local recommendation.`}
              {!isLiveLoading && !liveError && liveRecommendation && "Live AI recommendation is active."}
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
