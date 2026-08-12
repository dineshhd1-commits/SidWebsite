'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronRight, Search, UtensilsCrossed, X } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { CateringMenuCategory, CateringTiming } from '@/lib/types/catering-menu';
import { getCategoriesForTiming, isBreakfastAvailableForEventType } from '@/lib/data/catering-menu';
import { GlassCard } from '@/components/ui/glass-card';
import { EmptyState } from '@/components/builder/EmptyState';

// Only rendered once a category is opened - deferred out of the initial route bundle.
const CateringCategoryModal = dynamic(() => import('@/components/builder/CateringCategoryModal').then((m) => m.CateringCategoryModal));

interface CateringStepProps {
  state: EventBuilderState;
  onSetTiming: (timing: CateringTiming) => void;
  onSetGuestCount: (timing: CateringTiming, guestCount: number) => void;
  onToggleItem: (categoryId: string, categoryName: string, itemId: string, itemName: string) => void;
}

const TIMING_OPTIONS: { id: CateringTiming; label: string; hint: string }[] = [
  { id: 'evening', label: 'Evening', hint: 'Dinner menu' },
  { id: 'morning', label: 'Morning', hint: 'Breakfast menu' },
  { id: 'afternoon', label: 'Afternoon', hint: 'Lunch menu' },
];

export function CateringStep({ state, onSetTiming, onSetGuestCount, onToggleItem }: CateringStepProps) {
  const [search, setSearch] = useState('');
  const [modalCategoryId, setModalCategoryId] = useState<string | null>(null);

  const breakfastAvailable = isBreakfastAvailableForEventType(state.eventTypeId);
  const categories = state.cateringTiming ? getCategoriesForTiming(state.cateringTiming, state.eventTypeId) : [];

  const normalizedSearch = search.trim().toLowerCase();
  const visibleCategories: CateringMenuCategory[] = useMemo(() => {
    if (!normalizedSearch) return categories;
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(normalizedSearch) ||
        category.items.some((item) => item.name.toLowerCase().includes(normalizedSearch))
    );
  }, [categories, normalizedSearch]);

  const selectedCount = Object.keys(state.cateringSelections).length;
  const selectionsByCategory = useMemo(() => {
    const selectionsList = Object.values(state.cateringSelections);
    const map = new Map<string, { categoryName: string; lines: typeof selectionsList }>();
    for (const line of selectionsList) {
      const existing = map.get(line.categoryId);
      if (existing) existing.lines.push(line);
      else map.set(line.categoryId, { categoryName: line.categoryName, lines: [line] });
    }
    return map;
  }, [state.cateringSelections]);

  const modalCategory = modalCategoryId ? categories.find((c) => c.id === modalCategoryId) || null : null;

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 4: Catering</h2>
        <p className="text-xs text-maroon-700/80">
          Choose your catering timing, then open a category to build your menu.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-maroon-900">
          Catering Timing <span className="text-rose-600">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {TIMING_OPTIONS.map((option) => {
            const disabled = option.id === 'morning' && !breakfastAvailable;
            return (
              <button
                key={option.id}
                onClick={() => !disabled && onSetTiming(option.id)}
                disabled={disabled}
                title={disabled ? 'Breakfast menu is not available for this event type.' : undefined}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border text-left ${
                  state.cateringTiming === option.id
                    ? 'bg-maroon-800 text-gold-300 border-gold-400 shadow-sm'
                    : disabled
                    ? 'bg-gold-50/40 text-maroon-400 border-gold-200 cursor-not-allowed opacity-50'
                    : 'bg-white text-maroon-900 border-gold-300 hover:bg-gold-50'
                }`}
              >
                <span className="block">{option.label}</span>
                <span className="block text-[10px] font-medium opacity-70">{option.hint}</span>
              </button>
            );
          })}
        </div>
        {!state.cateringTiming && (
          <p className="text-[11px] text-rose-600 font-bold">Please select a catering timing to continue.</p>
        )}
      </div>

      {state.cateringTiming && (
        <div className="space-y-1.5 max-w-xs">
          <label htmlFor="catering-guest-count" className="block text-xs font-bold text-maroon-900">
            Guests for {TIMING_OPTIONS.find((o) => o.id === state.cateringTiming)?.label}{' '}
            <span className="font-medium text-maroon-700/70">
              ({TIMING_OPTIONS.find((o) => o.id === state.cateringTiming)?.hint.toLowerCase()})
            </span>
          </label>
          <input
            id="catering-guest-count"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="e.g. 300"
            value={state.cateringGuestCounts[state.cateringTiming] || ''}
            onChange={(e) =>
              onSetGuestCount(state.cateringTiming!, Math.max(0, parseInt(e.target.value) || 0))
            }
            className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
          />
          <p className="text-[10px] text-maroon-700/70">
            How many guests are expected for this meal. Each meal is counted separately.
          </p>
        </div>
      )}

      {state.cateringTiming && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories or dishes..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gold-300 bg-white text-sm text-maroon-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-maroon-500 hover:text-maroon-800"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {visibleCategories.length === 0 ? (
              <EmptyState title="No categories found" description="Try a different search term." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {visibleCategories.map((category) => {
                  const selectedInCategory = category.items.filter((item) => state.cateringSelections[item.id]).length;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setModalCategoryId(category.id)}
                      className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border border-gold-300 bg-white text-left shadow-sm hover:shadow-md hover:border-gold-400 hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center shrink-0 text-gold-700">
                          <UtensilsCrossed className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-playfair text-sm font-bold text-maroon-900 truncate">{category.name}</p>
                          <p className="text-[10px] text-maroon-700/70">
                            {category.items.length} dish{category.items.length === 1 ? '' : 'es'}
                            {category.maxSelections !== undefined && (
                              <span className="ml-1">(max {category.maxSelections})</span>
                            )}
                            {selectedInCategory > 0 && (
                              <span className="ml-2 text-gold-700 font-bold uppercase tracking-wide bg-gold-100 border border-gold-300 rounded-full px-1.5 py-0.5">
                                {selectedInCategory} selected
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-maroon-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-32">
            <GlassCard variant="dark" className="space-y-4">
              <div className="flex justify-between items-center border-b border-gold-400/40 pb-3">
                <h3 className="font-playfair text-lg font-bold text-gold-300">Menu Selections</h3>
                <span className="text-[10px] uppercase font-bold text-gold-200 bg-maroon-900 px-2 py-0.5 rounded border border-gold-400/40">
                  {selectedCount} item{selectedCount === 1 ? '' : 's'}
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto pr-1 space-y-4">
                {selectionsByCategory.size === 0 ? (
                  <p className="text-xs text-gold-200/70 py-6 text-center">No dishes selected yet.</p>
                ) : (
                  Array.from(selectionsByCategory.entries()).map(([categoryId, group]) => (
                    <div key={categoryId} className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gold-400">{group.categoryName}</p>
                      {group.lines.map((line) => (
                        <div key={line.itemId} className="flex items-center justify-between gap-2 text-xs text-gold-100">
                          <span className="truncate">
                            {line.itemName}
                            {line.quantity > 1 ? ` x${line.quantity}` : ''}
                          </span>
                          <button
                            onClick={() => onToggleItem(line.categoryId, line.categoryName, line.itemId, line.itemName)}
                            className="text-gold-400 hover:text-rose-300 shrink-0"
                            aria-label={`Remove ${line.itemName}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
              <p className="text-[10px] text-gold-200/60 border-t border-gold-400/40 pt-3">
                Final pricing for your selected dishes will be confirmed by our team after enquiry.
              </p>
            </GlassCard>
          </div>
        </div>
      )}

      {modalCategory && (
        <CateringCategoryModal
          category={modalCategory}
          selectedItemIds={new Set(Object.keys(state.cateringSelections))}
          onToggleItem={onToggleItem}
          onClose={() => setModalCategoryId(null)}
        />
      )}
    </div>
  );
}
