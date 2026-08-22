'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronRight, Search, UtensilsCrossed, X, FastForward, CheckCircle2 } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { CateringMenuCategory, CateringMenuSection, CateringTiming } from '@/lib/types/catering-menu';
import { getCategoriesForTiming, getSectionsForTiming } from '@/lib/data/catering-menu';
import { getAvailableCateringTimeSlots, isCateringCategoryAllowed } from '@/lib/builder/event-rules';
import { GlassCard } from '@/components/ui/glass-card';
import { EmptyState } from '@/components/builder/EmptyState';
import { MAX_GUEST_COUNT } from '@/lib/builder/validation';
import { TimeSlotSelector } from '@/components/builder/TimeSlotSelector';

// Only rendered once a category is opened - deferred out of the initial route bundle.
const CateringCategoryModal = dynamic(() =>
  import('@/components/builder/CateringCategoryModal').then((m) => m.CateringCategoryModal)
);

interface CateringStepProps {
  state: EventBuilderState;
  onSetTiming: (timing: CateringTiming | null) => void;
  onSetGuestCount: (timing: CateringTiming, guestCount: number) => void;
  onToggleItem: (
    menuType: CateringTiming,
    categoryId: string,
    categoryName: string,
    itemId: string,
    itemName: string
  ) => void;
  onSkip?: () => void;
  onUnskip?: () => void;
}

function CategoryTile({
  category,
  selectedInCategory,
  onOpen,
}: {
  category: CateringMenuCategory;
  selectedInCategory: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border border-gold-300 bg-white text-left shadow-sm hover:shadow-md hover:border-gold-400 hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center shrink-0 text-gold-700">
          <UtensilsCrossed className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="font-playfair text-sm font-bold text-maroon-900 truncate">{category.name}</p>
          <p className="text-[10px] text-maroon-700/70">
            {category.items.length} dish{category.items.length === 1 ? '' : 'es'}
            {category.maxSelections !== undefined && <span className="ml-1">(max {category.maxSelections})</span>}
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
}

const MENU_DISPLAY_ORDER: CateringTiming[] = ['morning', 'afternoon', 'evening'];

const TIMING_LABELS: Record<CateringTiming, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

const TIMING_HINTS: Record<CateringTiming, string> = {
  morning: 'breakfast menu',
  afternoon: 'lunch menu',
  evening: 'dinner menu',
};

export function CateringStep({
  state,
  onSetTiming,
  onSetGuestCount,
  onToggleItem,
  onSkip,
  onUnskip,
}: CateringStepProps) {
  const [search, setSearch] = useState('');
  const [modalCategoryId, setModalCategoryId] = useState<string | null>(null);

  const availableSlots = getAvailableCateringTimeSlots(state.eventTypeId, state.cateringTiming);

  // Fetch raw categories and filter against event-specific restrictions (e.g. Engagement + Afternoon hides Welcome Drinks)
  const rawCategories = state.cateringTiming
    ? getCategoriesForTiming(state.cateringTiming, state.eventTypeId)
    : [];
  const categories = useMemo(() => {
    return rawCategories.filter((cat) =>
      isCateringCategoryAllowed(state.eventTypeId, state.cateringTiming, cat.id)
    );
  }, [rawCategories, state.eventTypeId, state.cateringTiming]);

  const rawSections = state.cateringTiming
    ? getSectionsForTiming(state.cateringTiming, state.eventTypeId)
    : null;
  const sections = useMemo(() => {
    if (!rawSections) return null;
    return rawSections
      .map((sec) => ({
        ...sec,
        categories: sec.categories.filter((cat) =>
          isCateringCategoryAllowed(state.eventTypeId, state.cateringTiming, cat.id)
        ),
      }))
      .filter((sec) => sec.categories.length > 0);
  }, [rawSections, state.eventTypeId, state.cateringTiming]);

  const normalizedSearch = search.trim().toLowerCase();
  const matchesSearch = (category: CateringMenuCategory) =>
    !normalizedSearch ||
    category.name.toLowerCase().includes(normalizedSearch) ||
    category.items.some((item) => item.name.toLowerCase().includes(normalizedSearch));

  const visibleCategories: CateringMenuCategory[] = useMemo(
    () => categories.filter(matchesSearch),
    [categories, normalizedSearch]
  );

  const visibleSections: CateringMenuSection[] | null = useMemo(() => {
    if (!sections) return null;
    return sections
      .map((section) => ({ name: section.name, categories: section.categories.filter(matchesSearch) }))
      .filter((section) => section.categories.length > 0);
  }, [sections, normalizedSearch]);

  const selectedCount = Object.keys(state.cateringSelections).length;

  const selectionsByMenu = useMemo(() => {
    const selectionsList = Object.values(state.cateringSelections);
    const byMenu = new Map<CateringTiming, Map<string, { categoryName: string; lines: typeof selectionsList }>>();
    for (const line of selectionsList) {
      if (!byMenu.has(line.menuType)) byMenu.set(line.menuType, new Map());
      const byCategory = byMenu.get(line.menuType)!;
      const existing = byCategory.get(line.categoryId);
      if (existing) existing.lines.push(line);
      else byCategory.set(line.categoryId, { categoryName: line.categoryName, lines: [line] });
    }
    return MENU_DISPLAY_ORDER.filter((menuType) => byMenu.has(menuType)).map((menuType) => ({
      menuType,
      categories: byMenu.get(menuType)!,
    }));
  }, [state.cateringSelections]);

  const selectedItemIdsForCurrentTiming = useMemo(() => {
    if (!state.cateringTiming) return new Set<string>();
    return new Set(
      Object.values(state.cateringSelections)
        .filter((line) => line.menuType === state.cateringTiming)
        .map((line) => line.itemId)
    );
  }, [state.cateringSelections, state.cateringTiming]);

  const handleToggleItem = (
    categoryId: string,
    categoryName: string,
    itemId: string,
    itemName: string
  ) => {
    if (!state.cateringTiming) return;
    onToggleItem(state.cateringTiming, categoryId, categoryName, itemId, itemName);
  };

  const modalCategory = modalCategoryId ? categories.find((c) => c.id === modalCategoryId) || null : null;

  const handleSelectSlot = (slot: CateringTiming | null) => {
    if (slot !== null && onUnskip) {
      onUnskip();
    }
    onSetTiming(slot);
  };

  const isSkipped = !!state.cateringSkipped;

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 4: Catering</h2>
          <p className="text-xs text-maroon-700/80">
            Choose your catering timing, then open a category to build your menu.
          </p>
        </div>

        {/* Global Skip Button */}
        <div>
          {isSkipped ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Catering Skipped
              <button
                type="button"
                onClick={onUnskip}
                className="text-xs text-maroon-800 underline font-semibold ml-1 hover:text-maroon-950 cursor-pointer"
              >
                Choose Catering
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-100/80 hover:bg-gold-200 border border-gold-300 text-maroon-900 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5 text-gold-700" />
              Skip Catering &rarr;
            </button>
          )}
        </div>
      </div>

      {isSkipped ? (
        <GlassCard variant="warm" className="p-6 text-center space-y-3 border border-gold-300">
          <p className="font-playfair text-lg font-bold text-maroon-900">
            Catering Has Been Skipped
          </p>
          <p className="text-xs text-maroon-800/80 max-w-md mx-auto">
            You can proceed to the next step without selecting food menus. If you change your mind, choose a time slot below anytime.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onUnskip}
              className="px-4 py-2 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Select A Time Slot
            </button>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Time Slot Selector with Single-Slot Locking */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-maroon-900">
                Catering Timing <span className="text-rose-600">*</span>
              </p>
              {state.cateringTiming && (
                <span className="text-[11px] text-maroon-700/70 font-medium">
                  Tap active slot again to switch
                </span>
              )}
            </div>

            <TimeSlotSelector
              availableSlots={availableSlots}
              selectedSlot={state.cateringTiming}
              onSelectSlot={handleSelectSlot}
            />

            {!state.cateringTiming && (
              <p className="text-[11px] text-rose-600 font-bold">
                Please select a catering timing to browse menus, or click &ldquo;Skip Catering&rdquo; above.
              </p>
            )}
          </div>

          {state.cateringTiming && (
            <div className="space-y-1.5 max-w-xs">
              <label htmlFor="catering-guest-count" className="block text-xs font-bold text-maroon-900">
                Guests for {TIMING_LABELS[state.cateringTiming]}{' '}
                <span className="font-medium text-maroon-700/70">
                  ({TIMING_HINTS[state.cateringTiming]})
                </span>
              </label>
              <input
                id="catering-guest-count"
                type="number"
                min={0}
                max={MAX_GUEST_COUNT}
                inputMode="numeric"
                placeholder="e.g. 300"
                value={state.cateringGuestCounts[state.cateringTiming] || ''}
                onChange={(e) =>
                  onSetGuestCount(
                    state.cateringTiming!,
                    Math.max(0, Math.min(MAX_GUEST_COUNT, parseInt(e.target.value) || 0))
                  )
                }
                className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
              />
              <p className="text-[10px] text-maroon-700/70">
                How many guests are expected for this meal (maximum {MAX_GUEST_COUNT.toLocaleString('en-IN')}).
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-maroon-500 hover:text-maroon-800 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {visibleSections ? (
                  visibleSections.length === 0 ? (
                    <EmptyState title="No categories found" description="Try a different search term." />
                  ) : (
                    <div className="space-y-5">
                      {visibleSections.map((section) => (
                        <div key={section.name} className="space-y-3">
                          <h3 className="font-playfair text-base font-bold text-maroon-900">{section.name}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {section.categories.map((category) => (
                              <CategoryTile
                                key={category.id}
                                category={category}
                                selectedInCategory={
                                  category.items.filter((item) =>
                                    selectedItemIdsForCurrentTiming.has(item.id)
                                  ).length
                                }
                                onOpen={() => setModalCategoryId(category.id)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : visibleCategories.length === 0 ? (
                  <EmptyState title="No categories found" description="Try a different search term." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {visibleCategories.map((category) => (
                      <CategoryTile
                        key={category.id}
                        category={category}
                        selectedInCategory={
                          category.items.filter((item) =>
                            selectedItemIdsForCurrentTiming.has(item.id)
                          ).length
                        }
                        onOpen={() => setModalCategoryId(category.id)}
                      />
                    ))}
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
                  <div className="max-h-96 overflow-y-auto pr-1 space-y-5">
                    {selectionsByMenu.length === 0 ? (
                      <p className="text-xs text-gold-200/70 py-6 text-center">No dishes selected yet.</p>
                    ) : (
                      selectionsByMenu.map(({ menuType, categories: categoryMap }) => {
                        return (
                          <div key={menuType} className="space-y-3">
                            <p className="text-xs font-bold text-gold-300 uppercase tracking-wide flex items-center gap-2 border-b border-gold-400/30 pb-1.5">
                              <span className="text-gold-400 text-[10px]" aria-hidden="true">&#9670;</span>
                              {TIMING_LABELS[menuType]} Menu
                            </p>
                            <div className="space-y-3 pl-1">
                              {Array.from(categoryMap.entries()).map(([categoryId, group]) => (
                                <div key={categoryId} className="space-y-1.5">
                                  <p className="text-[10px] uppercase tracking-wider font-bold text-gold-400">
                                    {group.categoryName}
                                  </p>
                                  {group.lines.map((line) => (
                                    <div
                                      key={line.itemId}
                                      className="flex items-center justify-between gap-2 text-xs text-gold-100"
                                    >
                                      <span className="truncate">
                                        {line.itemName}
                                        {line.quantity > 1 ? ` x${line.quantity}` : ''}
                                      </span>
                                      <button
                                        onClick={() =>
                                          onToggleItem(
                                            line.menuType,
                                            line.categoryId,
                                            line.categoryName,
                                            line.itemId,
                                            line.itemName
                                          )
                                        }
                                        className="text-gold-400 hover:text-rose-300 shrink-0 cursor-pointer"
                                        aria-label={`Remove ${line.itemName} from ${TIMING_LABELS[line.menuType]}`}
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
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
              selectedItemIds={selectedItemIdsForCurrentTiming}
              onToggleItem={handleToggleItem}
              onClose={() => setModalCategoryId(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
