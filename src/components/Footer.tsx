import { Atom } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";

const Footer = () => (
  <footer id="about" className="section-shell pb-14 pt-10">
    <div className="container mx-auto px-6 text-center">
      <SectionReveal className="glass-panel mx-auto max-w-4xl px-6 py-10 md:px-10">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
            <Atom className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold">
            <span className="text-gradient-primary">BioGraph</span>
            <span className="text-gradient-accent">X</span>
          </span>
        </div>
        <p className="mx-auto mb-4 max-w-xl text-sm leading-7 text-muted-foreground">
          A refined feasibility interface for exploring biomass-to-graphene conversion through cleaner visuals, scenario inputs, and decision-oriented outputs.
        </p>
        <div className="mx-auto mb-5 h-px max-w-md bg-white/8" />
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Research context · financial modeling · sustainable materials
        </p>
      </SectionReveal>
    </div>
  </footer>
);

export default Footer;
