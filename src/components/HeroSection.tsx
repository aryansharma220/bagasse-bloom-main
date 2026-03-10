import { ArrowDown, ArrowRight, Atom, Leaf, Sparkles, TrendingUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import SectionReveal from "@/components/SectionReveal";

const HeroSection = () => {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden px-4 pb-16 pt-32 md:px-6 md:pb-20 md:pt-36">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Graphene molecular structure" className="h-full w-full object-cover opacity-12 saturate-0" />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="neon-orb neon-orb-primary left-10 top-24 h-72 w-72 animate-pulse-slow" />
      <div className="neon-orb neon-orb-accent orb-delay right-10 bottom-20 h-96 w-96 animate-pulse-slow" />
      <div className="neon-orb neon-orb-primary float-delay-1 left-1/3 top-1/4 h-40 w-40 opacity-35" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionReveal>
          <div className="section-kicker mb-6">
            <Sparkles className="h-4 w-4 text-primary neon-text" />
            Sustainable materials intelligence
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-foreground md:text-7xl lg:text-[5.5rem]">
            A calmer, clearer way to evaluate
            <span className="text-gradient-primary neon-text"> bagasse-to-graphene </span>
            opportunities.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            BioGraphX turns process assumptions, production estimates, and financial signals into a
            polished feasibility interface built for thoughtful exploration.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#simulator" className="button-primary">
              Open simulator
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#market" className="button-secondary">
              View market context
            </a>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Leaf, label: "Carbon impact", value: "1.5 tCO₂ saved / ton" },
              { icon: TrendingUp, label: "Market growth", value: "38% CAGR outlook" },
              { icon: Atom, label: "Technology readiness", value: "TRL 5–6 pathway" },
            ].map((stat) => (
              <div key={stat.label} className="metric-card neon-border">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06] text-primary subtle-ring">
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delayMs={140} className="glass-panel-strong neon-border scanlines relative overflow-hidden p-5 md:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent" />
          <div className="relative rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Scenario preview</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">Minimal, insight-first modeling</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-primary neon-text">
                Live inputs
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Daily bagasse feed", value: "10 tons", tone: "bg-primary/18" },
                { label: "Estimated GO output", value: "247.5 kg", tone: "bg-accent/18" },
                { label: "Projected annual revenue", value: "$13.5M", tone: "bg-white/10" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 transition-all duration-300 hover:bg-white/[0.07]">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${item.tone}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Investment signal</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">High</p>
                <p className="mt-1 text-sm text-muted-foreground">Positive revenue spread under baseline assumptions.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Interface feel</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">Smooth</p>
                <p className="mt-1 text-sm text-muted-foreground">Low-noise layout with glass layers and softer motion.</p>
              </div>
            </div>

            <a href="#simulator" className="mt-6 inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-accent">
              Start with your own values
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default HeroSection;
