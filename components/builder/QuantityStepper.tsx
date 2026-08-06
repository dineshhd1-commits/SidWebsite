'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 0, max }: QuantityStepperProps) {
  const atMax = max !== undefined && value >= max;
  return (
    <div className="flex items-center gap-3 bg-maroon-800 text-gold-300 px-3 py-1.5 rounded-xl border border-gold-400">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="p-1 hover:text-gold-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="font-bold text-sm min-w-[1.5ch] text-center">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        className="p-1 hover:text-gold-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
