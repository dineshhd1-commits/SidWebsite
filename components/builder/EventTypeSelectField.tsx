'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { EventType } from '@/lib/types/catalog';

interface EventTypeSelectFieldProps {
  eventTypes: EventType[];
  value: string | null;
  onChange: (eventTypeId: string) => void;
}

export function EventTypeSelectField({ eventTypes, value, onChange }: EventTypeSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = eventTypes.find((et) => et.id === value) || null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
      >
        <span className={selected ? 'text-maroon-900 font-bold' : 'text-maroon-700/50'}>
          {selected ? selected.name : 'Select an event type...'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gold-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto bg-white border-2 border-gold-300 rounded-xl shadow-2xl p-1.5">
          {eventTypes.map((et) => {
            const isSelected = et.id === value;
            return (
              <button
                key={et.id}
                type="button"
                onClick={() => {
                  onChange(et.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                  isSelected ? 'bg-maroon-800 text-gold-300' : 'text-maroon-900 hover:bg-gold-50'
                }`}
              >
                <span className="font-bold">{et.name}</span>
                <span className="flex items-center gap-2">
                  {!et.isCatalogReady && (
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${isSelected ? 'border-gold-400 text-gold-300' : 'border-gold-300 text-gold-700 bg-gold-50'}`}>
                      Coming Soon
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4" />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
