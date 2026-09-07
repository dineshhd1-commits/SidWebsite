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
    <div className="flex items-center gap-1.5 bg-maroon-800 text-gold-300 px-2.5 py-1 rounded-xl border border-gold-400 shadow-xs">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(Math.max(min, value - 1));
        }}
        disabled={value <= min}
        className="p-1 hover:text-gold-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') return;
          const num = parseInt(raw, 10);
          if (!isNaN(num)) {
            const clamped = Math.max(min, max !== undefined ? Math.min(max, num) : num);
            onChange(clamped);
          }
        }}
        className="font-bold text-sm w-12 text-center bg-maroon-900/60 text-gold-200 border border-gold-400/40 rounded px-1 py-0.5 focus:outline-none focus:border-gold-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(value + 1);
        }}
        disabled={atMax}
        className="p-1 hover:text-gold-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
