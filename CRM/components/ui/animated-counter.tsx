'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2000,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Parse target number, decimal places, and suffix
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const target = parseFloat(match[1]);
    const suffix = match[2] || '';
    const isFloat = match[1].includes('.');
    const decimals = isFloat ? match[1].split('.')[1].length : 0;

    const element = elementRef.current;
    if (!element) return;

    const startAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const startTime = performance.now();

      const updateCount = (now: number) => {
        const elapsedTime = now - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Cubic Ease-Out curve for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = target * easeProgress;

        if (decimals > 0) {
          setDisplayValue(currentValue.toFixed(decimals) + suffix);
        } else {
          setDisplayValue(Math.floor(currentValue) + suffix);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setDisplayValue(target.toFixed(decimals) + suffix);
        }
      };

      requestAnimationFrame(updateCount);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
};
