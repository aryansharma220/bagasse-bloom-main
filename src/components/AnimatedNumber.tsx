import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  durationMs?: number;
  formatter?: (value: number) => string;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const defaultFormatter = (value: number) => value.toFixed(0);

const AnimatedNumber = ({
  value,
  durationMs = 850,
  formatter = defaultFormatter,
  className,
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const frameRef = useRef<number | null>(null);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const delta = value - startValue;
    const startTime = performance.now();

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);
      setDisplayValue(startValue + delta * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        previousValueRef.current = value;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [durationMs, value]);

  return <span className={className}>{formatter(displayValue)}</span>;
};

export default AnimatedNumber;
