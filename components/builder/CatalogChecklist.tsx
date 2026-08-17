'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { CatalogItem } from '@/lib/types/catalog';
import { QuantityStepper } from '@/components/builder/QuantityStepper';

/** Shared checkbox-style row for a "clean list, not cards" selection - used by
 * Decoration's add-on service lists and Photography's service lists so both
 * look and behave identically. Deliberately not a big image card: this is a
 * scannable list. */
export function CatalogChecklistRow({
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

export function CatalogChecklist({
  items,
  selectedIds,
  quantities,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
}: {
  items: CatalogItem[];
  /** Which catalog item ids currently have a cart line. */
  selectedIds: Set<string>;
  /** Quantity for stepper-mode items - looked up by item id. */
  quantities: Record<string, number>;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-gold-300 bg-white overflow-hidden shadow-sm">
      {items.map((item) => {
        const isSelected = selectedIds.has(item.id);
        return (
          <CatalogChecklistRow
            key={item.id}
            item={item}
            isSelected={isSelected}
            quantity={quantities[item.id] ?? 1}
            onSelect={() => (isSelected ? onRemoveFromCart(item.id) : onAddToCart(item))}
            onRemove={() => onRemoveFromCart(item.id)}
            onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
          />
        );
      })}
    </div>
  );
}
