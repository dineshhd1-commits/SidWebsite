'use client';

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { CatalogGroup, CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getCatalogGroups, getCatalogItems } from '@/lib/data/catalog';
import { QuantityStepper } from '@/components/builder/QuantityStepper';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';

interface PhotographyStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

/** Single row in the photography selection list - a checkbox-style toggle
 * for single-select items, or an inline quantity stepper for team-size/
 * stepper items that are already selected. Deliberately not a big image
 * card: a clean list is what this step asks for. */
function PhotoListRow({
  item,
  isSelected,
  quantity,
  onSelect,
  onRemove,
  onUpdateQuantity,
}: {
  item: CatalogItem;
  isSelected: boolean;
  quantity: number;
  onSelect: () => void;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  const isStepper = item.quantityMode === 'stepper';

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3.5 transition-colors border-b border-gold-200/60 last:border-b-0 ${
        isSelected ? 'bg-gold-50' : 'hover:bg-gold-50/50'
      }`}
    >
      <button
        type="button"
        onClick={isStepper && isSelected ? undefined : onSelect}
        className="flex-1 min-w-0 flex items-center gap-4 text-left"
      >
        <span
          className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
            isSelected ? 'bg-maroon-800 border-maroon-800' : 'border-gold-400 bg-white'
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-gold-200" />}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-bold text-maroon-900">{item.name}</span>
          <span className="block text-xs text-maroon-700/70 line-clamp-1">{item.description}</span>
        </span>
      </button>

      {isStepper && isSelected && (
        <QuantityStepper
          value={quantity}
          onChange={(qty) => (qty <= 0 ? onRemove() : onUpdateQuantity(qty))}
          min={0}
          max={item.maxQuantity ?? undefined}
        />
      )}
    </div>
  );
}

function PhotoList({
  items,
  state,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
}: {
  items: CatalogItem[];
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-gold-300 bg-white overflow-hidden shadow-sm">
      {items.map((item) => {
        const cartLine = state.cart[item.id];
        const isSelected = !!cartLine;
        return (
          <PhotoListRow
            key={item.id}
            item={item}
            isSelected={isSelected}
            quantity={cartLine?.quantity ?? 1}
            onSelect={() => (isSelected ? onRemoveFromCart(item.id) : onAddToCart(item))}
            onRemove={() => onRemoveFromCart(item.id)}
            onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
          />
        );
      })}
    </div>
  );
}

export function PhotographyStep({ state, onAddToCart, onRemoveFromCart, onUpdateQuantity }: PhotographyStepProps) {
  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [groups, setGroups] = useState<CatalogGroup[]>([]);

  useEffect(() => {
    if (!state.eventTypeId) return;
    Promise.all([
      getCatalogItems(state.eventTypeId, 'photography'),
      getCatalogGroups(state.eventTypeId, 'photography'),
    ]).then(([i, g]) => {
      setItems(i);
      setGroups(g);
    });
  }, [state.eventTypeId]);

  if (items === null) {
    return <LoadingState label="Loading photography services..." />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Photography catalog not available yet"
        description="Our photography and videography services for this event type are still being added."
      />
    );
  }

  // Wedding splits its coverage across two groups (Deverakarya / Wedding Hall),
  // so those get a heading each. Event types with a single group keep the plain
  // ungrouped list they already had.
  const groupsWithItems = groups
    .map((g) => ({ group: g, groupItems: items.filter((i) => i.groupId === g.id) }))
    .filter((entry) => entry.groupItems.length > 0);
  const showGroupHeadings = groupsWithItems.length > 1;

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">
          Step 3: Photography &amp; Videography{' '}
          <span className="text-sm font-sans font-bold text-maroon-700/60">(Optional)</span>
        </h2>
        <p className="text-xs text-maroon-700/80">
          Select as many compatible services as you need - no limit here. You can skip this step if you don&apos;t need coverage.
        </p>
      </div>

      {showGroupHeadings ? (
        <div className="space-y-6">
          {groupsWithItems.map(({ group, groupItems }) => (
            <div key={group.id} className="space-y-3">
              <h3 className="font-playfair text-lg font-bold text-maroon-900">{group.name}</h3>
              <PhotoList
                items={groupItems}
                state={state}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            </div>
          ))}
        </div>
      ) : (
        <PhotoList
          items={items}
          state={state}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onUpdateQuantity={onUpdateQuantity}
        />
      )}
    </div>
  );
}
