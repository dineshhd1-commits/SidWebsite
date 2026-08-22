'use client';

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface NumericQuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  onRemove?: () => void;
  min?: number;
  max?: number;
  placeholder?: string;
  unitLabel?: string;
}

export function NumericQuantityInput({
  value,
  onChange,
  onRemove,
  min = 1,
  max,
  placeholder = '1',
  unitLabel,
}: NumericQuantityInputProps) {
  const [text, setText] = useState<string>(value > 0 ? String(value) : '');

  useEffect(() => {
    setText(value > 0 ? String(value) : '');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setText(raw);
    if (raw === '') {
      // Allow empty while typing
      return;
    }
    let num = parseInt(raw, 10);
    if (!isNaN(num)) {
      if (max !== undefined && num > max) num = max;
      onChange(num);
    }
  };

  const handleBlur = () => {
    if (text === '' || parseInt(text, 10) < min) {
      if (onRemove && (text === '' || parseInt(text, 10) <= 0)) {
        onRemove();
      } else {
        setText(String(min));
        onChange(min);
      }
    } else {
      let num = parseInt(text, 10);
      if (max !== undefined && num > max) num = max;
      setText(String(num));
      onChange(num);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-bold text-maroon-900 shrink-0">Quantity:</label>
        <input
          type="number"
          min={min}
          max={max}
          inputMode="numeric"
          placeholder={placeholder}
          value={text}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-24 bg-white border border-gold-300 rounded-xl px-3 py-1.5 text-sm font-bold text-maroon-900 text-center focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30 shadow-inner"
        />
        {unitLabel && <span className="text-xs text-maroon-700/70">{unitLabel}</span>}
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-maroon-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          title="Remove from selections"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
