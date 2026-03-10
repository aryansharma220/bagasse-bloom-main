import { ArrowRight } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";

const steps = [
  { step: "01", title: "Drying", desc: "Stabilize feedstock by reducing moisture before thermal conversion." },
  { step: "02", title: "Pyrolysis", desc: "Convert dried biomass into carbon-rich biochar under controlled heat." },
  { step: "03", title: "Oxidation", desc: "Process the carbon structure into graphene oxide with chemical treatment." },
  { step: "04", title: "Refinement", desc: "Purify, filter, and dry the material into a usable final output." },
];

const ProcessFlow = () => {
  return (
    <section className="section-shell">
      <div className="container mx-auto px-6">
        <SectionReveal className="mx-auto mb-14 max-w-3xl text-center">
          <div className="section-kicker mb-5">Process architecture</div>
          <h2 className="section-title">
            A simple, readable view of the <span className="text-gradient-accent">conversion pathway</span>
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            The workflow is presented as a clean four-stage sequence, making the industrial logic easier to understand at a glance.
          </p>
        </SectionReveal>

        <SectionReveal delayMs={120} className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.step} className="relative flex flex-col items-center">
              <div className="glass-panel w-full p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
                <div className="mb-8 flex items-center justify-between">
                  <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium tracking-[0.3em] text-muted-foreground">
                    Step
                  </div>
                  <div className="text-3xl font-semibold tracking-[-0.06em] text-white/25">
                  {s.step}
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-white/30 md:block" />
              )}
            </div>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
};

export default ProcessFlow;
