import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  threshold?: number;
}

const delayClassMap: Record<number, string> = {
  0: "reveal-delay-0",
  80: "reveal-delay-80",
  100: "reveal-delay-100",
  120: "reveal-delay-120",
  140: "reveal-delay-140",
  180: "reveal-delay-180",
  200: "reveal-delay-200",
  220: "reveal-delay-220",
  240: "reveal-delay-240",
  280: "reveal-delay-280",
  300: "reveal-delay-300",
};

const SectionReveal = ({
  children,
  className,
  delayMs = 0,
  threshold = 0.18,
}: SectionRevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={cn("reveal", delayClassMap[delayMs] ?? "reveal-delay-0", isVisible && "reveal-visible", className)}>
      {children}
    </div>
  );
};

export default SectionReveal;
