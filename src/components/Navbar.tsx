import { Atom, ArrowRight } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div className="glass-panel neon-border mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-6">
        <a href="#top" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-[0_0_24px_hsl(164_70%_57%_/_0.14)]">
            <Atom className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-gradient-primary">BioGraph</span>
            <span className="text-gradient-accent">X</span>
          </span>
        </a>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-2 md:flex">
          {[
            { href: "#simulator", label: "Simulator" },
            { href: "#market", label: "Market" },
            { href: "#about", label: "About" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:bg-white/[0.06] hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a href="#simulator" className="button-secondary hidden md:inline-flex">
          Explore
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
