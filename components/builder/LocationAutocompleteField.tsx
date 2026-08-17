'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { KARNATAKA_LOCATIONS } from '@/lib/data/karnataka-locations';
import { sanitizeAlphaInput } from '@/lib/text-validation';

interface LocationAutocompleteFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className: string;
  id?: string;
}

const MIN_CHARS = 2;
const MAX_SUGGESTIONS = 8;

/** Plain-text input with letters-only sanitization plus a Karnataka-only
 * autocomplete dropdown - typing 2+ letters shows matching towns/cities/
 * localities, prioritizing names that start with what's typed. */
export function LocationAutocompleteField({ value, onChange, placeholder, className, id }: LocationAutocompleteFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (query.length < MIN_CHARS) return [];
    const startsWith = KARNATAKA_LOCATIONS.filter((loc) => loc.toLowerCase().startsWith(query));
    const contains = KARNATAKA_LOCATIONS.filter(
      (loc) => !loc.toLowerCase().startsWith(query) && loc.toLowerCase().includes(query)
    );
    return [...startsWith, ...contains].slice(0, MAX_SUGGESTIONS);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: string) => {
    onChange(loc);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(sanitizeAlphaInput(e.target.value));
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen && suggestions.length > 0}
        aria-autocomplete="list"
        className={className}
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gold-300 rounded-xl shadow-lg max-h-56 overflow-y-auto py-1">
          {suggestions.map((loc, i) => (
            <li key={loc}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(loc)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                  i === highlightedIndex ? 'bg-gold-100 text-maroon-900' : 'text-maroon-800 hover:bg-gold-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                {loc}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
